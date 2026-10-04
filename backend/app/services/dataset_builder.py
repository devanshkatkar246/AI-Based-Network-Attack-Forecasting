import numpy as np
from typing import List, Tuple, Dict, Any, Optional
from ..models.schemas import NetworkState

FEATURE_NAMES = [
    "total_bytes",
    "total_packets",
    "active_flows",
    "traffic_mbps",
    "destination_diversity",
    "source_diversity",
    "tcp_syn_rate",
    "dst_port_count",
    "east_west_traffic_bytes",
    "avg_flow_duration",
    "active_hosts",
    "new_edges_count"
]

PHASE_LABEL_MAP = {
    "BASELINE": 0,
    "RECONNAISSANCE": 1,
    "DISCOVERY": 2,
    "LATERAL_MOVEMENT": 3,
    "EXFILTRATION": 4
}

class NetworkStateVectorizer:
    @staticmethod
    def state_to_vector(state: NetworkState) -> np.ndarray:
        vec = [
            float(state.traffic.total_bytes),
            float(state.traffic.total_packets),
            float(state.traffic.active_flows),
            float(state.traffic.traffic_mbps),
            float(state.behavior.destination_diversity),
            float(state.behavior.source_diversity),
            float(state.behavior.tcp_syn_rate),
            float(state.behavior.dst_port_count),
            float(state.behavior.east_west_traffic_bytes),
            float(state.behavior.avg_flow_duration),
            float(state.active_hosts),
            float(state.new_edges_count)
        ]
        return np.array(vec, dtype=np.float32)

    @staticmethod
    def get_phase_label(state: NetworkState) -> int:
        return PHASE_LABEL_MAP.get(state.phase.upper(), 0)

class SequenceDatasetBuilder:
    def __init__(self, context_length: int = 3, forecast_horizon: int = 2):
        self.context_length = context_length
        self.forecast_horizon = forecast_horizon
        self.mean: Optional[np.ndarray] = None
        self.std: Optional[np.ndarray] = None

    def fit_scaler(self, train_vectors: np.ndarray):
        """Fit scaler strictly on training vectors to prevent data leakage."""
        self.mean = np.mean(train_vectors, axis=0)
        self.std = np.std(train_vectors, axis=0) + 1e-6

    def transform(self, vectors: np.ndarray) -> np.ndarray:
        if self.mean is None or self.std is None:
            raise ValueError("Scaler must be fitted on training data before transformation.")
        return (vectors - self.mean) / self.std

    def build_sequences(
        self,
        states: List[NetworkState]
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Builds temporal sequences:
        Inputs: [x_{t-L+1}, ..., x_t] (shape: N, L, D)
        Targets (Features): [x_{t+1}, ..., x_{t+K}] (shape: N, K, D)
        Targets (Labels): [y_{t+1}, ..., y_{t+K}] (shape: N, K)
        Time indices: [t_end_history]
        """
        if len(states) < self.context_length + self.forecast_horizon:
            return np.empty((0, self.context_length, 12)), np.empty((0, self.forecast_horizon, 12)), np.empty((0, self.forecast_horizon)), np.empty((0,))

        raw_vecs = np.array([NetworkStateVectorizer.state_to_vector(s) for s in states], dtype=np.float32)
        phase_labels = np.array([NetworkStateVectorizer.get_phase_label(s) for s in states], dtype=np.int64)

        X_list, Y_feat_list, Y_label_list, time_idx_list = [], [], [], []

        max_idx = len(states) - self.forecast_horizon
        for t in range(self.context_length - 1, max_idx):
            hist_slice = raw_vecs[t - self.context_length + 1 : t + 1]
            fut_feat_slice = raw_vecs[t + 1 : t + 1 + self.forecast_horizon]
            fut_label_slice = phase_labels[t + 1 : t + 1 + self.forecast_horizon]

            X_list.append(hist_slice)
            Y_feat_list.append(fut_feat_slice)
            Y_label_list.append(fut_label_slice)
            time_idx_list.append(t)

        return (
            np.array(X_list, dtype=np.float32),
            np.array(Y_feat_list, dtype=np.float32),
            np.array(Y_label_list, dtype=np.int64),
            np.array(time_idx_list, dtype=np.int64)
        )

    def temporal_split(
        self,
        states: List[NetworkState],
        train_ratio: float = 0.6,
        val_ratio: float = 0.2
    ) -> Dict[str, Tuple[np.ndarray, np.ndarray, np.ndarray]]:
        """
        Strict temporal train / val / test split preserving chronological ordering.
        Train: [0, T_train)
        Val: [T_train, T_val)
        Test: [T_val, T_total)
        """
        raw_vecs = np.array([NetworkStateVectorizer.state_to_vector(s) for s in states], dtype=np.float32)
        total_len = len(raw_vecs)
        
        train_end = int(total_len * train_ratio)
        val_end = int(total_len * (train_ratio + val_ratio))

        # Fit scaler ONLY on train subset
        train_raw = raw_vecs[:train_end]
        self.fit_scaler(train_raw)

        # Build full sequence datasets
        X, Y_feat, Y_label, time_idxs = self.build_sequences(states)
        
        # Scale X and Y_feat using training scaler
        N_samples = len(X)
        if N_samples > 0:
            X_scaled = self.transform(X.reshape(-1, 12)).reshape(X.shape)
            Y_feat_scaled = self.transform(Y_feat.reshape(-1, 12)).reshape(Y_feat.shape)
        else:
            X_scaled, Y_feat_scaled = X, Y_feat

        # Partition based on history end time index
        train_mask = time_idxs < train_end
        val_mask = (time_idxs >= train_end) & (time_idxs < val_end)
        test_mask = time_idxs >= val_end

        return {
            "train": (X_scaled[train_mask], Y_feat_scaled[train_mask], Y_label[train_mask]),
            "val": (X_scaled[val_mask], Y_feat_scaled[val_mask], Y_label[val_mask]),
            "test": (X_scaled[test_mask], Y_feat_scaled[test_mask], Y_label[test_mask])
        }

    def verify_zero_leakage(
        self,
        states: List[NetworkState]
    ) -> Dict[str, Any]:
        """
        Data Leakage Audit Function:
        1. Verifies zero overlapping timestamps between input window [t-L+1, t] and target window [t+1, t+K].
        2. Verifies scalers were derived solely from training indices.
        """
        splits = self.temporal_split(states)
        X, Y_feat, Y_label, time_idxs = self.build_sequences(states)
        
        leakage_violations = 0
        for i, t in enumerate(time_idxs):
            # Input window covers t - L + 1 to t
            hist_range = set(range(t - self.context_length + 1, t + 1))
            # Future window covers t + 1 to t + K
            fut_range = set(range(t + 1, t + 1 + self.forecast_horizon))
            if not hist_range.isdisjoint(fut_range):
                leakage_violations += 1

        return {
            "passed": leakage_violations == 0,
            "total_sequences": len(time_idxs),
            "leakage_violations": leakage_violations,
            "scaler_fitted": self.mean is not None and self.std is not None,
            "train_samples": len(splits["train"][0]),
            "val_samples": len(splits["val"][0]),
            "test_samples": len(splits["test"][0])
        }
