import torch
import pytest
from backend.app.services.world_model_network import TemporalWorldModel
from backend.app.services.attribution import IntegratedGradientsAttribution

def test_integrated_gradients_attribution():
    model = TemporalWorldModel(input_dim=12, latent_dim=32, context_length=3, forecast_horizon=2, num_classes=5)
    model.eval()

    dummy_input = torch.randn(1, 3, 12)
    attributions = IntegratedGradientsAttribution.attribute(model, dummy_input, target_class=3, steps=10)

    assert len(attributions) == 12
    assert "destination_diversity" in attributions
    assert "tcp_syn_rate" in attributions
    total_score = sum(attributions.values())
    assert 99.0 <= total_score <= 101.0  # Sum of percentage scores ~ 100%
