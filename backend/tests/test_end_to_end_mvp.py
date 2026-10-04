import pytest
import os
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.pipeline.orchestrator import PipelineOrchestrator
from backend.app.services.behavior_taxonomy import BehaviorTaxonomyService, BehaviorTaxonomy
from backend.app.services.mvp_baseline_forecaster import MVPBaselineForecaster
from backend.app.services.warning_engine import WarningLeadTimeEngine
from backend.app.services.dataset_builder import SequenceDatasetBuilder

client = TestClient(app)

def test_behavior_taxonomy():
    assert BehaviorTaxonomyService.normalize_behavior("PortScan") == BehaviorTaxonomy.RECONNAISSANCE
    assert BehaviorTaxonomyService.normalize_behavior("Domain Account Discovery") == BehaviorTaxonomy.DISCOVERY
    assert BehaviorTaxonomyService.normalize_behavior("LSASS Memory Dump") == BehaviorTaxonomy.CREDENTIAL_ACCESS
    assert BehaviorTaxonomyService.normalize_behavior("SMB / PsExec Execution") == BehaviorTaxonomy.LATERAL_MOVEMENT
    assert BehaviorTaxonomyService.normalize_behavior("Encrypted Web Protocol") == BehaviorTaxonomy.COMMAND_AND_CONTROL
    assert BehaviorTaxonomyService.normalize_behavior("RandomUnknownLabelXYZ") == BehaviorTaxonomy.UNKNOWN

def test_mvp_baseline_forecaster():
    orch = PipelineOrchestrator("tech-pirates-mvp-demo")
    orch.load_and_process_scenario()
    
    assert len(orch.state_history) > 0
    forecaster = MVPBaselineForecaster(window_size_seconds=10.0)
    
    # Test insufficient history
    res_empty = forecaster.forecast([])
    assert res_empty.status == "insufficient_history"
    
    # Test real forecast on history slice
    hist_slice = orch.state_history[:2]
    fut_slice = orch.state_history[2:]
    res = forecaster.forecast(hist_slice, future_state_history=fut_slice)
    
    assert res.status == "success"
    assert res.engine_id == "MVP Baseline Forecaster"
    assert len(res.trajectory) > 0
    assert len(res.evidence) > 0
    assert res.target_host != ""

def test_warning_lead_time_engine():
    orch = PipelineOrchestrator("tech-pirates-mvp-demo")
    orch.load_and_process_scenario()
    
    # Valid early warning test
    forecast_ts = orch.state_history[0].timestamp
    predicted_behavior = "LATERAL_MOVEMENT"
    fut_states = orch.state_history[1:]
    
    warning_res = WarningLeadTimeEngine.calculate_lead_time(
        forecast_timestamp_str=forecast_ts,
        predicted_behavior=predicted_behavior,
        future_state_history=fut_states,
        window_size_seconds=10.0
    )
    
    assert "available" in warning_res
    if warning_res["available"]:
        assert warning_res["lead_time_seconds"] > 0
    else:
        assert "reason" in warning_res

def test_zero_leakage_protection():
    orch = PipelineOrchestrator("tech-pirates-mvp-demo")
    orch.load_and_process_scenario()
    
    builder = SequenceDatasetBuilder(context_length=3, forecast_horizon=2)
    audit_res = builder.verify_zero_leakage(orch.state_history)
    assert audit_res["passed"] is True
    assert audit_res["leakage_violations"] == 0

def test_scenarios_forecast_api_contract():
    res = client.get("/api/v1/scenarios/tech-pirates-mvp-demo/forecast?tick=1")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["ready", "model_not_ready", "insufficient_history"]
    if data["status"] == "ready":
        assert "current_state" in data
        assert "predictions" in data
        assert "trajectory" in data
        assert "warning" in data
        assert "evidence" in data

def test_scenarios_timeline_and_topology_api():
    t_res = client.get("/api/v1/scenarios/tech-pirates-mvp-demo/timeline")
    assert t_res.status_code == 200
    t_data = t_res.json()
    assert "start_timestamp" in t_data
    assert "window_count" in t_data
    assert t_data["window_count"] > 0

    top_res = client.get("/api/v1/scenarios/tech-pirates-mvp-demo/topology?tick=0")
    assert top_res.status_code == 200
    top_data = top_res.json()
    assert "nodes" in top_data
    assert "edges" in top_data

def test_post_forecast_api():
    payload = {"replay_timestamp": "12:00:00 UTC", "tick": 1, "horizon_windows": 3}
    res = client.post("/api/v1/scenarios/tech-pirates-mvp-demo/forecast", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
