from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from .scenarios import get_or_create_orchestrator

router = APIRouter()

@router.get("/trajectory")
def get_trajectory(
    scenario_id: str = Query("enterprise-lateral-movement-01"),
    tick: int = Query(0, ge=0)
):
    orch = get_or_create_orchestrator(scenario_id)
    canonical_state = orch.get_canonical_scenario_state(tick_index=tick)
    if "error" in canonical_state:
        raise HTTPException(status_code=404, detail=canonical_state["error"])
    
    return {
        "scenario_id": scenario_id,
        "tick": tick,
        "total_ticks": canonical_state.get("timeline", {}).get("totalTicks", 1),
        "trajectory": canonical_state.get("forecastTrajectory", [])
    }
