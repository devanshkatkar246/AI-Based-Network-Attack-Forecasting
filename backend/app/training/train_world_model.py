import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from datetime import datetime
from typing import Dict, Any, Tuple, Optional

from ..services.ingestion import TelemetryIngestionService
from ..services.windowing import WindowingService
from ..services.state_builder import StateBuilderService
from ..services.dataset_builder import SequenceDatasetBuilder
from ..services.world_model_network import TemporalWorldModel

def calculate_ece(probs: np.ndarray, labels: np.ndarray, n_bins: int = 10) -> float:
    """Calculates Expected Calibration Error (ECE)."""
    if len(labels) == 0 or len(probs) == 0:
        return 0.0
    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    confidences = np.max(probs, axis=-1)
    predictions = np.argmax(probs, axis=-1)
    accuracies = predictions == labels

    ece = 0.0
    for i in range(n_bins):
        in_bin = (confidences > bin_boundaries[i]) & (confidences <= bin_boundaries[i + 1])
        prop_in_bin = np.mean(in_bin)
        if prop_in_bin > 0:
            accuracy_in_bin = np.mean(accuracies[in_bin])
            avg_confidence_in_bin = np.mean(confidences[in_bin])
            ece += np.abs(avg_confidence_in_bin - accuracy_in_bin) * prop_in_bin
    return float(ece)

def calculate_brier_score(probs: np.ndarray, labels: np.ndarray, num_classes: int = 5) -> float:
    """Calculates multi-class Brier Score."""
    if len(labels) == 0 or len(probs) == 0:
        return 0.0
    one_hot = np.eye(num_classes)[labels]
    return float(np.mean(np.sum((probs - one_hot) ** 2, axis=-1)))

def train_and_save_world_model(
    demo_csv_path: Optional[str] = None,
    output_dir: Optional[str] = None,
    epochs: int = 100,
    lr: float = 0.005
) -> Dict[str, Any]:
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    if demo_csv_path is None:
        demo_csv_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")
    if output_dir is None:
        output_dir = os.path.join(base_dir, "models", "world_model")

    os.makedirs(output_dir, exist_ok=True)

    # 1. Pipeline Ingestion & State Building
    records, _, _ = TelemetryIngestionService.load_from_csv(demo_csv_path)
    windows = WindowingService.slice_into_windows(records, window_size_seconds=10.0)

    states = []
    prev_edges = None
    for win in windows:
        st, prev_edges = StateBuilderService.build_network_state(win, prev_edges)
        states.append(st)

    # 2. Sequence Dataset Builder
    context_len = 3
    forecast_horiz = 2
    builder = SequenceDatasetBuilder(context_length=context_len, forecast_horizon=forecast_horiz)
    splits = builder.temporal_split(states, train_ratio=0.6, val_ratio=0.2)

    X_train, Y_feat_train, Y_label_train = splits["train"]
    X_test, Y_feat_test, Y_label_test = splits["test"]

    if len(X_train) == 0:
        # Fallback for very small telemetry streams
        X, Y_feat, Y_label, _ = builder.build_sequences(states)
        builder.fit_scaler(X.reshape(-1, 12))
        X_train, Y_feat_train, Y_label_train = X, Y_feat, Y_label
        X_test, Y_feat_test, Y_label_test = X, Y_feat, Y_label

    # PyTorch Tensors
    t_X_train = torch.tensor(X_train, dtype=torch.float32)
    t_Y_feat_train = torch.tensor(Y_feat_train, dtype=torch.float32)
    t_Y_label_train = torch.tensor(Y_label_train, dtype=torch.long)

    t_X_test = torch.tensor(X_test, dtype=torch.float32)

    # 3. Initialize PyTorch World Model
    model = TemporalWorldModel(
        input_dim=12,
        latent_dim=32,
        context_length=context_len,
        forecast_horizon=forecast_horiz,
        num_classes=5
    )

    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    mse_loss_fn = nn.MSELoss()
    ce_loss_fn = nn.CrossEntropyLoss()

    model.train()
    best_loss = float("inf")
    for epoch in range(epochs):
        optimizer.zero_grad()
        pred_states, pred_logits = model(t_X_train)

        loss_state = mse_loss_fn(pred_states, t_Y_feat_train)
        loss_class = ce_loss_fn(pred_logits.view(-1, 5), t_Y_label_train.view(-1))
        total_loss = loss_state + 0.5 * loss_class

        total_loss.backward()
        optimizer.step()

        if total_loss.item() < best_loss:
            best_loss = total_loss.item()
            torch.save(model.state_dict(), os.path.join(output_dir, "best.pt"))

    # 4. Evaluation Metrics
    model.eval()
    with torch.no_grad():
        test_states, test_logits = model(t_X_test)
        probs = torch.softmax(test_logits, dim=-1).numpy()

    # Flatten for horizon calibration
    probs_flat = probs.reshape(-1, 5)
    labels_flat = Y_label_test.reshape(-1)

    ece = calculate_ece(probs_flat, labels_flat)
    brier = calculate_brier_score(probs_flat, labels_flat)

    # Save Preprocessor Scaler
    scaler_dict = {
        "mean": builder.mean.tolist() if builder.mean is not None else [],
        "std": builder.std.tolist() if builder.std is not None else []
    }
    with open(os.path.join(output_dir, "scaler.json"), "w") as f:
        json.dump(scaler_dict, f, indent=2)

    # Save Configuration
    config_dict = {
        "context_length": context_len,
        "forecast_horizon": forecast_horiz,
        "input_dim": 12,
        "latent_dim": 32,
        "num_classes": 5
    }
    with open(os.path.join(output_dir, "config.json"), "w") as f:
        json.dump(config_dict, f, indent=2)

    # Save Metrics & Metadata
    metrics_dict = {
        "best_train_loss": float(best_loss),
        "test_ece": ece,
        "test_brier_score": brier,
        "evaluation_timestamp": datetime.now().isoformat()
    }
    with open(os.path.join(output_dir, "metrics.json"), "w") as f:
        json.dump(metrics_dict, f, indent=2)

    metadata_dict = {
        "model_name": "TemporalWorldModel",
        "version": "v2.0.0-phase2",
        "training_dataset": "enterprise_lateral_movement_01.csv",
        "context_length": context_len,
        "forecast_horizon": forecast_horiz,
        "offline_executable": True
    }
    with open(os.path.join(output_dir, "metadata.json"), "w") as f:
        json.dump(metadata_dict, f, indent=2)

    return {
        "status": "success",
        "checkpoint_saved": os.path.join(output_dir, "best.pt"),
        "metrics": metrics_dict
    }

if __name__ == "__main__":
    res = train_and_save_world_model()
    print("Training finished:", res)
