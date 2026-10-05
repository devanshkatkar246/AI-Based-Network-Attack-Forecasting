import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["service"] == "the-forecaster-backend"

def test_scenarios_and_canonical_state():
    res = client.get("/api/scenarios")
    assert res.status_code == 200
    scenarios = res.json()
    assert len(scenarios) > 0
    scen_id = scenarios[0]["id"]

    # Details
    res_det = client.get(f"/api/scenarios/{scen_id}")
    assert res_det.status_code == 200

    # Replay
    res_rep = client.get(f"/api/scenarios/{scen_id}/replay?tick=0")
    assert res_rep.status_code == 200
    rep_data = res_rep.json()
    assert "current_state" in rep_data
    assert "forecast" in rep_data

def test_forecast_endpoints():
    res = client.get("/api/forecast?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ready"
    assert "trajectory" in data
    assert "warning" in data
    assert "evidence" in data

    # Test path-based forecast
    res_path = client.get("/api/forecast/enterprise-lateral-movement-01?tick=1")
    assert res_path.status_code == 200

def test_network_state_endpoint():
    res = client.get("/api/network-state?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert res.status_code == 200
    data = res.json()
    assert "traffic" in data
    assert "behavior" in data

def test_trajectory_endpoint():
    res = client.get("/api/trajectory?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert res.status_code == 200
    data = res.json()
    assert "trajectory" in data
    assert len(data["trajectory"]) > 0

def test_topology_endpoint():
    res = client.get("/api/topology?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert res.status_code == 200
    data = res.json()
    assert "nodes" in data
    assert "edges" in data

def test_evidence_endpoint():
    res = client.get("/api/evidence?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert res.status_code == 200
    data = res.json()
    assert "evidence" in data

def test_what_if_endpoint():
    payload = {
        "scenario_id": "enterprise-lateral-movement-01",
        "intervention": "isolate_host",
        "host": "10.0.2.45",
        "tick": 0
    }
    res = client.post("/api/what-if", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "baselineTrajectory" in data
    assert "interventionTrajectory" in data
    assert "riskComparison" in data

def test_report_endpoint():
    res = client.get("/api/report?scenario_id=enterprise-lateral-movement-01&tick=0")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "executiveSummary" in data
    assert "trajectory" in data
    assert "warning" in data
    assert "topology" in data
    assert "evidence" in data
