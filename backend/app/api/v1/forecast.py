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
    canonical_state = orch.get_canonical_scenario_state(tick_index=tick)
    if "error" in canonical_state:
        raise HTTPException(status_code=404, detail=canonical_state["error"])

    cur_state = canonical_state.get("currentState")
    forecast_obj = canonical_state.get("forecast")
    trajectory = canonical_state.get("forecastTrajectory", [])
    warning_info = canonical_state.get("warning", {})
    evidence = canonical_state.get("evidence", [])

    # Format horizon predictions
    predictions = []
    for step in trajectory:
        if step.get("status") in ["PENDING", "FORECAST"] or step.get("semanticState") == "forecast":
            h_str = step.get("estimatedTime", "+10s")
            try:
                h_sec = int(h_str.replace("+", "").replace("s", ""))
            except Exception:
                h_sec = 10
            predictions.append({
                "horizon_seconds": h_sec,
                "behavior": step.get("stage", "Unknown"),
                "technique_id": step.get("techniqueId", "T1046"),
                "technique_name": step.get("techniqueName", "Network Attack Transition"),
                "score": step.get("confidence"),
                "probability": step.get("confidence")
            })

    return {
        "status": "ready",
        "scenario_id": scenario_id,
        "tick": tick,
        "timestamp": cur_state.get("timestamp") if cur_state else "00:00:00 UTC",
        "current_state": cur_state,
        "predictions": predictions,
        "trajectory": trajectory,
        "warning": warning_info,
        "evidence": evidence
    }

@router.get("/forecast/{scenario_id}")
def get_forecast_by_id(
    scenario_id: str,
    tick: int = Query(0, ge=0),
    horizon_windows: int = Query(3, ge=1)
):
    return get_scenario_forecast(scenario_id=scenario_id, tick=tick, horizon_windows=horizon_windows)

@router.get("/forecast")
def get_forecast_root(
    scenario_id: str = Query("enterprise-lateral-movement-01"),
    tick: int = Query(0, ge=0),
    horizon_windows: int = Query(3, ge=1)
):
    return get_scenario_forecast(scenario_id=scenario_id, tick=tick, horizon_windows=horizon_windows)

@router.post("/scenarios/{scenario_id}/forecast")
def post_scenario_forecast(
    scenario_id: str,
    req: ForecastRequest = Body(...)
):
    tick = req.tick or 0
    return get_scenario_forecast(scenario_id=scenario_id, tick=tick, horizon_windows=req.horizon_windows or 3)

@router.post("/forecast/run")
def legacy_run_forecast(scenario_id: str = "enterprise-lateral-movement-01", tick: int = Query(0, ge=0)):
    return get_scenario_forecast(scenario_id=scenario_id, tick=tick)
