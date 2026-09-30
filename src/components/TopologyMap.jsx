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
    clean: { border: "border-slate-200 dark:border-slate-700", bg: "bg-white dark:bg-slate-800", text: "text-slate-800 dark:text-slate-100", dot: "bg-slate-400" },
    compromised: { border: "border-navy-800 dark:border-blue-500", bg: "bg-navy-800 dark:bg-blue-900", text: "text-white", dot: "bg-amber-400" },
    targeted: { border: "border-slate-300 dark:border-amber-700/60", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-navy-800 dark:text-amber-200", dot: "bg-amber-500" },
    "forecasted-target": { border: "border-dashed border-forecast", bg: "bg-indigo-50/60 dark:bg-indigo-950/60", text: "text-forecast font-bold dark:text-indigo-300", dot: "bg-forecast" },
    "at-risk": { border: "border-dashed border-slate-200 dark:border-slate-700", bg: "bg-slate-50 dark:bg-slate-800/60", text: "text-slate-600 dark:text-slate-300", dot: "bg-slate-300 dark:bg-slate-600" },
    external: { border: "border-red-200 dark:border-red-900/60", bg: "bg-red-50 dark:bg-red-950/50", text: "text-red-700 dark:text-red-300", dot: "bg-red-400" }
  };

  return (
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
      {/* Header & Subtitle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
        <div>
          <h2 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider font-mono">
            TEMPORAL NETWORK TOPOLOGY
          </h2>
          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
            Visual communication graph
          </p>
        </div>

        {/* Compact Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-300" />
            <span className="text-slate-600 dark:text-slate-300">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-dashed border-forecast bg-indigo-50 dark:bg-indigo-950/60" />
            <span className="text-forecast">Forecast</span>
          </div>
        </div>
      </div>

      {/* Network Graph Visual Canvas */}
      <div className="relative w-full h-56 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 rounded-lg overflow-hidden p-4 flex items-center justify-center">
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
                  stroke={isForecast ? "#6366F1" : "#94A3B8"}
                  strokeWidth={isForecast ? 1.5 : 1}
                  strokeDasharray={isForecast ? "4 4" : "none"}
                  opacity={isForecast ? 0.8 : 0.4}
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
                className={`absolute cursor-pointer transition-all duration-150 rounded p-1.5 flex items-center gap-1 border shadow-subtle hover:scale-105 z-10 ${style.border} ${style.bg} ${isSelected ? "ring-2 ring-navy-800 dark:ring-slate-200" : ""}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <Icon className={`w-3 h-3 ${node.status === "compromised" ? "text-white" : "text-navy-800 dark:text-slate-100"}`} />
                <div className="font-mono text-[10px] leading-tight">
                  <div className={`font-semibold ${node.status === "compromised" ? "text-white" : style.text}`}>
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
        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-mono flex items-center justify-between">
          <div>
            <span className="font-bold text-navy-800 dark:text-slate-100">{activeNode.label}</span> ({activeNode.ip}) • Status: <span className="uppercase font-semibold text-navy-800 dark:text-slate-200">{activeNode.status}</span>
          </div>
          <button onClick={() => setActiveNode(null)} className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline">Dismiss</button>
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500">
          <span>{topology.nodes.length} Monitored Hosts</span>
          <span>Click node for details</span>
        </div>
      )}
    </div>
  );
}

