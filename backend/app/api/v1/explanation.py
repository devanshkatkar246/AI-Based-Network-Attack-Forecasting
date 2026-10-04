from fastapi import APIRouter, Query
from .scenarios import get_or_create_orchestrator

router = APIRouter()

@router.get("/explanation")
def get_explanation(scenario_id: str = "enterprise-lateral-movement-01", tick: int = Query(0, ge=0)):
    orch = get_or_create_orchestrator(scenario_id)
    res = orch.get_replay_state(tick_index=tick)
    forecast_obj = res.get("forecast")
    return {
        "engine": "Phase 1 Supporting Evidence Generator",
        "evidence": forecast_obj.evidence if forecast_obj and hasattr(forecast_obj, "evidence") else []
    }
