"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { SCENARIOS } from "@/data/mockData";
import {
  Network,
  Server,
  Shield,
  Database,
  Radio,
  Globe,
  ArrowRight,
  Clock,
  Activity,
  Zap,
  Layers
} from "lucide-react";

function NetworkStateContent({ activeScenario }) {
  const scenario = activeScenario || SCENARIOS[0];
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState(
    scenario.topology.nodes.find((n) => n.status === "forecasted-target") || scenario.topology.nodes[3]
  );

  const nodeIconMap = {
    gateway: Globe,
    dc: Shield,
    host: Server,
    server: Server,
    db: Database,
    external: Radio,
  };

  const nodeColorMap = {
    clean: { border: "border-[#E5E1D8] dark:border-[#2B2E33]", bg: "bg-[#FFFDF8] dark:bg-[#1F2125]", text: "text-[#17191C] dark:text-[#F7F5EE]", dot: "bg-[#8B8D91]" },
    compromised: { border: "border-[#314B78]", bg: "bg-[#314B78]", text: "text-[#FFFDF8] font-bold", dot: "bg-[#B68432]" },
    targeted: { border: "border-[#B68432]", bg: "bg-[#FAF6EF] dark:bg-[#2A2318]", text: "text-[#17191C] font-bold", dot: "bg-[#B68432]" },
    "forecasted-target": { border: "border-2 border-dashed border-[#657A9C]", bg: "bg-[#F0F4F9] dark:bg-[#1E2633]", text: "text-[#314B78] font-bold dark:text-[#9AB0D3]", dot: "bg-[#314B78]" },
    "at-risk": { border: "border-dashed border-[#E5E1D8]", bg: "bg-[#FBFAF6] dark:bg-[#17191C]", text: "text-[#5F6268]", dot: "bg-[#8B8D91]" },
    external: { border: "border-[#9A4D48]", bg: "bg-[#F9F2F1] dark:bg-[#2B1D1C]", text: "text-[#9A4D48] font-semibold", dot: "bg-[#9A4D48]" }
  };

  const handleSimulateImpact = (node) => {
    if (!node) return;
    router.push(`/what-if?target=${encodeURIComponent(node.label)}`);
  };

  return (
    <div className="space-y-6 select-none font-mono">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E5E1D8] dark:border-[#2B2E33] gap-2">
        <div>
          <h1 className="text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase tracking-wider">
            NETWORK STATE & TELEMETRY PIPELINE
          </h1>
          <p className="text-[11px] text-[#5F6268] dark:text-[#8B8D91] mt-0.5">
            Current communication structure • Context: <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{scenario.id}</span>
          </p>
        </div>
        <StatusBadge status={scenario.telemetry.networkState} size="sm" />
      </div>

      {/* 2. Visual Telemetry Pipeline Explanation */}
      <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-4 shadow-card">
        <div className="text-[10px] uppercase font-bold text-[#8B8D91] mb-2">
          STATE TRANSFORMATION PIPELINE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg">
            <div className="text-[9px] text-[#5F6268] font-bold uppercase">01 TELEMETRY INPUT</div>
            <div className="font-bold text-[#17191C] dark:text-[#F7F5EE] mt-0.5">NETWORK TELEMETRY</div>
            <div className="text-[10px] text-[#8B8D91] mt-1">Flow records, packet counts, protocol events</div>
          </div>
          <div className="p-3 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg">
            <div className="text-[9px] text-[#314B78] dark:text-[#9AB0D3] font-bold uppercase">02 AGGREGATION</div>
            <div className="font-bold text-[#314B78] dark:text-[#9AB0D3] mt-0.5">TEMPORAL WINDOW</div>
            <div className="text-[10px] text-[#8B8D91] mt-1">60s sliding window feature aggregation</div>
          </div>
          <div className="p-3 bg-[#F0F4F9] dark:bg-[#1E2633] border border-[#657A9C]/40 rounded-lg">
            <div className="text-[9px] text-[#314B78] dark:text-[#9AB0D3] font-bold uppercase">03 SYSTEM STATE</div>
            <div className="font-bold text-[#314B78] dark:text-[#9AB0D3] mt-0.5">NETWORK STATE (S_t)</div>
            <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91] mt-1">Communication graph & node features</div>
          </div>
        </div>
      </div>

      {/* 3. Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-base font-bold text-[#17191C] dark:text-[#F7F5EE] leading-tight">
              {scenario.telemetry.activeHosts}
            </div>
            <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91] uppercase tracking-wide">
              Active Hosts
            </div>
          </div>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-base font-bold text-[#17191C] dark:text-[#F7F5EE] leading-tight">
              {scenario.telemetry.activeFlows}
            </div>
            <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91] uppercase tracking-wide">
              Active Flows
            </div>
          </div>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-base font-bold text-[#314B78] dark:text-[#9AB0D3] leading-tight">
              {scenario.telemetry.newEdges}
            </div>
            <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91] uppercase tracking-wide">
              New Edges
            </div>
          </div>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
          <div>
            <div className="mt-0.5">
              <StatusBadge status={scenario.telemetry.networkState} size="sm" />
            </div>
            <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91] uppercase tracking-wide mt-1">
              State Level
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Network Graph Area + Selected Node Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Topology Graph Container (2/3 width) */}
        <div className="lg:col-span-2 bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-[#314B78]" />
              <h2 className="text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase tracking-wider">
                ANALYTICAL COMMUNICATIONS TOPOLOGY
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#B68432]" /> Suspicious Node
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#9A4D48]" /> High Risk Asset
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-[#657A9C] border-t border-dashed border-[#657A9C]" /> Forecast Path
              </span>
            </div>
          </div>

          {/* Interactive Topology Graph Canvas */}
          <div className="relative w-full h-80 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg overflow-hidden p-4">
            {/* Network Zones Subtitle Background Labels */}
            {scenario.topology.zones?.map((zone) => (
              <div
                key={zone.id}
                className="absolute text-[9px] font-bold text-[#8B8D91] tracking-widest uppercase pointer-events-none px-2 py-0.5 rounded border border-[#E5E1D8] bg-[#FFFDF8]/60 opacity-80"
                style={{
                  left: zone.id === "z-internal" ? "2%" : zone.id === "z-servers" ? "32%" : zone.id === "z-db" ? "62%" : "82%",
                  top: "4%"
                }}
              >
                {zone.label}
              </div>
            ))}

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {scenario.topology.edges.map((edge, idx) => {
                const sourceNode = scenario.topology.nodes.find((n) => n.id === edge.source);
                const targetNode = scenario.topology.nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isForecast = edge.status === "FORECAST" || edge.type === "forecast";
                const isSuspicious = edge.type === "suspicious";

                return (
                  <g key={idx}>
                    <line
                      x1={`${(sourceNode.x / 800) * 100}%`}
                      y1={`${(sourceNode.y / 300) * 100}%`}
                      x2={`${(targetNode.x / 800) * 100}%`}
                      y2={`${(targetNode.y / 300) * 100}%`}
                      stroke={isForecast ? "#657A9C" : isSuspicious ? "#314B78" : "#D6D1C5"}
                      strokeWidth={isForecast ? 1.5 : isSuspicious ? 1.5 : 1}
                      strokeDasharray={isForecast ? "5 5" : "none"}
                      opacity={0.85}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Topology Nodes */}
            <div className="relative w-full h-full">
              {scenario.topology.nodes.map((node) => {
                const Icon = nodeIconMap[node.type] || Server;
                const style = nodeColorMap[node.status] || nodeColorMap.clean;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: `${(node.x / 800) * 100}%`,
                      top: `${(node.y / 300) * 100}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                    className={`absolute cursor-pointer transition-all duration-150 rounded-lg p-2.5 flex items-center gap-2 border shadow-subtle hover:scale-105 z-10 ${style.border} ${style.bg} ${isSelected ? "ring-2 ring-[#314B78] scale-105" : ""}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <Icon className="w-3.5 h-3.5" />
                    <div className="text-[10px] leading-tight">
                      <div className={style.text}>{node.label}</div>
                      <div className="text-[9px] opacity-70">{node.ip}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-[#E5E1D8] dark:border-[#2B2E33] flex items-center justify-between text-[10px] text-[#8B8D91]">
            <span>Click any node to inspect host state</span>
            <span>{scenario.topology.nodes.length} Monitored Nodes</span>
          </div>
        </div>

        {/* Selected Host Detail Panel (1/3 width) */}
        <div className="lg:col-span-1 bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-4">
              <div className="text-xs font-bold uppercase text-[#17191C] dark:text-[#F7F5EE]">
                SELECTED HOST DETAILS
              </div>
              <StatusBadge status={selectedNode?.status || "NORMAL"} size="sm" />
            </div>

            {selectedNode ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="text-[10px] text-[#8B8D91] uppercase font-bold">Hostname</div>
                  <div className="text-base font-bold text-[#17191C] dark:text-[#F7F5EE] mt-0.5">{selectedNode.label}</div>
                  <div className="text-xs text-[#5F6268] dark:text-[#8B8D91] font-semibold">{selectedNode.ip}</div>
                </div>

                <div className="p-3 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#5F6268] dark:text-[#8B8D91]">Zone:</span>
                    <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{selectedNode.zone || "INTERNAL"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6268] dark:text-[#8B8D91]">Active Connections:</span>
                    <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{selectedNode.connections || 6}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6268] dark:text-[#8B8D91]">New Edges:</span>
                    <span className="font-bold text-[#314B78] dark:text-[#9AB0D3]">{selectedNode.newEdges || 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6268] dark:text-[#8B8D91]">Protocols:</span>
                    <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">SMB / RPC / LDAP</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF6EF] dark:bg-[#2A2318] border border-[#E2D3B8] dark:border-[#4A3C26] rounded-lg text-[11px] text-[#B68432]">
                  <span className="font-bold uppercase block mb-0.5">Topological Risk Notice</span>
                  Host exhibits unusual east-west communication patterns. Projected target for lateral movement.
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#8B8D91] text-xs">
                Select a network node to inspect host state
              </div>
            )}
          </div>

          {/* Action CTA: Navigate to /what-if */}
          <div className="pt-4 border-t border-[#E5E1D8] dark:border-[#2B2E33]">
            <button
              onClick={() => handleSimulateImpact(selectedNode)}
              className="w-full bg-[#17191C] dark:bg-[#25282D] hover:bg-[#2B2E33] text-[#FFFDF8] rounded-lg px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors group border border-transparent dark:border-[#3D4045]"
            >
              <span>SIMULATE IMPACT FOR {selectedNode?.label || "HOST"}</span>
              <ArrowRight className="w-4 h-4 text-[#9AB0D3] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Network Timeline */}
      <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-4 shadow-subtle">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E5E1D8] dark:border-[#2B2E33] text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase">
          <Clock className="w-4 h-4 text-[#314B78]" />
          <span>NETWORK COMMUNICATION TIMELINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {scenario.networkTimeline?.map((item, idx) => (
            <div key={idx} className="p-3 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg flex items-center gap-3">
              <span className="font-bold text-[#314B78] dark:text-[#9AB0D3] text-xs flex-shrink-0">{item.time}:</span>
              <span className="text-[#17191C] dark:text-[#F7F5EE] text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NetworkPage() {
  return (
    <AppShell title="NETWORK STATE & TOPOLOGY">
      {({ activeScenario, activeScenarioId }) => {
        if (!activeScenarioId) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
              <EmptyState
                title="NO SCENARIO LOADED"
                message="Select or upload a network attack scenario to view network communication states and dynamic topology."
              />
              <Link
                href="/scenarios"
                className="px-5 py-2.5 rounded bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] font-mono text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>OPEN SCENARIO LIBRARY</span>
              </Link>
            </div>
          );
        }
        return <NetworkStateContent activeScenario={activeScenario} />;
      }}
    </AppShell>
  );
}

