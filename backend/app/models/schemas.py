from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class FlowTelemetry(BaseModel):
    timestamp: datetime
    src_ip: str
    dst_ip: str
    src_port: Optional[int] = None
    dst_port: Optional[int] = None
    protocol: str = "TCP"
    packets: int = 1
    bytes: int = 0
    duration: float = 0.0
    tcp_flags: Optional[str] = None
    label: Optional[str] = None

class DataQualityReport(BaseModel):
    total_rows: int
    valid_rows: int
    invalid_rows: int
    missing_value_counts: Dict[str, int]
    time_start: Optional[str] = None
    time_end: Optional[str] = None
    detected_columns: List[str]

class TrafficFeatures(BaseModel):
    total_bytes: int = 0
    total_packets: int = 0
    active_flows: int = 0
    traffic_mbps: float = 0.0

class BehavioralFeatures(BaseModel):
    destination_diversity: int = 0
    source_diversity: int = 0
    tcp_syn_rate: float = 0.0
    dst_port_count: int = 0
    protocol_distribution: Dict[str, int] = Field(default_factory=dict)
    east_west_traffic_bytes: int = 0
    avg_flow_duration: float = 0.0

class TopologyNode(BaseModel):
    id: str
    label: str
    type: str = "host"
    ip: str
    status: str = "clean"
    zone: str = "INTERNAL"
    x: Optional[int] = None
    y: Optional[int] = None
    connections: int = 0
    newEdges: int = 0

class TopologyEdge(BaseModel):
    source: str
    target: str
    status: str = "OBSERVED"
    type: str = "normal"
    label: str = ""

class TopologyZone(BaseModel):
    id: str
    label: str
    color: str

class TopologyState(BaseModel):
    zones: List[TopologyZone] = Field(default_factory=list)
    nodes: List[TopologyNode] = Field(default_factory=list)
    edges: List[TopologyEdge] = Field(default_factory=list)

class NetworkState(BaseModel):
    window_id: int
    time_label: str
    timestamp: str
    traffic: TrafficFeatures
    behavior: BehavioralFeatures
    topology: TopologyState
    new_edges_count: int = 0
    phase: str = "BASELINE"
    active_hosts: int = 0

class TrajectoryStep(BaseModel):
    id: str
    stage: str
    techniqueId: str
    techniqueName: str
    status: str  # "OBSERVED", "CURRENT", "FORECAST", "ACTUAL", "PENDING"
    semanticState: str  # "observed", "current", "forecast", "actual"
    timestamp: Optional[str] = None
    estimatedTime: Optional[str] = None
    sourceHost: str
    targetHost: str
    details: str
    confidence: Optional[float] = None
    isCurrent: bool = False

class EvidenceSignal(BaseModel):
    id: str
    time: str
    type: str
    source: str
    indicator: str
    severity: str
    mitreId: Optional[str] = None

class MitreTechnique(BaseModel):
    technique_id: str
    technique_name: str
    tactic: str
    tactic_id: str
    description: str
    observed_indicators: List[str] = Field(default_factory=list)

class WhatIfRequest(BaseModel):
    scenario_id: str
    intervention: str  # e.g., "isolate_host", "revoke_credentials", "block_port"
    host: str

class WhatIfStep(BaseModel):
    stage: str
    status: str
    time: str
    probability: Optional[int] = None
    isCurrent: bool = False
    isInterventionPoint: bool = False

class RiskComparisonItem(BaseModel):
    stage: str
    baselineProb: int
    interventionProb: int

class WhatIfResponse(BaseModel):
    targetHost: str
    targetIp: str
    compromisedHost: str
    baselineTrajectory: List[WhatIfStep]
    interventionTrajectory: List[WhatIfStep]
    riskComparison: List[RiskComparisonItem]
    simulatedDivergenceNotice: str = "Simulated / modelled projection (Phase 1)"
