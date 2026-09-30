"use client";

import React from "react";
import StatusBadge from "../StatusBadge";

export default function ForecastHeader({
  activeScenario,
  selectedHorizon,
  onSelectHorizon,
}) {
  const horizons = ["30s", "60s", "90s"];

  return (
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
      {/* Left: Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-sm font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider">
            ATTACK FORECAST DEEP-DIVE
          </h1>
          <StatusBadge status="FORECAST" size="sm" customLabel="DEMONSTRATION SCENARIO" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Current State: <strong className="text-navy-800 dark:text-slate-100">{activeScenario.currentState || "Privilege Access"}</strong> (NOW)
        </p>
      </div>

      {/* Right: Horizon Control */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-2 uppercase">
          Forecast Horizon:
        </span>
        {horizons.map((h) => {
          const isSelected = selectedHorizon === h;
          return (
            <button
              key={h}
              onClick={() => onSelectHorizon(h)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-navy-800 dark:bg-slate-700 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-navy-800 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              +{h}
            </button>
          );
        })}
      </div>
    </div>
  );
}

