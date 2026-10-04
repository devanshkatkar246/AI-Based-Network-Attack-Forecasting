from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from .schemas import TrajectoryStep, EvidenceSignal

class ForecastResult(BaseModel):
    status: str = "success"  # "success" or "model_not_ready"
    engine_id: str = "Phase 1 Lightweight Forecast Engine"
    current_behavior: Optional[str] = None
    predicted_behavior: Optional[str] = None
    predicted_technique: Optional[str] = None
    forecast_horizon_seconds: Optional[int] = None
    warning_lead_time_seconds: Optional[float] = None
    target_host: Optional[str] = None
    trajectory: List[TrajectoryStep] = Field(default_factory=list)
    evidence: List[EvidenceSignal] = Field(default_factory=list)
    uncertainty: Optional[Dict[str, Any]] = None

class ModelNotReadyResult(BaseModel):
    status: str = "model_not_ready"
    engine_id: str = "Phase 1 Lightweight Forecast Engine"
    message: str = "Insufficient historical window sequence to generate valid forecast."
    forecast_horizon_seconds: None = None
    warning_lead_time_seconds: None = None
    trajectory: List[TrajectoryStep] = Field(default_factory=list)
    evidence: List[EvidenceSignal] = Field(default_factory=list)
