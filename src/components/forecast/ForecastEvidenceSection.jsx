"use client";

import React from "react";
import { Sliders, Clock, Network, Server, ArrowRight } from "lucide-react";
import StatusBadge from "../StatusBadge";

export default function ForecastEvidenceSection({
  featureSignals,
  temporalEvidence,
  topologyEvidence,
}) {
  return (
    <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
            WHY THIS FORECAST? — NETWORK EVIDENCE
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Network signals, temporal patterns, and topology edge evidence
          </p>
        </div>
        <StatusBadge status="OBSERVED" size="sm" customLabel="DEMO EVIDENCE" />
      </div>

      {/* 3 Evidence Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* A. FEATURE SIGNALS */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 font-mono text-xs font-bold text-navy-800">
              <Sliders className="w-4 h-4 text-accent" />
              <span>A. FEATURE SIGNALS</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {featureSignals?.map((item) => (
                <div key={item.feature} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700 font-semibold truncate pr-2">{item.feature}</span>
                    <span className="font-bold text-navy-800">{item.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-navy-800 h-full rounded-full"
                      style={{ width: `${item.weight * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 text-[10px] font-mono text-slate-400">
            Weighted network flow features
          </div>
        </div>

        {/* B. TEMPORAL EVIDENCE */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 font-mono text-xs font-bold text-navy-800">
              <Clock className="w-4 h-4 text-accent" />
              <span>B. TEMPORAL FORENSIC TIMELINE</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs relative pl-3 border-l-2 border-slate-300">
              {temporalEvidence?.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="w-2 h-2 rounded-full bg-navy-800 absolute -left-[17px] top-1" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold text-accent">{item.time}:</span>
                    <span className="text-[11px] text-slate-700 font-medium">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 text-[10px] font-mono text-slate-400">
            Sequential telemetry timeline
          </div>
        </div>

        {/* C. TOPOLOGY EVIDENCE */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 font-mono text-xs font-bold text-navy-800">
              <Network className="w-4 h-4 text-accent" />
              <span>C. TOPOLOGY EDGE EVIDENCE</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-navy-800" />
                  <div>
                    <div className="font-bold text-navy-800 text-[11px]">WORKSTATION-302</div>
                    <div className="text-[9px] text-slate-400">10.0.2.45 (Infected)</div>
                  </div>
                </div>
                <span className="text-[9px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded font-bold">
                  SUSPICIOUS
                </span>
              </div>

              <div className="flex items-center justify-center py-1">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-forecast-light border border-dashed border-forecast-border rounded text-[10px] font-bold text-forecast">
                  <span>{topologyEvidence?.edgeLabel || "NEW PROJECTED EDGE"}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-forecast" />
                  <div>
                    <div className="font-bold text-navy-800 text-[11px]">FIN-SRV-01</div>
                    <div className="text-[9px] text-slate-400">10.0.4.12 (Target)</div>
                  </div>
                </div>
                <span className="text-[9px] bg-forecast-light text-forecast border border-forecast-border px-1.5 py-0.5 rounded font-bold">
                  PROJECTED
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 text-[10px] font-mono text-slate-400">
            Unusual east-west communication path
          </div>
        </div>
      </div>
    </div>
  );
}
