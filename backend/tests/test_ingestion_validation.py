import pytest
import os
from backend.app.services.ingestion import TelemetryIngestionService
from backend.app.services.validation import DataValidationService

def test_csv_ingestion_and_validation():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

    records, raw_cols, invalid_rows = TelemetryIngestionService.load_from_csv(file_path)

    assert len(records) > 0, "Ingestion should yield valid records"
    assert "timestamp" in raw_cols or "Timestamp" in raw_cols

    # Ensure chronological order
    timestamps = [r.timestamp for r in records]
    assert sorted(timestamps) == timestamps, "Telemetry records must be chronologically ordered"

    report = DataValidationService.validate_telemetry(records, raw_cols, invalid_rows)
    assert report.valid_rows == len(records)
    assert report.total_rows >= report.valid_rows
    assert report.time_start is not None
    assert report.time_end is not None
