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
    <div className="bg-[#FFFDF8] dark:bg-slate-900 border border-[#E5E1D8] dark:border-slate-800 rounded-xl p-4 shadow-subtle mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
      {/* Left: Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xs font-bold text-[#17191C] dark:text-slate-100 uppercase tracking-wider">
            ATTACK FORECAST DEEP-DIVE
          </h1>
          <StatusBadge status="FORECAST" size="sm" customLabel="MODEL PREDICTION" />
        </div>
        <p className="text-[11px] text-[#5F6268] dark:text-slate-400">
          Current State: <strong className="text-[#17191C] dark:text-slate-100">{activeScenario.currentState || "Privilege Access"}</strong> (NOW)
        </p>
      </div>

      {/* Right: Horizon Control */}
      <div className="flex items-center gap-1.5 bg-[#F7F5EE] dark:bg-slate-800/80 border border-[#E5E1D8] dark:border-slate-700 rounded-lg p-1 text-xs">
        <span className="text-[10px] text-[#8B8D91] dark:text-slate-500 font-semibold px-2 uppercase tracking-wide">
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
                  ? "bg-[#314B78] text-white shadow-subtle"
                  : "text-[#5F6268] dark:text-slate-300 hover:text-[#17191C] dark:hover:text-slate-100 hover:bg-[#EFECE4] dark:hover:bg-slate-700/60"
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


