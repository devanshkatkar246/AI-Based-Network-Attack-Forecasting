from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from .scenarios import get_or_create_orchestrator

router = APIRouter()

@router.get("/scenarios/{scenario_id}/timeline")
def get_scenario_timeline(scenario_id: str):
    orch = get_or_create_orchestrator(scenario_id)
    if not orch.state_history:
        raise HTTPException(status_code=404, detail="No timeline states found for scenario.")
    
    start_ts = orch.state_history[0].timestamp
    end_ts = orch.state_history[-1].timestamp
    timestamps = [st.timestamp for st in orch.state_history]
    
    return {
        "scenario_id": scenario_id,
        "start_timestamp": start_ts,
        "end_timestamp": end_ts,
        "window_size_seconds": 10.0,
        "window_count": len(orch.state_history),
        "timestamps": timestamps
    }

@router.get("/scenarios/{scenario_id}/network-state")
def get_scenario_network_state(scenario_id: str, tick: int = Query(0, ge=0)):
    orch = get_or_create_orchestrator(scenario_id)
    res = orch.get_replay_state(tick_index=tick)
    return res.get("current_state")

@router.get("/scenarios/{scenario_id}/topology")
def get_scenario_topology(scenario_id: str, tick: int = Query(0, ge=0)):
    orch = get_or_create_orchestrator(scenario_id)
    res = orch.get_replay_state(tick_index=tick)
    cur_state = res.get("current_state")
    if not cur_state or not cur_state.topology:
        return {"nodes": [], "edges": [], "new_edges_count": 0, "timestamp": "00:00:00 UTC"}
    
    return {
        "nodes": cur_state.topology.nodes,
        "edges": cur_state.topology.edges,
        "new_edges_count": cur_state.new_edges_count,
        "timestamp": cur_state.timestamp
    }

# Legacy routes
@router.get("/network/state")
def legacy_get_network_state(scenario_id: str = "enterprise-lateral-movement-01", tick: int = Query(0, ge=0)):
    return get_scenario_network_state(scenario_id=scenario_id, tick=tick)

@router.get("/network/history")
def legacy_get_network_history(scenario_id: str = "enterprise-lateral-movement-01", tick: int = Query(0, ge=0)):
    orch = get_or_create_orchestrator(scenario_id)
    res = orch.get_replay_state(tick_index=tick)
    return res.get("state_history", [])

@router.get("/network/topology")
def legacy_get_network_topology(scenario_id: str = "enterprise-lateral-movement-01", tick: int = Query(0, ge=0)):
    return get_scenario_topology(scenario_id=scenario_id, tick=tick)
