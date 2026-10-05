"use client";

import React, { useState } from "react";

import { formatRelativeTime } from "@/lib/temporalUtils";

export default function ForecastTrajectoryHero({ trajectory, selectedHorizon }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!trajectory || trajectory.length === 0) return null;

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card mb-6 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#27303A] mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
            ATTACK TRAJECTORY
          </h2>
          <p className="text-xs text-[#9AA6B2] mt-0.5">
            Observed Past → Current State (NOW) → Forecast Horizons
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6C7987]" />
            <span className="text-[#9AA6B2]">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6F95D6] ring-2 ring-[#6F95D6]/30" />
            <span className="text-[#6F95D6] font-bold">CURRENT (NOW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-dashed border-[#6F95D6] bg-[#1E2632]" />
            <span className="text-[#6F95D6]">Forecast</span>
          </div>
        </div>
      </div>

      {/* Trajectory Horizontal Flow */}
      <div className="overflow-x-auto overflow-y-hidden py-2 scrollbar-thin">
        <div className="flex items-center gap-3 min-w-[760px] px-1">
          {trajectory.map((node, idx) => {
            const isObserved = node.status === "OBSERVED";
            const isForecast = node.status === "FORECAST" || node.isForecast;
            const isActual = node.status === "ACTUAL";
            const isCurrent = node.isCurrent || node.status === "CURRENT";
            const isSelected = activeNode?.id === node.id;
            const normHorizon = selectedHorizon ? selectedHorizon.replace("+", "").replace("s", "") : "";
            const isHighlightedHorizon = isForecast && (
              node.relativeTimeDisplay?.includes(normHorizon) ||
              node.estimatedTime?.includes(normHorizon)
            );

            const timeLabel = isCurrent
              ? "NOW"
              : node.relativeTimeDisplay || formatRelativeTime(node.relativeTimeSeconds);

            const statusLabel = isCurrent
              ? "CURRENT"
              : isActual
              ? "ACTUAL"
              : isForecast
              ? "FORECAST"
              : "OBSERVED";

            return (
              <React.Fragment key={node.id || `node-${idx}`}>
                {/* Node Box */}
                <div
                  onClick={() => setActiveNode(isSelected ? null : node)}
                  className={`flex-1 min-w-[160px] max-w-[210px] cursor-pointer transition-all duration-200 rounded-lg p-3.5 flex flex-col justify-between h-36 ${
                    isCurrent
                      ? "bg-[#1E2632] border-2 border-[#6F95D6] shadow-card ring-2 ring-[#6F95D6]/20 scale-[1.02]"
                      : isActual
                      ? "bg-[#1C2620] border-2 border-[#659477] shadow-card"
                      : isHighlightedHorizon
                      ? "bg-[#1E2632] border-2 border-dashed border-[#6F95D6] shadow-card ring-2 ring-[#6F95D6]/20 scale-[1.02]"
                      : isForecast
                      ? "bg-[#11161D] border-2 border-dashed border-[#6F95D6]/50 hover:border-[#6F95D6]"
                      : "bg-[#11161D] border border-[#27303A] hover:border-[#364250]"
                  } ${isSelected ? "ring-2 ring-[#E8EDF3]" : ""}`}
                >
                  {/* Stage Label */}
                  <div className="text-[10px] text-[#9AA6B2] font-mono font-semibold uppercase tracking-wider truncate">
                    {node.stage}
                  </div>

                  {/* Behaviour Name */}
                  <div
                    className={`text-xs font-bold leading-snug my-1 line-clamp-2 ${
                      isCurrent
                        ? "text-[#6F95D6] font-extrabold"
                        : isActual
                        ? "text-[#659477] font-extrabold"
                        : isForecast
                        ? "text-[#6F95D6] font-bold"
                        : "text-[#E8EDF3] font-semibold"
                    }`}
                  >
                    {node.techniqueName || node.stage}
                  </div>

                  {/* Time & State */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#27303A] text-xs font-mono">
                    <span
                      className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? "bg-[#6F95D6] text-[#0B0F14]"
                          : isActual
                          ? "bg-[#659477] text-[#0B0F14]"
                          : isForecast
                          ? "bg-[#1E2632] text-[#6F95D6]"
                          : "bg-[#19202A] text-[#9AA6B2]"
                      }`}
                    >
                      {statusLabel}
                    </span>

                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? "text-[#6F95D6] font-bold"
                          : isActual
                          ? "text-[#659477] font-bold"
                          : isForecast
                          ? "text-[#6F95D6] font-semibold"
                          : "text-[#6C7987]"
                      }`}
                    >
                      {timeLabel}
                    </span>
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < trajectory.length - 1 && (
                  <div className="flex items-center justify-center flex-shrink-0 px-0.5 text-xs font-mono">
                    {isCurrent ? (
                      <span className="font-bold text-[#6F95D6]">━━━━▶</span>
                    ) : isActual ? (
                      <span className="font-bold text-[#659477]">━━━━▶</span>
                    ) : isObserved && trajectory[idx + 1]?.status === "OBSERVED" ? (
                      <span className="text-[#364250]">────▶</span>
                    ) : (
                      <span className="text-[#6F95D6]/60">┈ ┈ ┈▶</span>
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
        <div className="mt-3 p-3 bg-[#11161D] rounded-lg border border-[#27303A] text-xs flex items-center justify-between animate-fadeIn">
          <div>
            <span className="font-bold text-[#E8EDF3]">
              [{activeNode.techniqueId}] {activeNode.techniqueName} ({activeNode.estimatedTime || activeNode.status}):
            </span>{" "}
            <span className="text-[#9AA6B2]">{activeNode.details}</span>{" "}
            <span className="text-[#6C7987] text-[11px] font-mono">
              • Target: {activeNode.targetHost}
            </span>
          </div>
          <button
            onClick={() => setActiveNode(null)}
            className="text-xs text-[#9AA6B2] hover:text-[#E8EDF3] underline ml-3 flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
