"use client";

import React, { useState } from "react";
import { Sliders, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function WhatIfSimulator({ simulations }) {
  const [selectedAction, setSelectedAction] = useState(
    simulations?.find((s) => s.recommended)?.id || simulations?.[0]?.id
  );

  if (!simulations || simulations.length === 0) return null;

  const currentSim = simulations.find((s) => s.id === selectedAction) || simulations[0];

  return (
    <div className="bg-[#151A21] border border-[#2A323D] rounded-xl p-5 shadow-card mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A323D] mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#7898C7]" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#737D89] font-semibold tracking-wider block">
              DEFENDER INTERVENTION SIMULATION
            </span>
            <h3 className="text-xs font-bold text-[#E7EBF0] uppercase tracking-wider font-mono">
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
          <div className="text-[10px] font-mono uppercase text-[#737D89] font-semibold mb-1">
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
                    ? "bg-[#1D232C] text-[#E7EBF0] border-[#7898C7] shadow-sm"
                    : "bg-[#10141A] text-[#A7B0BC] border-[#2A323D] hover:border-[#35404D] hover:bg-[#191F27]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold truncate">{sim.action}</span>
                  {sim.recommended && (
                    <span className="text-[9px] bg-[#7898C7] text-[#0B0E12] px-1.5 py-0.5 rounded font-bold">
                      BEST CHOICE
                    </span>
                  )}
                </div>
                <div className={`text-[10px] ${isSelected ? "text-[#7898C7]" : "text-[#737D89]"}`}>
                  Impact: {sim.riskReduction}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Intervention Analysis */}
        <div className="md:col-span-2 bg-[#10141A] border border-[#2A323D] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A323D] pb-2 mb-3">
              <div className="font-mono text-xs font-bold text-[#E7EBF0] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#B58A43]" />
                <span>{currentSim.action}</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#6D9278] bg-[#19261E] px-2 py-0.5 rounded border border-[#354D3D]">
                {currentSim.riskReduction}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[#737D89] text-[10px] uppercase block mb-0.5">Description</span>
                <p className="text-[#A7B0BC] text-xs">{currentSim.description}</p>
              </div>

              <div>
                <span className="text-[#737D89] text-[10px] uppercase block mb-0.5">Projected Outcome</span>
                <div className="p-2.5 bg-[#1D232C] border border-[#2A323D] rounded text-[#E7EBF0] font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7898C7] flex-shrink-0" />
                  <span>{currentSim.projectedOutcome}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#2A323D] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#737D89]">
              Evaluated on Temporal Graph Topology
            </span>
            <button className="px-3 py-1.5 bg-[#1D232C] text-[#E7EBF0] rounded text-xs font-mono font-semibold hover:bg-[#252D38] transition-colors flex items-center gap-1.5 border border-[#35404D]">
              <span>Execute Intervention</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

