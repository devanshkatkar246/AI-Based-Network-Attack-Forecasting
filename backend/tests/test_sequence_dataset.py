import pytest
import os
from backend.app.services.ingestion import TelemetryIngestionService
from backend.app.services.windowing import WindowingService
from backend.app.services.state_builder import StateBuilderService
from backend.app.services.dataset_builder import SequenceDatasetBuilder

def test_sequence_construction_and_leakage_audit():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

    records, _, _ = TelemetryIngestionService.load_from_csv(file_path)
    windows = WindowingService.slice_into_windows(records, 10.0)

    states = []
    prev_edges = None
    for win in windows:
        st, prev_edges = StateBuilderService.build_network_state(win, prev_edges)
        states.append(st)

    assert len(states) > 0, "Scenario should yield valid states"

    builder = SequenceDatasetBuilder(context_length=3, forecast_horizon=2)
    audit_report = builder.verify_zero_leakage(states)

    assert audit_report["passed"] is True, "Data Leakage Audit MUST pass"
    assert audit_report["leakage_violations"] == 0, "Zero future window leakage violations allowed"
    assert audit_report["scaler_fitted"] is True, "Scaler must be fitted on training subset"
    assert audit_report["total_sequences"] > 0, "Sequence dataset must contain valid samples"
