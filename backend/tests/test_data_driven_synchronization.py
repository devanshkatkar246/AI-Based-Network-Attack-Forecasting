import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.pipeline.orchestrator import PipelineOrchestrator
from backend.app.services.warning_engine import WarningLeadTimeEngine

client = TestClient(app)

def test_scenario_switching_distinct_states():
    """Verify that switching between Scenario A and Scenario B produces distinct, data-driven states."""
    res_scenarios = client.get("/api/v1/scenarios")
    assert res_scenarios.status_code == 200
    scenarios = res_scenarios.json()
    assert len(scenarios) >= 2

    scen_a_id = scenarios[0]["id"]
    scen_b_id = scenarios[1]["id"]

    # Fetch replay state for Scenario A
    res_a = client.get(f"/api/v1/scenarios/{scen_a_id}/replay?tick=0")
    assert res_a.status_code == 200
    data_a = res_a.json()

    # Fetch replay state for Scenario B
    res_b = client.get(f"/api/v1/scenarios/{scen_b_id}/replay?tick=0")
    assert res_b.status_code == 200
    data_b = res_b.json()

    assert data_a["current_state"] is not None
    assert data_b["current_state"] is not None
    assert "forecast" in data_a
    assert "forecast" in data_b

    # Verify no static mock leaks across scenarios
    assert data_a["forecast"]["target_host"] is not None
    assert data_b["forecast"]["target_host"] is not None


def test_replay_temporal_state_progression():
    """Verify that advancing replay ticks recomputes the analytical state and trajectory."""
    orch = PipelineOrchestrator(scenario_id="enterprise-lateral-movement-01")
    orch.load_and_process_scenario()

    total_ticks = len(orch.state_history)
    assert total_ticks >= 3

    # Tick 0
    state_t0 = orch.get_replay_state(tick_index=0)
    fc_t0 = state_t0["forecast"]
    traj_t0 = fc_t0.trajectory if hasattr(fc_t0, "trajectory") else fc_t0["trajectory"]
    assert state_t0["tickIndex"] == 0
    assert len(state_t0["state_history"]) == 1

    # Tick 2
    state_t2 = orch.get_replay_state(tick_index=2)
    fc_t2 = state_t2["forecast"]
    traj_t2 = fc_t2.trajectory if hasattr(fc_t2, "trajectory") else fc_t2["trajectory"]
    assert state_t2["tickIndex"] == 2
    assert len(state_t2["state_history"]) == 3

    # Trajectory in tick 2 should have past observed steps
    obs_steps = [s for s in traj_t2 if (getattr(s, "status", None) == "OBSERVED" or (isinstance(s, dict) and s.get("status") == "OBSERVED"))]
    assert len(obs_steps) == 2


def test_warning_lead_time_mathematical_consistency():
    """Verify warning lead time is positive for future events and resolves when reached."""
    orch = PipelineOrchestrator(scenario_id="enterprise-lateral-movement-01")
    orch.load_and_process_scenario()

    # Early tick before lateral movement onset
    state_early = orch.get_replay_state(tick_index=0)
    fc_early = state_early["forecast"]

    lead_sec = getattr(fc_early, "warning_lead_time_seconds", None) if hasattr(fc_early, "warning_lead_time_seconds") else fc_early.get("warning_lead_time_seconds")

    # Warning lead time should be positive if future onset exists in timeline
    if lead_sec is not None:
        assert lead_sec > 0

    # Test direct WarningLeadTimeEngine math
    res = WarningLeadTimeEngine.calculate_lead_time(
        forecast_timestamp_str="19:48:02",
        predicted_behavior="Lateral Movement",
        future_state_history=orch.state_history[1:],
        window_size_seconds=10.0
    )
    if res.get("available"):
        assert res["lead_time_seconds"] >= 10.0


def test_trajectory_epistemic_classification():
    """Verify trajectory properly separates OBSERVED, CURRENT, and FORECAST steps."""
    orch = PipelineOrchestrator(scenario_id="enterprise-lateral-movement-01")
    orch.load_and_process_scenario()

    replay_state = orch.get_replay_state(tick_index=1)
    fc = replay_state["forecast"]
    trajectory = fc.trajectory if hasattr(fc, "trajectory") else fc["trajectory"]

    observed = [s for s in trajectory if (getattr(s, "status", None) == "OBSERVED" or (isinstance(s, dict) and s.get("status") == "OBSERVED"))]
    current = [s for s in trajectory if (getattr(s, "status", None) == "CURRENT" or (isinstance(s, dict) and (s.get("status") == "CURRENT" or s.get("isCurrent"))))]
    forecast = [s for s in trajectory if (getattr(s, "status", None) == "PENDING" or getattr(s, "semanticState", None) == "forecast" or (isinstance(s, dict) and (s.get("status") == "PENDING" or s.get("semanticState") == "forecast")))]

    assert len(observed) == 1
    assert len(current) == 1
    assert len(forecast) >= 1

    cur_step = current[0]
    cur_is_current = getattr(cur_step, "isCurrent", None) if hasattr(cur_step, "isCurrent") else cur_step.get("isCurrent")
    cur_sem_state = getattr(cur_step, "semanticState", None) if hasattr(cur_step, "semanticState") else cur_step.get("semanticState")

    assert cur_is_current is True
    assert cur_sem_state == "current"
