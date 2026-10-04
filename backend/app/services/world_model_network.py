import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple, Dict, Any

class StateEncoder(nn.Module):
    def __init__(self, input_dim: int = 12, latent_dim: int = 32):
        super().__init__()
        self.fc1 = nn.Linear(input_dim, 64)
        self.fc2 = nn.Linear(64, latent_dim)
        self.act = nn.GELU()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (B, L, input_dim)
        h = self.act(self.fc1(x))
        z = self.act(self.fc2(h))
        return z  # (B, L, latent_dim)

class TemporalDynamicsTransformer(nn.Module):
    def __init__(self, latent_dim: int = 32, num_heads: int = 4, num_layers: int = 2, max_len: int = 16):
        super().__init__()
        self.pos_embed = nn.Parameter(torch.zeros(1, max_len, latent_dim))
        encoder_layer = nn.TransformerEncoderLayer(d_model=latent_dim, nhead=num_heads, dim_feedforward=64, batch_first=True)
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

    def forward(self, z_seq: torch.Tensor) -> torch.Tensor:
        # z_seq: (B, L, latent_dim)
        seq_len = z_seq.size(1)
        z_pos = z_seq + self.pos_embed[:, :seq_len, :]
        out = self.transformer(z_pos)
        return out  # (B, L, latent_dim)

class ForecastDecoder(nn.Module):
    def __init__(self, latent_dim: int = 32, feature_dim: int = 12, num_classes: int = 5):
        super().__init__()
        self.state_head = nn.Sequential(
            nn.Linear(latent_dim, 32),
            nn.GELU(),
            nn.Linear(32, feature_dim)
        )
        self.class_head = nn.Sequential(
            nn.Linear(latent_dim, 32),
            nn.GELU(),
            nn.Linear(32, num_classes)
        )

    def forward(self, z_fut: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        # z_fut: (B, K, latent_dim)
        pred_states = self.state_head(z_fut)
        pred_logits = self.class_head(z_fut)
        return pred_states, pred_logits

class TemporalWorldModel(nn.Module):
    """
    Temporal Network World Model for Network Attack Forecasting.
    Learns latent network state transitions: z_t -> z_{t+1} -> ... -> z_{t+K}
    """
    def __init__(self, input_dim: int = 12, latent_dim: int = 32, context_length: int = 3, forecast_horizon: int = 2, num_classes: int = 5):
        super().__init__()
        self.context_length = context_length
        self.forecast_horizon = forecast_horizon
        self.latent_dim = latent_dim
        
        self.encoder = StateEncoder(input_dim=input_dim, latent_dim=latent_dim)
        self.dynamics = TemporalDynamicsTransformer(latent_dim=latent_dim)
        self.rollout_cell = nn.GRUCell(latent_dim, latent_dim)
        self.decoder = ForecastDecoder(latent_dim=latent_dim, feature_dim=input_dim, num_classes=num_classes)

    def forward(self, x_seq: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Input x_seq: (B, L, input_dim)
        Returns:
            pred_states: (B, K, input_dim)
            pred_logits: (B, K, num_classes)
        """
        B = x_seq.size(0)
        z_seq = self.encoder(x_seq)  # (B, L, latent_dim)
        z_trans = self.dynamics(z_seq)  # (B, L, latent_dim)

        # Current latent state z_t is the last step of sequence
        z_cur = z_trans[:, -1, :]  # (B, latent_dim)

        # Perform K-step rollout in latent space
        z_rollout = []
        z_step = z_cur
        for _ in range(self.forecast_horizon):
            z_step = self.rollout_cell(z_step, z_step)
            z_rollout.append(z_step.unsqueeze(1))

        z_fut = torch.cat(z_rollout, dim=1)  # (B, K, latent_dim)
        pred_states, pred_logits = self.decoder(z_fut)
        return pred_states, pred_logits
