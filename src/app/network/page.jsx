"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { SCENARIOS } from "@/data/mockData";
import {
  Network,
  Server,
  Shield,
  Database,
  Radio,
  Globe,
  Sliders,
  ArrowRight,
  Clock,
  Activity,
  AlertTriangle
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
    clean: { border: "border-slate-300", bg: "bg-white", text: "text-slate-800", dot: "bg-slate-400" },
    compromised: { border: "border-warning", bg: "bg-amber-50/80", text: "text-navy-800 font-bold", dot: "bg-warning" },
    targeted: { border: "border-warning", bg: "bg-amber-50/80", text: "text-navy-800 font-bold", dot: "bg-warning" },
    "forecasted-target": { border: "border-2 border-critical", bg: "bg-red-50/90", text: "text-critical font-bold", dot: "bg-critical" },
    "at-risk": { border: "border-dashed border-forecast-border", bg: "bg-forecast-light", text: "text-forecast font-bold", dot: "bg-forecast" },
    external: { border: "border-red-300", bg: "bg-red-50", text: "text-red-700 font-semibold", dot: "bg-red-500" }
  };

  const handleSimulateImpact = (node) => {
    if (!node) return;
    router.push(`/what-if?target=${encodeURIComponent(node.label)}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
        <div>
          <h1 className="text-sm font-bold text-navy-800 uppercase tracking-wider font-mono">
            NETWORK STATE
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Current communication structure • Scenario:{" "}
            <span className="font-bold text-navy-800">{scenario.id}</span>
          </p>
        </div>
        <StatusBadge status={scenario.telemetry.networkState} size="sm" />
      </div>

      {/* 2. Top Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-slate-200/90 rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-base font-bold text-navy-800 font-mono leading-tight">
              {scenario.telemetry.activeHosts}
            </div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
              Hosts
            </div>
          </div>
        </div>

        <div className="bg-surface border border-slate-200/90 rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-base font-bold text-navy-800 font-mono leading-tight">
              {scenario.telemetry.activeConnections}
            </div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
              Connections
            </div>
          </div>
        </div>

        <div className="bg-surface border border-slate-200/90 rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-base font-bold text-accent font-mono leading-tight">
              {scenario.telemetry.newEdges}
            </div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
              New Edges
            </div>
          </div>
        </div>

        <div className="bg-surface border border-slate-200/90 rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
          <div>
            <div className="mt-0.5">
              <StatusBadge status={scenario.telemetry.networkState} size="sm" />
            </div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wide mt-1">
              State
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Network Graph Area + Selected Node Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Topology Graph Container (2/3 width) */}
        <div className="lg:col-span-2 bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
                COMMUNICATION TOPOLOGY GRAPH
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Suspicious Host
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600" /> High-Risk Asset
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-forecast border-t border-dashed border-forecast" /> Forecast Edge
              </span>
            </div>
          </div>

          {/* Interactive Topology Graph Canvas */}
          <div className="relative w-full h-80 bg-slate-50/80 border border-slate-200/80 rounded-lg overflow-hidden p-4">
            {/* Network Zones Subtitle Background Labels */}
            {scenario.topology.zones?.map((zone) => (
              <div
                key={zone.id}
                className="absolute text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase pointer-events-none px-2 py-0.5 rounded border border-slate-200/40 bg-white/40 opacity-70"
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
                const isNew = edge.type === "new";

                return (
                  <g key={idx}>
                    <line
                      x1={`${(sourceNode.x / 800) * 100}%`}
                      y1={`${(sourceNode.y / 300) * 100}%`}
                      x2={`${(targetNode.x / 800) * 100}%`}
                      y2={`${(targetNode.y / 300) * 100}%`}
                      stroke={isForecast ? "#6366F1" : isSuspicious ? "#D97706" : isNew ? "#2563EB" : "#94A3B8"}
                      strokeWidth={isForecast ? 2 : isSuspicious || isNew ? 2 : 1.2}
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
                    className={`absolute cursor-pointer transition-all duration-200 rounded-lg p-2.5 flex items-center gap-2 border shadow-subtle hover:scale-105 z-10 ${style.border} ${style.bg} ${isSelected ? "ring-2 ring-navy-800 scale-105 shadow-md" : ""}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <Icon className="w-3.5 h-3.5" />
                    <div className="font-mono text-[10px] leading-tight">
                      <div className={style.text}>{node.label}</div>
                      <div className="text-[9px] opacity-70">{node.ip}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Click any node to inspect host details</span>
            <span>{scenario.topology.nodes.length} Nodes Rendered</span>
          </div>
        </div>

        {/* Selected Host Detail Panel (1/3 width) */}
        <div className="lg:col-span-1 bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="font-mono text-xs font-bold uppercase text-navy-800">
                SELECTED HOST DETAILS
              </div>
              <StatusBadge status={selectedNode?.status || "NORMAL"} size="sm" />
            </div>

            {selectedNode ? (
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Hostname</div>
                  <div className="text-base font-bold text-navy-800 mt-0.5">{selectedNode.label}</div>
                  <div className="text-xs text-slate-500 font-semibold">{selectedNode.ip}</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Zone:</span>
                    <span className="font-bold text-navy-800">{selectedNode.zone || "INTERNAL"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Active Connections:</span>
                    <span className="font-bold text-navy-800">{selectedNode.connections || 6}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">New Edges:</span>
                    <span className="font-bold text-accent">{selectedNode.newEdges || 3}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Protocols:</span>
                    <span className="font-bold text-navy-800">SMB / RPC / LDAP</span>
                  </div>
                </div>

                <div className="p-3 bg-warning-light/50 border border-warning-border rounded-lg text-[11px] text-slate-700">
                  <span className="font-bold text-warning uppercase block mb-0.5">Topological Risk Notice</span>
                  Host exhibits unusual east-west communication patterns. Projected target for lateral movement.
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 font-mono text-xs">
                Select a network node to inspect host state
              </div>
            )}
          </div>

          {/* Action CTA: Navigate to /what-if */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSimulateImpact(selectedNode)}
              className="w-full bg-navy-800 hover:bg-navy-700 text-white rounded-lg px-4 py-2.5 text-xs font-mono font-semibold flex items-center justify-between transition-colors group"
            >
              <span>Simulate Impact for {selectedNode?.label || "Host"}</span>
              <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Network Timeline */}
      <div className="bg-surface border border-slate-200/90 rounded-xl p-4 shadow-subtle">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 font-mono text-xs font-bold text-navy-800 uppercase">
          <Clock className="w-4 h-4 text-accent" />
          <span>NETWORK COMMUNICATION TIMELINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {scenario.networkTimeline?.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
              <span className="font-bold text-accent text-xs flex-shrink-0">{item.time}:</span>
              <span className="text-slate-700 text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NetworkPage() {
  return (
    <AppShell title="Network State & Topology">
      {({ activeScenario }) => <NetworkStateContent activeScenario={activeScenario} />}
    </AppShell>
  );
}
