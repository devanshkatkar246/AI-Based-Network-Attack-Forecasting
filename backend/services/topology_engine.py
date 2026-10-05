from typing import List, Set, Tuple, Optional

try:
    from models.schemas import FlowTelemetry, TopologyState
    from app.services.topology import TopologyService
except ImportError:
    from backend.models.schemas import FlowTelemetry, TopologyState
    from backend.app.services.topology import TopologyService

class TopologyEngine:
    """ Authoritative Topology & Attack Movement Graph Engine """

    @staticmethod
    def build_topology(
        records: List[FlowTelemetry],
        previous_edges: Optional[Set[Tuple[str, str]]] = None
    ) -> Tuple[TopologyState, Set[Tuple[str, str]], int]:
        return TopologyService.build_topology(records, previous_edges=previous_edges)
