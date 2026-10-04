import networkx as nx
from typing import List, Set, Tuple, Dict, Any, Optional
from ..models.schemas import FlowTelemetry, TopologyState, TopologyNode, TopologyEdge, TopologyZone

class TopologyService:
    @staticmethod
    def build_topology(
        records: List[FlowTelemetry],
        previous_edges: Optional[Set[Tuple[str, str]]] = None
    ) -> Tuple[TopologyState, Set[Tuple[str, str]], int]:
        G = nx.DiGraph()
        
        # Track node metrics
        host_connections: Dict[str, Set[str]] = {}
        host_new_edges: Dict[str, int] = {}
        edge_labels: Dict[Tuple[str, str], str] = {}
        edge_protocols: Dict[Tuple[str, str], Set[str]] = {}
        
        current_edges: Set[Tuple[str, str]] = set()

        for r in records:
            src = r.src_ip
            dst = r.dst_ip
            G.add_node(src)
            G.add_node(dst)

            edge = (src, dst)
            current_edges.add(edge)

            if src not in host_connections:
                host_connections[src] = set()
            if dst not in host_connections:
                host_connections[dst] = set()
            host_connections[src].add(dst)
            host_connections[dst].add(src)

            if edge not in edge_protocols:
                edge_protocols[edge] = set()
            edge_protocols[edge].add(r.protocol)

            if r.dst_port:
                edge_labels[edge] = f"{r.protocol}/{r.dst_port}"
            else:
                edge_labels[edge] = r.protocol

        # Detect new edges relative to previous_edges
        new_edges = set()
        if previous_edges is not None:
            new_edges = current_edges - previous_edges

        for (src, dst) in new_edges:
            host_new_edges[src] = host_new_edges.get(src, 0) + 1
            host_new_edges[dst] = host_new_edges.get(dst, 0) + 1

        # Build nodes
        nodes: List[TopologyNode] = []
        for idx, node_ip in enumerate(sorted(G.nodes())):
            # Assign zone based on IP structure
            zone_id = "INTERNAL"
            if node_ip.startswith("198.51") or node_ip.startswith("203.0"):
                zone_id = "EXTERNAL"
            elif ".1." in node_ip or ".4." in node_ip:
                zone_id = "SERVERS"

            # Assign coordinates for neat rendering
            x = 100 + (idx % 4) * 160
            y = 120 + (idx // 4) * 100

            node_type = "gateway" if "1" in node_ip.split(".")[-1] else "host"
            if zone_id == "EXTERNAL":
                node_type = "external"

            nodes.append(TopologyNode(
                id=f"node-{node_ip.replace('.', '_')}",
                label=f"Host-{node_ip}",
                type=node_type,
                ip=node_ip,
                status="clean",
                zone=zone_id,
                x=x,
                y=y,
                connections=len(host_connections.get(node_ip, set())),
                newEdges=host_new_edges.get(node_ip, 0)
            ))

        # Build edges
        edges: List[TopologyEdge] = []
        for (src, dst) in G.edges():
            edge_tuple = (src, dst)
            is_new = edge_tuple in new_edges
            status = "FORECAST" if is_new else "OBSERVED"
            edges.append(TopologyEdge(
                source=f"node-{src.replace('.', '_')}",
                target=f"node-{dst.replace('.', '_')}",
                status=status,
                type="suspicious" if is_new else "normal",
                label=edge_labels.get(edge_tuple, "IP Flow")
            ))

        zones = [
            TopologyZone(id="z-internal", label="INTERNAL SUBNET", color="bg-slate-100/50 border-slate-200"),
            TopologyZone(id="z-servers", label="PRODUCTION SERVERS", color="bg-blue-50/40 border-blue-200/50"),
            TopologyZone(id="z-external", label="EXTERNAL NETWORKS", color="bg-red-50/30 border-red-200/40")
        ]

        state = TopologyState(zones=zones, nodes=nodes, edges=edges)
        return state, current_edges, len(new_edges)
