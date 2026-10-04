from typing import List, Optional, Set, Tuple
from ..models.schemas import FlowTelemetry, NetworkState, TrafficFeatures, BehavioralFeatures, TopologyState
from .windowing import TemporalWindow
from .topology import TopologyService

class StateBuilderService:
    @staticmethod
    def build_network_state(
        window: TemporalWindow,
        previous_edges: Optional[Set[Tuple[str, str]]] = None,
        time_label: str = "T-0s"
    ) -> Tuple[NetworkState, Set[Tuple[str, str]]]:
        records = window.records
        total_bytes = sum(r.bytes for r in records)
        total_packets = sum(r.packets for r in records)
        active_flows = len(records)
        
        # Traffic Mbps calculation
        duration_sec = max(1.0, (window.end_time - window.start_time).total_seconds())
        traffic_mbps = round((total_bytes * 8) / (duration_sec * 1_000_000), 2)

        traffic = TrafficFeatures(
            total_bytes=total_bytes,
            total_packets=total_packets,
            active_flows=active_flows,
            traffic_mbps=traffic_mbps
        )

        # Behavioral metrics
        sources = set(r.src_ip for r in records)
        destinations = set(r.dst_ip for r in records)
        dest_ports = set(r.dst_port for r in records if r.dst_port is not None)
        
        # Protocol distribution
        protocol_counts = {}
        syn_count = 0
        east_west_bytes = 0

        for r in records:
            protocol_counts[r.protocol] = protocol_counts.get(r.protocol, 0) + 1
            if r.tcp_flags and "SYN" in r.tcp_flags.upper():
                syn_count += 1
            
            # East-West heuristic: both IPs internal (e.g. 10.x.x.x)
            if r.src_ip.startswith("10.") and r.dst_ip.startswith("10."):
                east_west_bytes += r.bytes

        syn_rate = round(syn_count / duration_sec, 2)
        avg_dur = round(sum(r.duration for r in records) / active_flows, 3) if active_flows > 0 else 0.0

        behavior = BehavioralFeatures(
            destination_diversity=len(destinations),
            source_diversity=len(sources),
            tcp_syn_rate=syn_rate,
            dst_port_count=len(dest_ports),
            protocol_distribution=protocol_counts,
            east_west_traffic_bytes=east_west_bytes,
            avg_flow_duration=avg_dur
        )

        # Topology
        topology_state, current_edges, new_edges_cnt = TopologyService.build_topology(records, previous_edges)

        # Phase estimation based on behavioral features
        phase = "BASELINE"
        if len(destinations) >= 5 or syn_rate >= 2.0:
            phase = "RECONNAISSANCE"
        elif 389 in dest_ports or 88 in dest_ports:
            phase = "DISCOVERY"
        elif 445 in dest_ports and east_west_bytes > 20000:
            phase = "LATERAL_MOVEMENT"
        elif any(r.dst_ip.startswith("198.51") or r.dst_ip.startswith("203.0") for r in records):
            phase = "EXFILTRATION"

        timestamp_str = window.start_time.strftime("%H:%M:%S UTC")

        state = NetworkState(
            window_id=window.window_id,
            time_label=time_label,
            timestamp=timestamp_str,
            traffic=traffic,
            behavior=behavior,
            topology=topology_state,
            new_edges_count=new_edges_cnt,
            phase=phase,
            active_hosts=len(sources.union(destinations))
        )

        return state, current_edges
