import pytest
import os
from datetime import datetime, timedelta
from backend.app.services.ingestion import TelemetryIngestionService
from backend.app.services.windowing import WindowingService
from backend.app.services.state_builder import StateBuilderService
from backend.app.services.forecasting import LightweightForecastEngine
from backend.app.models.forecast_result import ModelNotReadyResult, ForecastResult

def test_model_not_ready_behavior():
    engine = LightweightForecastEngine()
    result = engine.forecast([])
    assert isinstance(result, ModelNotReadyResult)
    assert result.status == "insufficient_history"
    assert result.warning_lead_time_seconds is None

def test_forecast_trajectory_and_lead_time():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

    records, _, _ = TelemetryIngestionService.load_from_csv(file_path)
    windows = WindowingService.slice_into_windows(records, 10.0)

    states = []
    prev_edges = None
    for win in windows:
        st, prev_edges = StateBuilderService.build_network_state(win, prev_edges)
        states.append(st)

    engine = LightweightForecastEngine()
    
    # Test without ground truth -> warning_lead_time_seconds must be None
    res_no_gt = engine.forecast(states, ground_truth_onset=None)
    assert isinstance(res_no_gt, ForecastResult)
    assert res_no_gt.status == "success"
    assert res_no_gt.warning_lead_time_seconds is None

    # Test with ground truth timestamp
    ground_truth = datetime.strptime(states[-1].timestamp, "%H:%M:%S UTC") + timedelta(seconds=75)
    res_gt = engine.forecast(states, ground_truth_onset=ground_truth)
    assert isinstance(res_gt, ForecastResult)
    assert res_gt.warning_lead_time_seconds == 75.0

    # Semantic states check
    semantic_states = [step.semanticState for step in res_gt.trajectory]
    assert "current" in semantic_states
    assert "forecast" in semantic_states
