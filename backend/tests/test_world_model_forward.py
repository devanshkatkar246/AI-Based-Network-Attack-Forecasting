import torch
import pytest
from backend.app.services.world_model_network import TemporalWorldModel

def test_world_model_shapes_and_rollout():
    batch_size = 4
    context_length = 3
    forecast_horizon = 2
    feature_dim = 12
    num_classes = 5

    model = TemporalWorldModel(
        input_dim=feature_dim,
        latent_dim=32,
        context_length=context_length,
        forecast_horizon=forecast_horizon,
        num_classes=num_classes
    )

    x_dummy = torch.randn(batch_size, context_length, feature_dim)
    pred_states, pred_logits = model(x_dummy)

    assert pred_states.shape == (batch_size, forecast_horizon, feature_dim)
    assert pred_logits.shape == (batch_size, forecast_horizon, num_classes)
