from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional, Dict, Any
from pydantic import BaseModel

try:
    from routers.scenarios import get_or_create_orchestrator
    from services.report_engine import ReportEngine
except ImportError:
    from backend.routers.scenarios import get_or_create_orchestrator
    from backend.services.report_engine import ReportEngine

router = APIRouter()

class ReportRequest(BaseModel):
    scenario_id: Optional[str] = "enterprise-lateral-movement-01"
    tick: Optional[int] = 0

@router.get("/report")
def get_threat_report(
    scenario_id: str = Query("enterprise-lateral-movement-01"),
    tick: int = Query(0, ge=0)
):
    orch = get_or_create_orchestrator(scenario_id)
    return ReportEngine.generate_report_data(orch, tick_index=tick)

@router.post("/report")
def post_threat_report(
    req: ReportRequest = Body(...)
):
    scen_id = req.scenario_id or "enterprise-lateral-movement-01"
    tick = req.tick or 0
    orch = get_or_create_orchestrator(scen_id)
    return ReportEngine.generate_report_data(orch, tick_index=tick)

@router.get("/scenarios/{scenario_id}/report")
def get_scenario_report(
    scenario_id: str,
    tick: int = Query(0, ge=0)
):
    return get_threat_report(scenario_id=scenario_id, tick=tick)

@router.post("/report/export")
def export_threat_report(
    req: ReportRequest = Body(...)
):
    scen_id = req.scenario_id or "enterprise-lateral-movement-01"
    tick = req.tick or 0
    orch = get_or_create_orchestrator(scen_id)
    report_data = ReportEngine.generate_report_data(orch, tick_index=tick)
    return {
        "status": "ready",
        "format": "json",
        "export_timestamp": report_data.get("generated_at"),
        "report": report_data
    }
