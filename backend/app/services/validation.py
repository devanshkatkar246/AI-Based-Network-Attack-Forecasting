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

    @staticmethod
    def validate_trajectory(trajectory: List[Any]) -> Dict[str, Any]:
        errors = []
        warnings = []
        
        current_count = sum(1 for step in trajectory if getattr(step, "status", getattr(step, "semanticState", "")) in ["CURRENT", "current"])
        if current_count != 1:
            warnings.append(f"Trajectory contains {current_count} CURRENT steps (expected 1).")

        for idx, step in enumerate(trajectory):
            stage = str(getattr(step, "stage", "")).upper()
            tech_id = getattr(step, "techniqueId", None)
            if stage in ["BENIGN", "BASELINE", "NORMAL"] and tech_id and str(tech_id).startswith("T"):
                errors.append(f"Step '{stage}' has incompatible techniqueId '{tech_id}'.")
            if stage == "EXFILTRATION" and tech_id == "T1087.002":
                errors.append(f"Step Exfiltration has mismatched Discovery technique {tech_id}.")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings
        }
