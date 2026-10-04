import pytest
import os
from backend.app.services.ingestion import TelemetryIngestionService
from backend.app.services.windowing import WindowingService
from backend.app.services.state_builder import StateBuilderService

def test_temporal_windowing_and_state_construction():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

    records, raw_cols, invalid_rows = TelemetryIngestionService.load_from_csv(file_path)
    windows = WindowingService.slice_into_windows(records, window_size_seconds=10.0)

    assert len(windows) > 0, "Windowing should produce at least 1 window"

    prev_edges = None
    states = []
    for win in windows:
        state, prev_edges = StateBuilderService.build_network_state(win, prev_edges)
        states.append(state)

    assert len(states) == len(windows)
    for s in states:
        assert hasattr(s.traffic, "total_bytes")
        assert hasattr(s.behavior, "destination_diversity")
        assert hasattr(s, "topology")
