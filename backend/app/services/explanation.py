from typing import List
from ..models.schemas import NetworkState, EvidenceSignal

class EvidenceService:
    @staticmethod
    def generate_evidence(history: List[NetworkState]) -> List[EvidenceSignal]:
        evidence_list: List[EvidenceSignal] = []

        if not history:
            return evidence_list

        current_state = history[-1]
        prev_state = history[-2] if len(history) > 1 else None
        prev2_state = history[-3] if len(history) > 2 else None

        # 1. NETWORK SIGNALS
        if current_state.behavior.destination_diversity >= 3:
            evidence_list.append(EvidenceSignal(
                id=f"ev-net-div-{current_state.window_id}",
                time=current_state.timestamp,
                type="NETWORK SIGNALS",
                source="Traffic Feature Extractor",
                indicator=f"Destination diversity elevated ({current_state.behavior.destination_diversity} distinct target hosts)",
                severity="MEDIUM" if current_state.behavior.destination_diversity < 5 else "HIGH",
                mitreId="T1046"
            ))

        if current_state.behavior.tcp_syn_rate >= 1.5:
            evidence_list.append(EvidenceSignal(
                id=f"ev-net-syn-{current_state.window_id}",
                time=current_state.timestamp,
                type="NETWORK SIGNALS",
                source="Flow Flag Inspector",
                indicator=f"TCP SYN sweep rate elevated ({current_state.behavior.tcp_syn_rate} SYN pkts/sec)",
                severity="HIGH",
                mitreId="T1046"
            ))

        if current_state.behavior.east_west_traffic_bytes > 10000:
            evidence_list.append(EvidenceSignal(
                id=f"ev-net-ew-{current_state.window_id}",
                time=current_state.timestamp,
                type="NETWORK SIGNALS",
                source="Subnet Traffic Monitor",
                indicator=f"East-West internal flow volume elevated ({round(current_state.behavior.east_west_traffic_bytes/1024, 1)} KB)",
                severity="HIGH",
                mitreId="T1021.002"
            ))

        # 2. TEMPORAL SIGNALS (State deltas over time)
        if prev_state:
            flow_delta = current_state.traffic.active_flows - prev_state.traffic.active_flows
            byte_delta = current_state.traffic.total_bytes - prev_state.traffic.total_bytes
            
            if flow_delta > 0:
                evidence_list.append(EvidenceSignal(
                    id=f"ev-temp-flow-{current_state.window_id}",
                    time=current_state.timestamp,
                    type="TEMPORAL SIGNALS",
                    source="Temporal State Analyzer",
                    indicator=f"Inter-window flow burst (+{flow_delta} active flows since previous state window)",
                    severity="MEDIUM",
                    mitreId="T1087.002"
                ))

            if prev2_state:
                p_phase = prev2_state.phase
                c_phase = current_state.phase
                if p_phase != c_phase and c_phase != "BASELINE":
                    evidence_list.append(EvidenceSignal(
                        id=f"ev-temp-phase-{current_state.window_id}",
                        time=current_state.timestamp,
                        type="TEMPORAL SIGNALS",
                        source="Temporal Transition Engine",
                        indicator=f"Temporal state progression detected ({p_phase.replace('_', ' ')} ➔ {c_phase.replace('_', ' ')})",
                        severity="HIGH",
                        mitreId="T1021.002"
                    ))

        # 3. TOPOLOGY SIGNALS
        if current_state.new_edges_count > 0:
            evidence_list.append(EvidenceSignal(
                id=f"ev-top-edge-{current_state.window_id}",
                time=current_state.timestamp,
                type="TOPOLOGY SIGNALS",
                source="Graph Topology Engine",
                indicator=f"Observed {current_state.new_edges_count} new host communication edge(s) in current graph state",
                severity="HIGH",
                mitreId="T1021.002"
            ))

        return evidence_list
