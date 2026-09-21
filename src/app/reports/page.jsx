"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { FileText, Download, ShieldCheck, Target, Timer, Sliders, Activity } from "lucide-react";

export default function ReportsPage() {
  return (
    <AppShell title="Threat Report Summary">
      {({ activeScenario }) => (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Executive Header Banner */}
          <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 font-mono text-xs font-bold text-navy-800 uppercase">
                <FileText className="w-4 h-4 text-accent" />
                <span>EXECUTIVE THREAT INTELLIGENCE SUMMARY</span>
                <StatusBadge status={activeScenario.riskLevel} size="sm" />
              </div>
              <h2 className="text-base font-bold text-navy-800 font-mono">
                {activeScenario.title}
              </h2>
              <div className="font-mono text-xs text-slate-500 mt-1">
                Scenario ID: <span className="font-bold text-navy-800">{activeScenario.id}</span> • Timestamp: {activeScenario.timestamp}
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-accent" />
              <span>Export Report (PDF)</span>
            </button>
          </div>

          {/* 4 Key Summary Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-surface border border-slate-200/90 rounded-xl p-4 shadow-subtle">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Current State</div>
              <div className="text-sm font-bold text-navy-800">{activeScenario.currentState}</div>
              <div className="text-[10px] text-slate-500 mt-1">Observed Stage 3</div>
            </div>

            <div className="bg-surface border border-slate-200/90 rounded-xl p-4 shadow-subtle">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Next Behaviour</div>
              <div className="text-sm font-bold text-forecast">{activeScenario.nextLikelyBehaviour.behaviour}</div>
              <div className="text-[10px] text-forecast font-bold mt-1">
                {activeScenario.nextLikelyBehaviour.probability}% Probability ({activeScenario.nextLikelyBehaviour.timeHorizon})
              </div>
            </div>

            <div className="bg-surface border border-slate-200/90 rounded-xl p-4 shadow-subtle">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Warning Window</div>
              <div className="text-sm font-bold text-warning">~{activeScenario.warningWindow.durationSec} sec</div>
              <div className="text-[10px] text-slate-500 mt-1">Intervention Horizon</div>
            </div>

            <div className="bg-surface border border-slate-200/90 rounded-xl p-4 shadow-subtle">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Target Asset</div>
              <div className="text-sm font-bold text-navy-800 truncate">{activeScenario.nextLikelyBehaviour.targetAsset}</div>
              <div className="text-[10px] text-critical font-bold mt-1">High Risk Target</div>
            </div>
          </div>

          {/* Report Body Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Evidence Summary */}
            <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card space-y-3 font-mono text-xs">
              <div className="font-bold text-navy-800 uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>PRIMARY NETWORK EVIDENCE</span>
                <StatusBadge status="OBSERVED" size="sm" />
              </div>

              <div className="space-y-2">
                {activeScenario.temporalEvidence?.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
                    <span className="font-bold text-accent">{item.time}:</span>
                    <span className="text-slate-700 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modelled Intervention Summary */}
            <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card space-y-3 font-mono text-xs">
              <div className="font-bold text-navy-800 uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>MODELLED DEFENDER INTERVENTION</span>
                <StatusBadge status="FORECAST" size="sm" customLabel="SIMULATION" />
              </div>

              <div className="p-3 bg-navy-800 text-white rounded-lg space-y-2">
                <div className="text-[10px] text-accent uppercase font-bold">Intervention Action</div>
                <div className="text-sm font-bold">{activeScenario.whatIfSimulations[0]?.action}</div>
                <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-700">
                  {activeScenario.whatIfSimulations[0]?.projectedOutcome}
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 flex justify-between items-center font-bold">
                <span>Modelled Trajectory Divergence:</span>
                <span>88% Risk Truncation</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-center font-mono text-xs text-slate-500">
            Temporal Network World Model • SIH 2026 Problem Statement 26153 • Executive Summary
          </div>
        </div>
      )}
    </AppShell>
  );
}
