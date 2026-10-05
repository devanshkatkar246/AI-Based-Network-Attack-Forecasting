from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional, Dict, Any
from pydantic import BaseModel
from .scenarios import get_or_create_orchestrator
from ...services.report_engine import ThreatReportEngine

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
    return ThreatReportEngine.generate_report_data(orch, tick_index=tick)

@router.post("/report")
def post_threat_report(
    req: ReportRequest = Body(...)
):
    scen_id = req.scenario_id or "enterprise-lateral-movement-01"
    tick = req.tick or 0
    orch = get_or_create_orchestrator(scen_id)
    return ThreatReportEngine.generate_report_data(orch, tick_index=tick)
