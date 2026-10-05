import os
import pandas as pd
from typing import List, Tuple, Dict, Any, Optional
from datetime import datetime

try:
    from models.schemas import FlowTelemetry, DataQualityReport
    from app.services.ingestion import TelemetryIngestionService
    from app.services.validation import DataValidationService
except ImportError:
    from backend.models.schemas import FlowTelemetry, DataQualityReport
    from backend.app.services.ingestion import TelemetryIngestionService
    from backend.app.services.validation import DataValidationService

class CSVProcessor:
    """ Authoritative CSV Telemetry Ingestion, Mapping & Validation Engine """
    
    @classmethod
    def process_csv(cls, filepath: str) -> Tuple[List[FlowTelemetry], DataQualityReport]:
        records, raw_cols, invalid_rows = TelemetryIngestionService.load_from_csv(filepath)
        quality_report = DataValidationService.validate_telemetry(records, raw_cols, invalid_rows)
        return records, quality_report

    @classmethod
    def load_from_csv(cls, filepath: str) -> Tuple[List[FlowTelemetry], List[str], List[Dict[str, Any]]]:
        return TelemetryIngestionService.load_from_csv(filepath)

    @classmethod
    def validate(cls, records: List[FlowTelemetry], raw_cols: List[str], invalid_rows: List[Dict[str, Any]]) -> DataQualityReport:
        return DataValidationService.validate_telemetry(records, raw_cols, invalid_rows)
