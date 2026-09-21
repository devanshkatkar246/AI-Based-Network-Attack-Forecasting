"use client";

import React from "react";
import { ArrowRight, ShieldCheck, FileCode2 } from "lucide-react";
import StatusBadge from "../StatusBadge";

export default function AttackInterpretationFlow({ attackInterpretation }) {
  if (!attackInterpretation || attackInterpretation.length === 0) return null;

  return (
    <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
            MITRE ATT&CK BEHAVIOURAL INTERPRETATION
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Observed telemetry → Possible ATT&CK Technique → Tactic classification
          </p>
        </div>
        <StatusBadge status="OBSERVED" size="sm" customLabel="POSSIBLE INTERPRETATION" />
      </div>

      {/* Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {attackInterpretation.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-50/80 border border-slate-200 rounded-lg flex flex-col justify-between font-mono text-xs space-y-3"
          >
            {/* Step 1: Observed Behaviour */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                1. Observed Behaviour
              </div>
              <div className="p-2 bg-white border border-slate-200 rounded font-semibold text-navy-800">
                {item.observed}
              </div>
            </div>

            <div className="flex items-center justify-center text-slate-400 font-bold text-xs">
              ↓
            </div>

            {/* Step 2: Possible Technique */}
            <div>
              <div className="text-[10px] uppercase font-bold text-forecast mb-1 flex items-center justify-between">
                <span>2. Possible Technique</span>
                <span className="text-[9px] bg-forecast-light px-1.5 py-0.5 rounded border border-forecast-border">INFERRED</span>
              </div>
              <div className="p-2 bg-forecast-light/40 border border-dashed border-forecast-border rounded font-bold text-forecast">
                {item.technique}
              </div>
            </div>

            <div className="flex items-center justify-center text-slate-400 font-bold text-xs">
              ↓
            </div>

            {/* Step 3: Tactic */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                3. Tactic Classification
              </div>
              <div className="p-2 bg-navy-800 text-white rounded font-bold flex items-center justify-between">
                <span>{item.tactic}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>ATT&CK mapping represents probabilistic interpretation, not strict linear kill-chain constraint.</span>
        <span className="text-navy-800 font-bold">SIH 26153 MVP</span>
      </div>
    </div>
  );
}
