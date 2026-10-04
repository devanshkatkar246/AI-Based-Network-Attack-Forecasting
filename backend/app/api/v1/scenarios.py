import os
import time
import shutil
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import Dict, Any, List, Optional
from ...pipeline.orchestrator import PipelineOrchestrator
from ...services.ingestion import TelemetryIngestionService

router = APIRouter()
orchestrator_store: Dict[str, PipelineOrchestrator] = {}
uploaded_scenarios_meta: List[Dict[str, Any]] = []

def get_or_create_orchestrator(scenario_id: str) -> PipelineOrchestrator:
    if scenario_id not in orchestrator_store:
        orch = PipelineOrchestrator(scenario_id=scenario_id)
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        if scenario_id in ["tech-pirates-mvp-demo", "tech_pirates_mvp_demo"]:
            csv_path = os.path.join(base_dir, "data", "demo", "tech_pirates_mvp_demo.csv")
            orch.load_and_process_scenario(file_path=csv_path)
        else:
            orch.load_and_process_scenario()
        orchestrator_store[scenario_id] = orch
    return orchestrator_store[scenario_id]

@router.get("/scenarios")
def list_scenarios():
    default_scenarios = [
        {
            "id": "enterprise-lateral-movement-01",
            "name": "Enterprise Lateral Movement Demo",
            "source_dataset": "enterprise_lateral_movement_01.csv",
            "description": "Multi-stage SMB lateral movement from workstation to internal domain controller.",
            "status": "available",
            "category": "READY DEMO"
        },
        {
            "id": "tech-pirates-mvp-demo",
            "name": "TECH πRATES Integration Demo",
            "source_dataset": "tech_pirates_mvp_demo.csv",
            "description": "Multi-window temporal attack telemetry dataset for end-to-end forecasting validation.",
            "status": "available",
            "category": "READY DEMO"
        },
        {
            "id": "cloud-exfiltration-02",
            "name": "Cloud Exfiltration Burst Demo",
            "source_dataset": "cloud_exfiltration_02.csv",
            "description": "STS token credential reuse & high-volume S3 bucket exfiltration.",
            "status": "demo_only",
            "category": "READY DEMO"
        }
    ]
    return default_scenarios + uploaded_scenarios_meta


@router.get("/scenarios/{scenario_id}")
def get_scenario_details(scenario_id: str):
    orch = get_or_create_orchestrator(scenario_id)
    return {
        "id": scenario_id,
        "total_records": len(orch.raw_records),
        "total_windows": len(orch.windows),
        "quality_report": orch.quality_report
    }

@router.post("/scenarios/upload")
async def upload_scenario_csv(
    file: UploadFile = File(...),
    scenario_name: Optional[str] = Form(None)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV network flow telemetry files are supported.")

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    raw_dir = os.path.join(base_dir, "data", "raw")
    os.makedirs(raw_dir, exist_ok=True)

    timestamp_str = int(time.time())
    safe_filename = f"upload_{timestamp_str}_{file.filename}"
    file_path = os.path.join(raw_dir, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Ingest and validate CSV content
    records, raw_cols, invalid_rows = TelemetryIngestionService.load_from_csv(file_path)
    if len(records) == 0:
        os.remove(file_path)
        raise HTTPException(
            status_code=422,
            detail="CSV validation failed: Unable to parse valid network telemetry rows. Ensure timestamp, src_ip, and dst_ip columns exist."
        )

    scenario_id = f"uploaded-{timestamp_str}"
    name_clean = scenario_name.strip() if scenario_name and scenario_name.strip() else file.filename.replace(".csv", "").replace("_", " ").capitalize()

    orch = PipelineOrchestrator(scenario_id=scenario_id)
    orch.load_and_process_scenario(file_path=file_path)
    orchestrator_store[scenario_id] = orch

    meta_entry = {
        "id": scenario_id,
        "name": f"{name_clean} (Uploaded)",
        "source_dataset": safe_filename,
        "description": f"Uploaded telemetry CSV ({len(records)} flow records, {len(orch.windows)} temporal windows).",
        "status": "ready",
        "category": "USER UPLOADED",
        "quality_report": orch.quality_report
    }
    uploaded_scenarios_meta.append(meta_entry)

    q_rep = orch.quality_report.model_dump() if hasattr(orch.quality_report, "model_dump") else (orch.quality_report if isinstance(orch.quality_report, dict) else dict(orch.quality_report or {}))

    return {
        "success": True,
        "status": "validated",
        "scenario_id": scenario_id,
        "scenario_name": name_clean,
        "filename": file.filename,
        "rows": len(records),
        "columns": raw_cols,
        "time_range": {
            "start": q_rep.get("time_start"),
            "end": q_rep.get("time_end")
        },
        "window_count": len(orch.windows),
        "quality_report": q_rep
    }

@router.post("/scenarios/{scenario_id}/load")
def load_scenario(scenario_id: str):
    orch = get_or_create_orchestrator(scenario_id)
    return {
        "status": "loaded",
        "scenario_id": scenario_id,
        "window_count": len(orch.windows),
        "quality_report": orch.quality_report
    }

@router.get("/scenarios/{scenario_id}/replay")
def scenario_replay(scenario_id: str, tick: int = Query(0, ge=0)):
    orch = get_or_create_orchestrator(scenario_id)
    res = orch.get_replay_state(tick_index=tick)
    return res
