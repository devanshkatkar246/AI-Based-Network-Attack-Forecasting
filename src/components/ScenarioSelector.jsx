"use client";

import React, { useState } from "react";
import { ChevronDown, Layers, ShieldAlert } from "lucide-react";
import { SCENARIOS } from "../data/mockData";
import StatusBadge from "./StatusBadge";

export default function ScenarioSelector({ activeScenarioId, onSelectScenario }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs font-medium text-navy-800 dark:text-slate-100"
      >
        <Layers className="w-3.5 h-3.5 text-accent" />
        <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">Scenario:</span>
        <span className="font-semibold">{activeScenario.id}</span>
        <StatusBadge status={activeScenario.riskLevel} size="sm" />
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-cardHover z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Select Attack Scenario</span>
              <span>{SCENARIOS.length} Available</span>
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {SCENARIOS.map((scen) => {
                const isSelected = scen.id === activeScenario.id;
                return (
                  <button
                    key={scen.id}
                    onClick={() => {
                      onSelectScenario(scen.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col gap-1.5 ${
                      isSelected ? "bg-accent-light/50 dark:bg-indigo-950/40 border-l-2 border-accent" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-navy-800 dark:text-slate-100">{scen.id}</span>
                      <StatusBadge status={scen.riskLevel} size="sm" />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{scen.title}</div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      <span>Window: ~{scen.warningWindowSec}s</span>
                      <span>•</span>
                      <span>State: {scen.telemetry.networkState}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
