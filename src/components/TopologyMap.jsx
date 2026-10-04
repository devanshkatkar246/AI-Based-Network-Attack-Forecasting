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
    clean: { border: "border-[#2A323C]", bg: "bg-[#191F27]", text: "text-[#E7EAF0]", dot: "bg-[#6F7885]" },
    compromised: { border: "border-[#6F8FBE]", bg: "bg-[#1D242D]", text: "text-[#E7EAF0]", dot: "bg-[#B98A3A]" },
    targeted: { border: "border-[#B98A3A]", bg: "bg-[#2A2318]", text: "text-[#E7EAF0]", dot: "bg-[#B98A3A]" },
    "forecasted-target": { border: "border-dashed border-[#718CB8]", bg: "bg-[#192230]", text: "text-[#718CB8] font-bold", dot: "bg-[#718CB8]" },
    "at-risk": { border: "border-dashed border-[#2A323C]", bg: "bg-[#151A21]", text: "text-[#9BA4B0]", dot: "bg-[#6F7885]" },
    external: { border: "border-[#A85D59]", bg: "bg-[#2B1D1C]", text: "text-[#A85D59]", dot: "bg-[#A85D59]" }
  };

  return (
    <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
      {/* Header & Subtitle */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A323C] mb-2 font-mono">
        <div>
          <h2 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
            TEMPORAL NETWORK TOPOLOGY
          </h2>
          <p className="text-[11px] text-[#9BA4B0] mt-0.5">
            Analytical communication graph
          </p>
        </div>

        {/* Analytical Legend */}
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#6F8FBE]" />
            <span className="text-[#6F8FBE] font-bold">CURRENT PATH</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#718CB8] border-t border-dashed border-[#718CB8]" />
            <span className="text-[#718CB8]">FORECAST PATH</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#668B73]" />
            <span className="text-[#668B73] font-bold">ACTUAL</span>
          </div>
        </div>
      </div>

      {/* Network Graph Visual Canvas */}
      <div className="relative w-full h-56 bg-[#0D1015] border border-[#2A323C] rounded-lg overflow-hidden p-4 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {topology.edges.map((edge, idx) => {
            const sourceNode = topology.nodes.find((n) => n.id === edge.source);
            const targetNode = topology.nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isForecast = edge.status === "FORECAST" || edge.type === "forecast";
            const isActual = edge.status === "ACTUAL";
            const isCurrent = edge.type === "suspicious" || edge.status === "OBSERVED" || edge.status === "CURRENT";

            return (
              <g key={idx}>
                <line
                  x1={`${(sourceNode.x / 800) * 100}%`}
                  y1={`${(sourceNode.y / 300) * 100}%`}
                  x2={`${(targetNode.x / 800) * 100}%`}
                  y2={`${(targetNode.y / 300) * 100}%`}
                  stroke={isActual ? "#668B73" : isForecast ? "#718CB8" : isCurrent ? "#6F8FBE" : "#2A323C"}
                  strokeWidth={isActual ? 2 : isForecast ? 1.5 : isCurrent ? 1.5 : 1}
                  strokeDasharray={isForecast ? "4 4" : "none"}
                  opacity={isForecast ? 0.9 : 0.8}
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
                className={`absolute cursor-pointer transition-all duration-150 rounded p-1.5 flex items-center gap-1 border shadow-subtle hover:scale-105 z-10 ${style.border} ${style.bg} ${isSelected ? "ring-2 ring-[#6F8FBE]" : ""}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <Icon className="w-3 h-3 text-[#E7EAF0]" />
                <div className="font-mono text-[10px] leading-tight">
                  <div className={`font-semibold ${style.text}`}>
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
        <div className="mt-2 p-2 bg-[#191F27] rounded border border-[#2A323C] text-[11px] font-mono flex items-center justify-between">
          <div>
            <span className="font-bold text-[#E7EAF0]">{activeNode.label}</span> ({activeNode.ip}) • Status: <span className="uppercase font-semibold text-[#6F8FBE]">{activeNode.status}</span>
          </div>
          <button onClick={() => setActiveNode(null)} className="text-[10px] text-[#9BA4B0] hover:text-[#E7EAF0] underline">Dismiss</button>
        </div>
      ) : (
        <div className="pt-2 border-t border-[#2A323C] flex items-center justify-between text-[10px] font-mono text-[#6F7885]">
          <span>{topology.nodes.length} Monitored Network Nodes</span>
          <span>Click node to view host communication state</span>
        </div>
      )}
    </div>
  );
}



