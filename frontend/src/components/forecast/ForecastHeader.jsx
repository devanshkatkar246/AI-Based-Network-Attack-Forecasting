"use client";

import React, { useEffect } from "react";
import StatusBadge from "../StatusBadge";

export default function ForecastHeader({
  activeScenario,
  selectedHorizon,
  onSelectHorizon,
}) {
  const dynamicHorizons = activeScenario?.horizonData?.length > 0
    ? activeScenario.horizonData.map((h) => h.horizon.replace("+", ""))
    : ["10s", "20s", "30s"];

  // Ensure selectedHorizon matches one of the available horizons
  useEffect(() => {
    if (dynamicHorizons.length > 0) {
      const cleanSelected = selectedHorizon?.replace("+", "");
      if (!cleanSelected || !dynamicHorizons.includes(cleanSelected)) {
        onSelectHorizon(dynamicHorizons[0]);
      }
    }
  }, [dynamicHorizons, selectedHorizon, onSelectHorizon]);

  const cleanSelected = selectedHorizon?.replace("+", "");

  return (
    <div className="bg-[#151A21] border border-[#2A323D] rounded-xl p-4 shadow-card mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono select-none">
      {/* Left: Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xs font-bold text-[#E7EBF0] uppercase tracking-wider">
            ATTACK FORECAST
          </h1>
          <StatusBadge status="FORECAST" size="sm" customLabel="MODEL PREDICTION" />
        </div>
        <p className="text-[11px] text-[#A7B0BC]">
          Current State: <strong className="text-[#E7EBF0]">{activeScenario?.currentState || "Baseline"}</strong> (NOW)
        </p>
      </div>

      {/* Right: Dynamic Horizon Control */}
      <div className="flex items-center gap-1.5 bg-[#10141A] border border-[#2A323D] rounded-lg p-1 text-xs">
        <span className="text-[10px] text-[#737D89] font-semibold px-2 uppercase tracking-wide">
          Forecast Horizon:
        </span>
        {dynamicHorizons.map((h) => {
          const isSelected = cleanSelected === h;
          return (
            <button
              key={h}
              onClick={() => onSelectHorizon(h)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-[#7898C7] text-[#0B0E12] shadow-subtle font-bold"
                  : "text-[#A7B0BC] hover:text-[#E7EBF0] hover:bg-[#1D232C]"
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
