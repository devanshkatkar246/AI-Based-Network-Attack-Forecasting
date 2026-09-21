"use client";

import React, { useState } from "react";
import StatusBadge from "../StatusBadge";

export default function ForecastTrajectoryHero({ trajectory, selectedHorizon }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!trajectory || trajectory.length === 0) return null;

  return (
    <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card mb-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
            FUTURE ATTACK TRAJECTORY
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Temporal evolution: Past → Current → Projected Future
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            <span className="text-slate-700 font-medium">OBSERVED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-accent bg-blue-50" />
            <span className="text-accent font-bold">CURRENT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-forecast bg-forecast-light" />
            <span className="text-forecast font-bold">FORECAST</span>
          </div>
        </div>
      </div>

      {/* Trajectory Horizontal Flow */}
      <div className="overflow-x-auto overflow-y-hidden py-3 scrollbar-thin">
        <div className="flex items-center gap-3 min-w-[760px] px-1">
          {trajectory.map((node, idx) => {
            const isObserved = node.status === "OBSERVED";
            const isForecast = node.status === "FORECAST";
            const isCurrent = node.isCurrent;
            const isSelected = activeNode?.id === node.id;
            const isHighlightedHorizon = selectedHorizon && node.estimatedTime?.includes(selectedHorizon);

            const timeLabel = isCurrent
              ? "NOW"
              : isForecast
              ? node.estimatedTime || "+30s"
              : node.timestamp || `T-${(trajectory.length - idx) * 30}s`;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setActiveNode(isSelected ? null : node)}
                  className={`flex-1 min-w-[160px] max-w-[210px] cursor-pointer transition-all duration-200 rounded-lg p-3.5 flex flex-col justify-between h-36 ${
                    isCurrent
                      ? "bg-blue-50/80 border-2 border-accent shadow-md ring-2 ring-accent/20 scale-[1.03]"
                      : isObserved
                      ? "bg-slate-50 border border-slate-300 hover:border-slate-400"
                      : isHighlightedHorizon
                      ? "bg-forecast-light border-2 border-dashed border-forecast shadow-forecast ring-2 ring-forecast/20"
                      : "bg-forecast-light/40 border border-dashed border-forecast-border hover:border-forecast"
                  } ${isSelected ? "ring-2 ring-navy-800" : ""}`}
                >
                  {/* Stage Label */}
                  <div className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider truncate">
                    {node.stage}
                  </div>

                  {/* Behaviour Name */}
                  <div
                    className={`text-xs font-bold leading-tight my-1 line-clamp-2 ${
                      isCurrent
                        ? "text-navy-800"
                        : isForecast
                        ? "text-forecast"
                        : "text-slate-800"
                    }`}
                  >
                    {node.techniqueName}
                  </div>

                  {/* Time & Probability */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 font-mono text-[11px]">
                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? "text-navy-800 font-bold"
                          : isForecast
                          ? "text-forecast"
                          : "text-slate-500"
                      }`}
                    >
                      {timeLabel}
                    </span>

                    {isForecast && node.probability ? (
                      <span className="font-bold text-forecast bg-white/80 px-1.5 py-0.5 rounded border border-forecast-border">
                        {node.probability}%
                      </span>
                    ) : (
                      <StatusBadge
                        status={node.status}
                        size="sm"
                        customLabel={isCurrent ? "NOW" : "OBSERVED"}
                      />
                    )}
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < trajectory.length - 1 && (
                  <div className="flex items-center justify-center text-slate-300 flex-shrink-0 px-0.5 font-mono text-xs">
                    {isCurrent || (isObserved && trajectory[idx + 1]?.isCurrent) ? (
                      <span className="font-bold text-accent">━━━━▶</span>
                    ) : isObserved && trajectory[idx + 1]?.status === "OBSERVED" ? (
                      <span className="text-slate-400">────▶</span>
                    ) : (
                      <span className="text-forecast">┈ ┈ ┈▶</span>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {activeNode && (
        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between font-mono animate-fadeIn">
          <div>
            <span className="font-bold text-navy-800">
              [{activeNode.techniqueId}] {activeNode.techniqueName} ({activeNode.estimatedTime || "Observed"}):
            </span>{" "}
            <span className="text-slate-600">{activeNode.details}</span>{" "}
            <span className="text-slate-400 text-[10px]">
              • Target: {activeNode.targetHost}
            </span>
          </div>
          <button
            onClick={() => setActiveNode(null)}
            className="text-[10px] text-slate-400 hover:text-navy-800 underline ml-3 flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
