from typing import List, Optional, Union

try:
    from models.schemas import NetworkState
    from app.models.forecast_result import ForecastResult, ModelNotReadyResult
    from app.services.forecasting import LightweightForecastEngine
    from app.services.world_model_engine import TemporalWorldModelEngine
    from app.services.warning_engine import WarningLeadTimeEngine
except ImportError:
    from backend.models.schemas import NetworkState
    from backend.app.models.forecast_result import ForecastResult, ModelNotReadyResult
    from backend.app.services.forecasting import LightweightForecastEngine
    from backend.app.services.world_model_engine import TemporalWorldModelEngine
    from backend.app.services.warning_engine import WarningLeadTimeEngine

class ForecastEngine:
    """ Authoritative Isolated Attack Forecasting & Warning Lead Time Engine """

    def __init__(self):
        self.world_model_engine = TemporalWorldModelEngine()
        self.lightweight_engine = LightweightForecastEngine()
        self.warning_engine = WarningLeadTimeEngine()

    def forecast(
        self,
        history_slice: List[NetworkState],
        future_slice: Optional[List[NetworkState]] = None
    ) -> Union[ForecastResult, ModelNotReadyResult]:
        res = self.world_model_engine.forecast(history_slice, future_state_history=future_slice)
        if getattr(res, "status", None) == "model_not_ready":
            res = self.lightweight_engine.forecast(history_slice, future_state_history=future_slice)
        return res
