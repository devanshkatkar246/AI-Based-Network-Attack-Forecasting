from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from .scenarios import get_or_create_orchestrator

router = APIRouter()

@router.get("/evidence")
def get_evidence(
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
        "evidence": canonical_state.get("evidence", []),
        "mitre_interpretation": canonical_state.get("mitreInterpretation", [])
    }

@router.get("/scenarios/{scenario_id}/evidence")
def get_scenario_evidence(
    scenario_id: str,
    tick: int = Query(0, ge=0)
):
    return get_evidence(scenario_id=scenario_id, tick=tick)

@router.get("/mitre")
def get_mitre_root(
    scenario_id: str = Query("enterprise-lateral-movement-01"),
    tick: int = Query(0, ge=0)
):
    orch = get_or_create_orchestrator(scenario_id)
    canonical_state = orch.get_canonical_scenario_state(tick_index=tick)
    if "error" in canonical_state:
        raise HTTPException(status_code=404, detail=canonical_state["error"])
    return canonical_state.get("mitreInterpretation", [])

@router.get("/scenarios/{scenario_id}/mitre")
def get_scenario_mitre(
    scenario_id: str,
    tick: int = Query(0, ge=0)
):
    return get_mitre_root(scenario_id=scenario_id, tick=tick)
