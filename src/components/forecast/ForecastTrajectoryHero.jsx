"use client";

import React, { useState } from "react";

export default function ForecastTrajectoryHero({ trajectory, selectedHorizon }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!trajectory || trajectory.length === 0) return null;

  return (
    <div className="bg-[#FFFDF8] dark:bg-slate-900 border border-[#E5E1D8] dark:border-slate-800 rounded-xl p-5 shadow-subtle mb-6 flex flex-col justify-between font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E1D8] dark:border-slate-800 mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-[#17191C] dark:text-slate-100 uppercase tracking-wider">
            ATTACK TRAJECTORY
          </h2>
          <p className="text-[11px] text-[#5F6268] dark:text-slate-500 mt-0.5">
            Observed Past → Current State → Forecast Horizons
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5F6268] dark:bg-slate-300" />
            <span className="text-[#5F6268] dark:text-slate-300 font-medium">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#314B78] ring-2 ring-[#314B78]/30" />
            <span className="text-[#314B78] dark:text-slate-100 font-bold">CURRENT (NOW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-dashed border-[#657A9C] bg-[#F7F5EE] dark:bg-indigo-950/60" />
            <span className="text-[#657A9C] font-medium">Forecast</span>
          </div>
        </div>
      </div>

      {/* Trajectory Horizontal Flow */}
      <div className="overflow-x-auto overflow-y-hidden py-2 scrollbar-thin">
        <div className="flex items-center gap-3 min-w-[760px] px-1">
          {trajectory.map((node, idx) => {
            const isObserved = node.status === "OBSERVED";
            const isForecast = node.status === "FORECAST";
            const isActual = node.status === "ACTUAL";
            const isCurrent = node.isCurrent || node.status === "CURRENT";
            const isSelected = activeNode?.id === node.id;
            const normHorizon = selectedHorizon?.replace("+", "").replace("s", "");
            const isHighlightedHorizon = isForecast && node.estimatedTime?.includes(normHorizon);

            const timeLabel = isCurrent
              ? "NOW"
              : isActual
              ? node.timestamp || `+${(idx - 2) * 30}s`
              : isForecast
              ? node.estimatedTime || "+30s"
              : node.timestamp || `T-${(2 - idx) * 30}s`;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setActiveNode(isSelected ? null : node)}
                  className={`flex-1 min-w-[160px] max-w-[210px] cursor-pointer transition-all duration-200 rounded-lg p-3.5 flex flex-col justify-between h-36 ${
                    isCurrent
                      ? "bg-[#F7F5EE] dark:bg-slate-800 border-2 border-[#314B78] shadow-subtle ring-2 ring-[#314B78]/20 scale-[1.02]"
                      : isActual
                      ? "bg-[#F4F7F5] dark:bg-emerald-950/50 border-2 border-[#557A62] shadow-subtle"
                      : isHighlightedHorizon
                      ? "bg-[#F7F5EE] dark:bg-indigo-950/80 border-2 border-dashed border-[#314B78] shadow-subtle ring-2 ring-[#314B78]/20 scale-[1.02]"
                      : isForecast
                      ? "bg-[#FBFAF6] dark:bg-slate-900/40 border-2 border-dashed border-[#D6D1C5] dark:border-indigo-700/60 hover:border-[#657A9C]"
                      : "bg-[#F7F5EE] dark:bg-slate-800/80 border border-[#E5E1D8] dark:border-slate-700 hover:border-[#D6D1C5]"
                  } ${isSelected ? "ring-2 ring-[#17191C] dark:ring-slate-200" : ""}`}
                >
                  {/* Stage Label */}
                  <div className="text-[10px] text-[#8B8D91] dark:text-slate-500 font-semibold uppercase tracking-wider truncate">
                    {node.stage}
                  </div>

                  {/* Behaviour Name */}
                  <div
                    className={`text-xs font-bold leading-snug my-1 line-clamp-2 ${
                      isCurrent
                        ? "text-[#314B78] dark:text-slate-100 font-extrabold"
                        : isActual
                        ? "text-[#557A62] dark:text-emerald-200 font-extrabold"
                        : isForecast
                        ? "text-[#314B78] font-bold"
                        : "text-[#17191C] dark:text-slate-200 font-semibold"
                    }`}
                  >
                    {node.techniqueName}
                  </div>

                  {/* Time & State */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E1D8] dark:border-slate-700/60 text-[10px]">
                    <span
                      className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? "bg-[#314B78] text-white"
                          : isActual
                          ? "bg-[#557A62] text-white"
                          : isForecast
                          ? "bg-[#EFECE4] text-[#314B78]"
                          : "bg-[#E5E1D8] text-[#17191C]"
                      }`}
                    >
                      {isCurrent ? "CURRENT" : isActual ? "ACTUAL" : isForecast ? "FORECAST" : "OBSERVED"}
                    </span>

                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? "text-[#314B78] font-bold"
                          : isActual
                          ? "text-[#557A62] font-bold"
                          : isForecast
                          ? "text-[#657A9C] font-semibold"
                          : "text-[#8B8D91]"
                      }`}
                    >
                      {timeLabel}
                    </span>
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < trajectory.length - 1 && (
                  <div className="flex items-center justify-center flex-shrink-0 px-0.5 text-xs">
                    {isCurrent ? (
                      <span className="font-bold text-[#314B78]">━━━━▶</span>
                    ) : isActual ? (
                      <span className="font-bold text-[#557A62]">━━━━▶</span>
                    ) : isObserved && trajectory[idx + 1]?.status === "OBSERVED" ? (
                      <span className="text-[#D6D1C5]">────▶</span>
                    ) : (
                      <span className="text-[#657A9C]">┈ ┈ ┈▶</span>
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
        <div className="mt-3 p-3 bg-[#F7F5EE] dark:bg-slate-800 rounded-lg border border-[#E5E1D8] dark:border-slate-700 text-xs flex items-center justify-between font-mono animate-fadeIn">
          <div>
            <span className="font-bold text-[#17191C] dark:text-slate-100">
              [{activeNode.techniqueId}] {activeNode.techniqueName} ({activeNode.estimatedTime || activeNode.status}):
            </span>{" "}
            <span className="text-[#5F6268] dark:text-slate-300">{activeNode.details}</span>{" "}
            <span className="text-[#8B8D91] dark:text-slate-500 text-[10px]">
              • Target: {activeNode.targetHost}
            </span>
          </div>
          <button
            onClick={() => setActiveNode(null)}
            className="text-[10px] text-[#8B8D91] hover:text-[#17191C] underline ml-3 flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}


