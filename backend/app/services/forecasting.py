from abc import ABC, abstractmethod
from typing import List, Optional, Union, Dict, Any
from datetime import datetime
from ..models.schemas import NetworkState
from ..models.forecast_result import ForecastResult, ModelNotReadyResult

class ForecastEngine(ABC):
    """
    Abstract Base Class for Network Attack Forecasting Engines.
    Forecast engine contract taking historical network states S(t-L+1) ... S(t)
    and returning multi-step trajectory, warning information, and evidence signals.
    """
    @abstractmethod
    def forecast(
        self,
        state_history: List[NetworkState],
        ground_truth_onset: Optional[datetime] = None,
        future_state_history: Optional[List[NetworkState]] = None
    ) -> Union[ForecastResult, ModelNotReadyResult]:
        pass

class LightweightForecastEngine(ForecastEngine):
    """
    MVP Baseline Forecaster alias.
    Operates on empirical state history and temporal feature deltas.
    Does NOT fabricate static mock strings or false neural confidence scores.
    """
    def __init__(self, window_size_seconds: float = 10.0):
        from .mvp_baseline_forecaster import MVPBaselineForecaster
        self.baseline_engine = MVPBaselineForecaster(window_size_seconds=window_size_seconds)

    def forecast(
        self,
        state_history: List[NetworkState],
        ground_truth_onset: Optional[datetime] = None,
        future_state_history: Optional[List[NetworkState]] = None
    ) -> Union[ForecastResult, ModelNotReadyResult]:
        return self.baseline_engine.forecast(
            state_history=state_history,
            ground_truth_onset=ground_truth_onset,
            future_state_history=future_state_history
        )

