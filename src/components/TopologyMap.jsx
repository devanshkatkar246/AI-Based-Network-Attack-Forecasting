"use client";

import React, { useState } from "react";
import { Server, Shield, Database, Radio, Globe } from "lucide-react";

export default function TopologyMap({ topology }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!topology || !topology.nodes) return null;

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
    compromised: { border: "border-navy-800", bg: "bg-navy-800", text: "text-white", dot: "bg-warning" },
    targeted: { border: "border-warning-border", bg: "bg-warning-light", text: "text-navy-800", dot: "bg-warning" },
    "forecasted-target": { border: "border-dashed border-forecast-border", bg: "bg-forecast-light", text: "text-forecast font-bold", dot: "bg-forecast" },
    "at-risk": { border: "border-dashed border-slate-300", bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" },
    external: { border: "border-red-300", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" }
  };

  return (
    <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* Header & Subtitle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <div>
          <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
            TEMPORAL NETWORK TOPOLOGY
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Visual communication graph
          </p>
        </div>

        {/* Compact Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            <span className="text-slate-700 font-medium">Observed Host</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-forecast bg-forecast-light" />
            <span className="text-forecast font-bold">Forecast Target</span>
          </div>
        </div>
      </div>

      {/* Network Graph Visual Canvas */}
      <div className="relative w-full h-56 bg-slate-50/70 border border-slate-200/80 rounded-lg overflow-hidden p-4 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {topology.edges.map((edge, idx) => {
            const sourceNode = topology.nodes.find((n) => n.id === edge.source);
            const targetNode = topology.nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isForecast = edge.status === "FORECAST";

            return (
              <g key={idx}>
                <line
                  x1={`${(sourceNode.x / 800) * 100}%`}
                  y1={`${(sourceNode.y / 300) * 100}%`}
                  x2={`${(targetNode.x / 800) * 100}%`}
                  y2={`${(targetNode.y / 300) * 100}%`}
                  stroke={isForecast ? "#6366F1" : "#475569"}
                  strokeWidth={isForecast ? 2 : 1.5}
                  strokeDasharray={isForecast ? "5 5" : "none"}
                  opacity={isForecast ? 0.85 : 0.6}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes Positioning */}
        <div className="relative w-full h-full">
          {topology.nodes.map((node) => {
            const Icon = nodeIconMap[node.type] || Server;
            const style = nodeColorMap[node.status] || nodeColorMap.clean;
            const isSelected = activeNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(isSelected ? null : node)}
                style={{
                  left: `${(node.x / 800) * 100}%`,
                  top: `${(node.y / 300) * 100}%`,
                  transform: "translate(-50%, -50%)"
                }}
                className={`absolute cursor-pointer transition-all duration-200 rounded-lg p-2 flex items-center gap-1.5 border shadow-subtle hover:scale-105 z-10 ${style.border} ${style.bg} ${isSelected ? "ring-2 ring-navy-800" : ""}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <Icon className={`w-3.5 h-3.5 ${node.status === "compromised" ? "text-white" : "text-navy-800"}`} />
                <div className="font-mono text-[10px] leading-tight">
                  <div className={`font-bold ${node.status === "compromised" ? "text-white" : "text-navy-800"}`}>
                    {node.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Host Detail Overlay */}
      {activeNode ? (
        <div className="mt-2 p-2 bg-slate-100 rounded border border-slate-200 text-[11px] font-mono flex items-center justify-between">
          <div>
            <span className="font-bold text-navy-800">{activeNode.label}</span> ({activeNode.ip}) • Status: <span className="uppercase font-semibold">{activeNode.status}</span>
          </div>
          <button onClick={() => setActiveNode(null)} className="text-[10px] text-slate-500 hover:text-slate-800 underline">Dismiss</button>
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>{topology.nodes.length} Monitored Hosts</span>
          <span>Click node for host details</span>
        </div>
      )}
    </div>
  );
}
