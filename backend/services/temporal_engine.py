from typing import List, Tuple, Optional, Set

try:
    from models.schemas import FlowTelemetry, NetworkState
    from app.services.windowing import WindowingService, TemporalWindow
    from app.services.state_builder import StateBuilderService
except ImportError:
    from backend.models.schemas import FlowTelemetry, NetworkState
    from backend.app.services.windowing import WindowingService, TemporalWindow
    from backend.app.services.state_builder import StateBuilderService

class TemporalEngine:
    """ Authoritative Temporal Windowing & Network State Building Engine """

    @staticmethod
    def slice_windows(records: List[FlowTelemetry], window_size_seconds: float = 10.0) -> List[TemporalWindow]:
        return WindowingService.slice_into_windows(records, window_size_seconds=window_size_seconds)

    @staticmethod
    def build_states(windows: List[TemporalWindow]) -> List[NetworkState]:
        states: List[NetworkState] = []
        prev_edges: Optional[Set[Tuple[str, str]]] = None
        total_w = len(windows)
        for idx, win in enumerate(windows):
            t_label = f"T-{(total_w - 1 - idx)*10}s" if idx < total_w - 1 else "NOW"
            st, prev_edges = StateBuilderService.build_network_state(win, prev_edges, time_label=t_label)
            states.append(st)
        return states
