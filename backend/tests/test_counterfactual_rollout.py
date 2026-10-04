import pytest
import os
import numpy as np
from backend.app.services.ingestion import TelemetryIngestionService
from backend.app.services.windowing import WindowingService
from backend.app.services.state_builder import StateBuilderService
from backend.app.services.world_model_network import TemporalWorldModel
from backend.app.services.counterfactual_rollout import CounterfactualRolloutService
from backend.app.models.schemas import WhatIfRequest

def test_counterfactual_rollout():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

    records, _, _ = TelemetryIngestionService.load_from_csv(file_path)
    windows = WindowingService.slice_into_windows(records, 10.0)

    states = []
    prev_edges = None
    for win in windows:
        st, prev_edges = StateBuilderService.build_network_state(win, prev_edges)
        states.append(st)

    model = TemporalWorldModel(input_dim=12, latent_dim=32, context_length=3, forecast_horizon=2, num_classes=5)
    mean = np.zeros(12, dtype=np.float32)
    std = np.ones(12, dtype=np.float32)

    req = WhatIfRequest(scenario_id="enterprise-lateral-movement-01", intervention="isolate_host", host="10.0.2.45")
    response = CounterfactualRolloutService.simulate_counterfactual_rollout(model, mean, std, states, req)

    assert response.targetHost == "10.0.2.45"
    assert len(response.baselineTrajectory) > 0
    assert len(response.interventionTrajectory) > 0
    assert "Phase 2" in response.simulatedDivergenceNotice
