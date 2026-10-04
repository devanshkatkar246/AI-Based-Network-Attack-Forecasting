"use client";

import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { useReplay } from "@/context/ReplayContext";
import { formatRelativeTimestamp } from "@/lib/temporalUtils";

export default function AttackTrajectory({ trajectory }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const { currentTickIndex, CURRENT_FREEZE_INDEX } = useReplay();

  if (!trajectory || trajectory.length === 0) return null;

  return (
    <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card flex flex-col justify-between select-none">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#2A323C] mb-5 gap-2 font-mono">
        <div>
          <h2 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
            ATTACK TRAJECTORY
          </h2>
          <p className="text-[11px] text-[#9BA4B0] mt-0.5">
            Observed Past → Current State → Model Forecast → Actual Outcome
          </p>
        </div>

        {/* Epistemic State Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6F7885]" />
            <span className="text-[#9BA4B0]">OBSERVED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6F8FBE]" />
            <span className="text-[#6F8FBE] font-bold">CURRENT (NOW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-[#718CB8] bg-transparent" />
            <span className="text-[#718CB8]">FORECAST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#668B73]" />
            <span className="text-[#668B73] font-bold">ACTUAL</span>
          </div>
        </div>
      </div>

      {/* Horizontal Continuous Visual Trajectory Container */}
      <div className="overflow-x-auto overflow-y-hidden py-1 scrollbar-thin">
        <div className="flex items-center gap-2.5 min-w-[760px] px-0.5">
          {trajectory.map((node, idx) => {
            // Determine epistemic state dynamically based on current replay index & node status
            let isCurrent = node.isCurrent || node.status === "CURRENT" || (idx === CURRENT_FREEZE_INDEX && currentTickIndex === CURRENT_FREEZE_INDEX);
            let isObserved = node.status === "OBSERVED" || (idx < CURRENT_FREEZE_INDEX && currentTickIndex >= idx);
            let isActual = node.status === "ACTUAL" || (idx > CURRENT_FREEZE_INDEX && idx <= currentTickIndex);
            let isForecast = !isCurrent && !isActual && (node.status === "FORECAST" || node.semanticState === "forecast" || idx > currentTickIndex);

            // Replay tick rule (Section 13): At T-90s (tick 0), future steps relative to T-90s are NOT shown as OBSERVED
            if (currentTickIndex < idx) {
              isObserved = false;
              if (idx === currentTickIndex) {
                isCurrent = true;
              } else {
                isCurrent = false;
                isForecast = true;
              }
            } else if (currentTickIndex === idx) {
              isCurrent = true;
              isObserved = false;
              isForecast = false;
              isActual = false;
            } else if (currentTickIndex > idx) {
              if (idx <= CURRENT_FREEZE_INDEX) {
                isObserved = true;
                isCurrent = false;
              } else {
                isActual = true;
                isForecast = false;
                isCurrent = false;
              }
            }

            const isSelected = selectedNode?.id === node.id;

            // Compute clean temporal time label without T-- bugs
            const rawTime = node.estimatedTime || node.timestamp;
            const cleanTimeLabel = isCurrent
              ? "NOW"
              : formatRelativeTimestamp(rawTime, idx, CURRENT_FREEZE_INDEX);

            return (
              <React.Fragment key={node.id || idx}>
                {/* Trajectory Node Card */}
                <div
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  className={`flex-1 min-w-[155px] max-w-[210px] cursor-pointer transition-all duration-200 rounded-lg p-3.5 flex flex-col justify-between h-34 ${
                    isCurrent
                      ? "bg-[#1D242D] border-2 border-[#6F8FBE] shadow-md"
                      : isActual
                      ? "bg-[#19241E] border-2 border-[#668B73] shadow-sm"
                      : isForecast
                      ? "bg-[#151A21] border-2 border-dashed border-[#718CB8]/60 hover:border-[#6F8FBE]"
                      : "bg-[#191F27] border border-[#2A323C] hover:border-[#6F8FBE]/40"
                  } ${isSelected ? "ring-2 ring-[#6F8FBE]" : ""}`}
                >
                  {/* 1. Stage */}
                  <div className="text-[9px] font-mono text-[#6F7885] font-bold uppercase tracking-wider truncate">
                    {node.stage}
                  </div>

                  {/* 2. Technique / Behaviour Title */}
                  <div
                    className={`text-xs font-mono font-bold leading-snug my-1 line-clamp-2 ${
                      isCurrent
                        ? "text-[#6F8FBE]"
                        : isActual
                        ? "text-[#668B73]"
                        : isForecast
                        ? "text-[#718CB8]"
                        : "text-[#E7EAF0]"
                    }`}
                  >
                    {node.techniqueName}
                  </div>

                  {/* 3. State Badge & Clean Temporal Time */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#2A323C] font-mono text-[10px]">
                    <StatusBadge
                      status={isCurrent ? "CURRENT" : isActual ? "ACTUAL" : isForecast ? "FORECAST" : "OBSERVED"}
                      size="sm"
                    />
                    <span
                      className={`font-bold ${
                        isCurrent
                          ? "text-[#6F8FBE]"
                          : isActual
                          ? "text-[#668B73]"
                          : isForecast
                          ? "text-[#718CB8]"
                          : "text-[#9BA4B0]"
                      }`}
                    >
                      {cleanTimeLabel}
                    </span>
                  </div>
                </div>

                {/* Continuous Visual Trajectory Connector Arrow */}
                {idx < trajectory.length - 1 && (
                  <div className="flex items-center justify-center text-[#6F7885] flex-shrink-0 px-0.5 select-none">
                    {isCurrent ? (
                      <span className="font-mono text-xs font-bold text-[#6F8FBE]">━━━━▶</span>
                    ) : isActual ? (
                      <span className="font-mono text-xs font-bold text-[#668B73]">━━━━▶</span>
                    ) : isObserved ? (
                      <span className="font-mono text-xs text-[#2A323C]">────▶</span>
                    ) : (
                      <span className="font-mono text-xs text-[#718CB8]">┈ ┈ ┈▶</span>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-3 bg-[#191F27] rounded-lg border border-[#2A323C] text-xs font-mono flex items-center justify-between">
          <div>
            <span className="font-bold text-[#E7EAF0]">
              [{selectedNode.techniqueId || "T1000"}] {selectedNode.stage}:
            </span>{" "}
            <span className="text-[#9BA4B0]">{selectedNode.details}</span>
            {selectedNode.targetHost && (
              <span className="text-[#6F7885] text-[10px] ml-2">
                Target: {selectedNode.targetHost}
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-[10px] text-[#9BA4B0] hover:text-[#E7EAF0] underline ml-2 flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}


