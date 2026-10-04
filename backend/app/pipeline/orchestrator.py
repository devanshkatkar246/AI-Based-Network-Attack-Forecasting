import os
from typing import List, Dict, Any, Optional
from ..models.schemas import NetworkState, DataQualityReport
from ..models.forecast_result import ForecastResult, ModelNotReadyResult
from ..services.ingestion import TelemetryIngestionService
from ..services.validation import DataValidationService
from ..services.windowing import WindowingService, TemporalWindow
from ..services.state_builder import StateBuilderService
from ..services.forecasting import LightweightForecastEngine
from ..services.world_model_engine import TemporalWorldModelEngine

class PipelineOrchestrator:
    def __init__(self, scenario_id: str = "enterprise-lateral-movement-01"):
        self.scenario_id = scenario_id
        self.raw_records = []
        self.quality_report: Optional[DataQualityReport] = None
        self.windows: List[TemporalWindow] = []
        self.state_history: List[NetworkState] = []
        
        # Primary Phase 2 Engine with Fallback
        self.world_model_engine = TemporalWorldModelEngine()
        self.lightweight_engine = LightweightForecastEngine()
        self.loaded = False

    def load_and_process_scenario(self, file_path: Optional[str] = None):
        if file_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            if self.scenario_id in ["tech-pirates-mvp-demo", "tech_pirates_mvp_demo"]:
                file_path = os.path.join(base_dir, "data", "demo", "tech_pirates_mvp_demo.csv")
            else:
                file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

        # 1. Ingestion
        records, raw_cols, invalid_rows = TelemetryIngestionService.load_from_csv(file_path)
        self.raw_records = records

        # 2. Validation
        self.quality_report = DataValidationService.validate_telemetry(records, raw_cols, invalid_rows)

        # 3. Temporal Windowing (10-second windows)
        self.windows = WindowingService.slice_into_windows(records, window_size_seconds=10.0)

        # 4. Network State Construction
        self.state_history = []
        prev_edges = None
        total_w = len(self.windows)

        for idx, win in enumerate(self.windows):
            t_label = f"T-{(total_w - 1 - idx)*10}s" if idx < total_w - 1 else "NOW"
            st, prev_edges = StateBuilderService.build_network_state(win, prev_edges, time_label=t_label)
            self.state_history.append(st)

        self.loaded = True

    def get_replay_state(self, tick_index: int = 0) -> Dict[str, Any]:
        if not self.loaded:
            self.load_and_process_scenario()

        if not self.state_history:
            return {"error": "No states built"}

        idx = max(0, min(tick_index, len(self.state_history) - 1))
        current_state = self.state_history[idx]
        history_slice = self.state_history[:idx + 1]  # Leakage protection: inputs <= t
        future_slice = self.state_history[idx + 1:]   # Ground truth future for evaluation

        forecast_res = self.world_model_engine.forecast(history_slice, future_state_history=future_slice)
        if getattr(forecast_res, "status", None) == "model_not_ready":
            forecast_res = self.lightweight_engine.forecast(history_slice, future_state_history=future_slice)

        return {
            "tickIndex": idx,
            "totalTicks": len(self.state_history),
            "current_state": current_state,
            "state_history": history_slice,
            "forecast": forecast_res,
            "quality_report": self.quality_report
        }

