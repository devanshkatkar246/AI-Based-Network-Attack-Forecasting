"use client";

import React from "react";
import StatusBadge from "../StatusBadge";
import ScenarioSelector from "../ScenarioSelector";
import { SlidersHorizontal, Info } from "lucide-react";

export default function ForecastHeader({
  activeScenario,
  onSelectScenario,
  selectedHorizon,
  onSelectHorizon,
}) {
  const horizons = ["30s", "60s", "90s", "120s"];

  return (
    <div className="bg-surface border border-slate-200/90 rounded-xl p-4 shadow-subtle mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-sm font-bold text-navy-800 uppercase tracking-wider font-mono">
            ATTACK FORECAST DEEP-DIVE
          </h1>
          <StatusBadge status="FORECAST" size="sm" customLabel="DEMONSTRATION SCENARIO" />
        </div>
        <p className="text-xs font-mono text-slate-500">
          Projected evolution of the current network state • Current State:{" "}
          <span className="font-bold text-navy-800">{activeScenario.currentState || "Privilege Access"}</span>
        </p>
      </div>

      {/* Right: Controls (Horizon Selector & Scenario Switcher) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Horizon Control */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-mono">
          <span className="text-[10px] text-slate-400 font-semibold px-2 uppercase">
            Horizon:
          </span>
          {horizons.map((h) => {
            const isSelected = selectedHorizon === h;
            return (
              <button
                key={h}
                onClick={() => onSelectHorizon(h)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  isSelected
                    ? "bg-navy-800 text-white shadow-subtle"
                    : "text-slate-600 hover:text-navy-800 hover:bg-slate-200/60"
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>

        {/* Scenario Switcher */}
        <ScenarioSelector
          activeScenarioId={activeScenario.id}
          onSelectScenario={onSelectScenario}
        />
      </div>
    </div>
  );
}
