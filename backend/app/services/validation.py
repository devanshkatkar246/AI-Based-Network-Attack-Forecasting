from typing import List, Dict, Any
from ..models.schemas import FlowTelemetry, DataQualityReport

class DataValidationService:
    @staticmethod
    def validate_telemetry(
        records: List[FlowTelemetry],
        raw_columns: List[str],
        invalid_rows: List[Dict[str, Any]]
    ) -> DataQualityReport:
        total_rows = len(records) + len(invalid_rows)
        valid_rows = len(records)
        invalid_count = len(invalid_rows)

        missing_value_counts = {
            "src_port": 0,
            "dst_port": 0,
            "tcp_flags": 0,
            "label": 0
        }

        for r in records:
            if r.src_port is None:
                missing_value_counts["src_port"] += 1
            if r.dst_port is None:
                missing_value_counts["dst_port"] += 1
            if r.tcp_flags is None:
                missing_value_counts["tcp_flags"] += 1
            if r.label is None:
                missing_value_counts["label"] += 1

        time_start = records[0].timestamp.isoformat() if records else None
        time_end = records[-1].timestamp.isoformat() if records else None

        return DataQualityReport(
            total_rows=total_rows,
            valid_rows=valid_rows,
            invalid_rows=invalid_count,
            missing_value_counts=missing_value_counts,
            time_start=time_start,
            time_end=time_end,
            detected_columns=raw_columns
        )
