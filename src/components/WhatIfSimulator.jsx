"use client";

import React, { useState } from "react";
import { Sliders, ShieldCheck, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function WhatIfSimulator({ simulations }) {
  const [selectedAction, setSelectedAction] = useState(
    simulations?.find((s) => s.recommended)?.id || simulations?.[0]?.id
  );

  if (!simulations || simulations.length === 0) return null;

  const currentSim = simulations.find((s) => s.id === selectedAction) || simulations[0];

  return (
    <div className="bg-surface border border-slate-200 rounded-xl p-5 shadow-card mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-accent" />
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider block">
              DEFENDER INTERVENTION SIMULATION
            </span>
            <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
              WHAT-IF DEFENSE VECTOR EVALUATOR
            </h3>
          </div>
        </div>
        <StatusBadge status="FORECAST" size="sm" customLabel="SIMULATION MODE" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action Selection List */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
            Available Interventions
          </div>
          {simulations.map((sim) => {
            const isSelected = sim.id === currentSim.id;
            return (
              <button
                key={sim.id}
                onClick={() => setSelectedAction(sim.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex flex-col gap-1 ${
                  isSelected
                    ? "bg-navy-800 text-white border-navy-800 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold truncate">{sim.action}</span>
                  {sim.recommended && (
                    <span className="text-[9px] bg-accent text-white px-1.5 py-0.5 rounded font-bold">
                      BEST CHOICE
                    </span>
                  )}
                </div>
                <div className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  Impact: {sim.riskReduction}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Intervention Analysis */}
        <div className="md:col-span-2 bg-slate-50/80 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="font-mono text-xs font-bold text-navy-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                <span>{currentSim.action}</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {currentSim.riskReduction}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Description</span>
                <p className="text-slate-700 text-xs">{currentSim.description}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Projected Outcome</span>
                <div className="p-2.5 bg-white border border-slate-200 rounded text-navy-800 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{currentSim.projectedOutcome}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-400">
              Evaluated on Temporal Graph Topology
            </span>
            <button className="px-3 py-1.5 bg-navy-800 text-white rounded text-xs font-mono font-semibold hover:bg-navy-700 transition-colors flex items-center gap-1.5">
              <span>Execute Intervention</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
