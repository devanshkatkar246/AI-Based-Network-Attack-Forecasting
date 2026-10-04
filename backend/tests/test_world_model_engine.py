import pytest
import os
from backend.app.services.ingestion import TelemetryIngestionService
from backend.app.services.windowing import WindowingService
from backend.app.services.state_builder import StateBuilderService
from backend.app.services.world_model_engine import TemporalWorldModelEngine
from backend.app.models.forecast_result import ForecastResult

def test_world_model_engine_forecast():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

    records, _, _ = TelemetryIngestionService.load_from_csv(file_path)
    windows = WindowingService.slice_into_windows(records, 10.0)

    states = []
    prev_edges = None
    for win in windows:
        st, prev_edges = StateBuilderService.build_network_state(win, prev_edges)
        states.append(st)

    engine = TemporalWorldModelEngine()
    result = engine.forecast(states)

    assert isinstance(result, ForecastResult)
    assert result.status == "success"
    assert "Phase 2" in result.engine_id
    assert len(result.trajectory) > 0
    assert len(result.evidence) > 0
