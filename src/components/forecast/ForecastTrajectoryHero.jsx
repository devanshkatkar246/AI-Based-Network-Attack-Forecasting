"use client";

import React, { useState } from "react";

export default function ForecastTrajectoryHero({ trajectory, selectedHorizon }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!trajectory || trajectory.length === 0) return null;

  return (
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm mb-6 flex flex-col justify-between font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider">
            ATTACK TRAJECTORY
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Observed Past → Current State → Forecast Horizons
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-700 dark:bg-slate-300" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent ring-2 ring-accent/30" />
            <span className="text-navy-800 dark:text-slate-100 font-bold">CURRENT (NOW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-dashed border-forecast bg-indigo-50 dark:bg-indigo-950/60" />
            <span className="text-forecast font-medium">Forecast</span>
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
                      ? "bg-blue-50/90 dark:bg-blue-950/60 border-2 border-accent shadow-sm ring-2 ring-accent/20 scale-[1.02]"
                      : isActual
                      ? "bg-emerald-50/80 dark:bg-emerald-950/50 border-2 border-emerald-500 shadow-sm"
                      : isHighlightedHorizon
                      ? "bg-indigo-50/90 dark:bg-indigo-950/80 border-2 border-dashed border-forecast shadow-sm ring-2 ring-forecast/20 scale-[1.02]"
                      : isForecast
                      ? "bg-forecast-light/40 dark:bg-indigo-950/40 border-2 border-dashed border-forecast-border dark:border-indigo-700/60 hover:border-forecast"
                      : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  } ${isSelected ? "ring-2 ring-navy-800 dark:ring-slate-200" : ""}`}
                >
                  {/* Stage Label */}
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider truncate">
                    {node.stage}
                  </div>

                  {/* Behaviour Name */}
                  <div
                    className={`text-xs font-bold leading-snug my-1 line-clamp-2 ${
                      isCurrent
                        ? "text-navy-800 dark:text-slate-100 font-extrabold"
                        : isActual
                        ? "text-emerald-950 dark:text-emerald-200 font-extrabold"
                        : isForecast
                        ? "text-forecast font-bold"
                        : "text-slate-800 dark:text-slate-200 font-semibold"
                    }`}
                  >
                    {node.techniqueName}
                  </div>

                  {/* Time & State */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/60 text-[10px]">
                    <span
                      className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? "bg-accent text-white"
                          : isActual
                          ? "bg-emerald-600 text-white"
                          : isForecast
                          ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {isCurrent ? "CURRENT" : isActual ? "ACTUAL" : isForecast ? "FORECAST" : "OBSERVED"}
                    </span>

                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? "text-navy-800 dark:text-slate-100 font-bold"
                          : isActual
                          ? "text-emerald-700 dark:text-emerald-400 font-bold"
                          : isForecast
                          ? "text-forecast font-semibold"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {timeLabel}
                    </span>
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < trajectory.length - 1 && (
                  <div className="flex items-center justify-center text-slate-300 dark:text-slate-700 flex-shrink-0 px-0.5 text-xs">
                    {isCurrent ? (
                      <span className="font-bold text-accent">━━━━▶</span>
                    ) : isActual ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">━━━━▶</span>
                    ) : isObserved && trajectory[idx + 1]?.status === "OBSERVED" ? (
                      <span className="text-slate-300 dark:text-slate-600">────▶</span>
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
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between font-mono animate-fadeIn">
          <div>
            <span className="font-bold text-navy-800 dark:text-slate-100">
              [{activeNode.techniqueId}] {activeNode.techniqueName} ({activeNode.estimatedTime || activeNode.status}):
            </span>{" "}
            <span className="text-slate-600 dark:text-slate-300">{activeNode.details}</span>{" "}
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              • Target: {activeNode.targetHost}
            </span>
          </div>
          <button
            onClick={() => setActiveNode(null)}
            className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-navy-800 dark:hover:text-slate-200 underline ml-3 flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

