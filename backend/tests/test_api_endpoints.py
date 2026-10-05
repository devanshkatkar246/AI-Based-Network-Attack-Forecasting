import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "healthy"]
    assert "the-forecaster" in data["service"].lower() or "phase 1" in data["service"].lower()

def test_scenarios_endpoints():
    res = client.get("/api/v1/scenarios")
    assert res.status_code == 200
    scenarios = res.json()
    assert len(scenarios) > 0

    scen_id = scenarios[0]["id"]
    res_load = client.post(f"/api/v1/scenarios/{scen_id}/load")
    assert res_load.status_code == 200

    res_replay = client.get(f"/api/v1/scenarios/{scen_id}/replay?tick=0")
    assert res_replay.status_code == 200

def test_network_endpoints():
    res_state = client.get("/api/v1/network/state")
    assert res_state.status_code == 200

    res_topo = client.get("/api/v1/network/topology")
    assert res_topo.status_code == 200

def test_forecast_endpoints():
    res_fc = client.get("/api/v1/forecast")
    assert res_fc.status_code == 200
    assert res_fc.json()["status"] in ["ready", "success"]

def test_what_if_endpoint():
    payload = {
        "scenario_id": "enterprise-lateral-movement-01",
        "intervention": "isolate_host",
        "host": "10.0.2.45"
    }
    res = client.post("/api/v1/what-if", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["interventionTrajectory"]) > 0
    assert "model projection" in data["simulatedDivergenceNotice"].lower()
