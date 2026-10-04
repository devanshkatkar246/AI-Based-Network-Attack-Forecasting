from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional, Dict, Any
from pydantic import BaseModel
from .scenarios import get_or_create_orchestrator

router = APIRouter()

class ForecastRequest(BaseModel):
    replay_timestamp: Optional[str] = None
    tick: Optional[int] = 0
    horizon_windows: Optional[int] = 3

@router.get("/scenarios/{scenario_id}/forecast")
def get_scenario_forecast(
    scenario_id: str,
    tick: int = Query(0, ge=0),
    horizon_windows: int = Query(3, ge=1)
):
    orch = get_or_create_orchestrator(scenario_id)
    res = orch.get_replay_state(tick_index=tick)
    cur_state = res.get("current_state")
    forecast_obj = res.get("forecast")

    if not forecast_obj or getattr(forecast_obj, "status", None) in ["model_not_ready", "insufficient_history"]:
        status_code = getattr(forecast_obj, "status", "model_not_ready") if forecast_obj else "model_not_ready"
        msg = getattr(forecast_obj, "message", "Model not ready or insufficient history.") if forecast_obj else "Model not ready."
        return {
            "status": status_code,
            "scenario_id": scenario_id,
            "tick": tick,
            "message": msg
        }

    # Extract clean prediction predictions list matching Section 13 contract
    predictions = []
    if hasattr(forecast_obj, "trajectory"):
        for step in forecast_obj.trajectory:
            if getattr(step, "status", None) == "PENDING" or getattr(step, "semanticState", None) == "forecast":
                h_str = getattr(step, "estimatedTime", "+10s")
                try:
                    h_sec = int(h_str.replace("+", "").replace("s", ""))
                except Exception:
                    h_sec = 10
                predictions.append({
                    "horizon_seconds": h_sec,
                    "behavior": getattr(step, "stage", "Unknown"),
                    "technique_id": getattr(step, "techniqueId", "T1000"),
                    "score": getattr(step, "confidence", 0.8),
                    "probability": getattr(step, "confidence", 0.8)
                })

    warning_info = {
        "available": forecast_obj.warning_lead_time_seconds is not None,
        "lead_time_seconds": forecast_obj.warning_lead_time_seconds
    } if hasattr(forecast_obj, "warning_lead_time_seconds") else {"available": False, "reason": "No lead time available"}

    return {
        "status": "ready",
        "scenario_id": scenario_id,
        "tick": tick,
        "timestamp": cur_state.timestamp if cur_state else "00:00:00 UTC",
        "current_state": cur_state,
        "predictions": predictions,
        "trajectory": forecast_obj.trajectory if hasattr(forecast_obj, "trajectory") else [],
        "warning": warning_info,
        "evidence": forecast_obj.evidence if hasattr(forecast_obj, "evidence") else []
    }

@router.post("/scenarios/{scenario_id}/forecast")
def post_scenario_forecast(
    scenario_id: str,
    req: ForecastRequest = Body(...)
):
    tick = req.tick or 0
    return get_scenario_forecast(scenario_id=scenario_id, tick=tick, horizon_windows=req.horizon_windows or 3)

@router.get("/forecast")
def legacy_get_forecast(scenario_id: str = "enterprise-lateral-movement-01", tick: int = Query(0, ge=0)):
    return get_scenario_forecast(scenario_id=scenario_id, tick=tick)

@router.post("/forecast/run")
def legacy_run_forecast(scenario_id: str = "enterprise-lateral-movement-01", tick: int = Query(0, ge=0)):
    return get_scenario_forecast(scenario_id=scenario_id, tick=tick)
