from fastapi.testclient import TestClient
import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app
from services import CSVProcessor, TemporalEngine, ForecastEngine, TopologyEngine, ReportEngine
from models.schemas import ScenarioState, NetworkState, WhatIfRequest

client = TestClient(app)

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "ok", "service": "the-forecaster-backend"}

def test_root_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_get_scenarios():
    response = client.get("/api/scenarios")
    assert response.status_code == 200
    scenarios = response.json()
    assert isinstance(scenarios, list)
    assert len(scenarios) >= 3
    ids = [s["id"] for s in scenarios]
    assert "enterprise-lateral-movement-01" in ids
    assert "tech-pirates-mvp-demo" in ids

def test_get_scenario_by_id():
    response = client.get("/api/scenarios/enterprise-lateral-movement-01")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "enterprise-lateral-movement-01"
    assert data["total_windows"] > 0

def test_canonical_forecast_endpoint():
    response = client.get("/api/forecast?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_id"] == "enterprise-lateral-movement-01"
    assert "current_state" in data
    assert "trajectory" in data
    assert "warning" in data
    assert "evidence" in data

def test_canonical_trajectory_endpoint():
    response = client.get("/api/trajectory?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_id"] == "enterprise-lateral-movement-01"
    assert isinstance(data["trajectory"], list)

def test_canonical_network_state_endpoint():
    response = client.get("/api/network-state?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert response.status_code == 200
    data = response.json()
    assert "traffic" in data
    assert "behavior" in data
    assert "topology" in data

def test_canonical_topology_endpoint():
    response = client.get("/api/topology?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data

def test_canonical_evidence_endpoint():
    response = client.get("/api/evidence?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert response.status_code == 200
    data = response.json()
    assert "evidence" in data
    assert "mitre_interpretation" in data

def test_canonical_what_if_endpoint():
    req = {
        "scenario_id": "enterprise-lateral-movement-01",
        "intervention": "isolate_host",
        "host": "10.0.2.45",
        "tick": 0
    }
    response = client.post("/api/what-if", json=req)
    assert response.status_code == 200
    data = response.json()
    assert "baselineTrajectory" in data
    assert "interventionTrajectory" in data
    assert "riskComparison" in data

def test_canonical_report_endpoints():
    get_res = client.get("/api/report?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert "executiveSummary" in get_data
    assert "mitreInterpretation" in get_data
    assert get_data["scenario"]["id"] == "enterprise-lateral-movement-01"

    post_res = client.post("/api/report", json={"scenario_id": "enterprise-lateral-movement-01", "tick": 0})
    assert post_res.status_code == 200
    post_data = post_res.json()
    assert post_data["scenario"]["id"] == "enterprise-lateral-movement-01"

def test_services_isolation():
    engine = ForecastEngine()
    assert engine is not None
    assert hasattr(engine, "forecast")
