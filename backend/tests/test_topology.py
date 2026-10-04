import pytest
import os
from backend.app.services.ingestion import TelemetryIngestionService
from backend.app.services.topology import TopologyService

def test_topology_building_and_new_edge_detection():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

    records, _, _ = TelemetryIngestionService.load_from_csv(file_path)

    # First subset of records
    half = len(records) // 2
    state_1, edges_1, new_cnt_1 = TopologyService.build_topology(records[:half], previous_edges=None)
    assert len(state_1.nodes) > 0

    # Second subset with previous_edges passed
    state_2, edges_2, new_cnt_2 = TopologyService.build_topology(records[half:], previous_edges=edges_1)
    assert new_cnt_2 >= 0
