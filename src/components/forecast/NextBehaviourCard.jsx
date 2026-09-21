"use client";

import React from "react";
import { Target, Timer, ArrowRight, ShieldAlert, Activity } from "lucide-react";
import StatusBadge from "../StatusBadge";

export default function NextBehaviourCard({
  nextLikelyBehaviour,
  horizonData,
  warningWindow,
}) {
  if (!nextLikelyBehaviour) return null;

  return (
    <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* 1. WHAT - Next Likely Behaviour Prominent Card */}
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-forecast" />
            <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
              NEXT LIKELY BEHAVIOUR
            </h2>
          </div>
          <StatusBadge status="FORECAST" size="sm" customLabel="PROJECTED" />
        </div>

        <div className="p-3.5 bg-forecast-light/60 border border-forecast-border rounded-lg mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                Projected Attack Vector
              </div>
              <div className="text-base font-bold text-navy-800 font-mono mt-0.5">
                {nextLikelyBehaviour.behaviour}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono font-bold text-forecast">
                {nextLikelyBehaviour.probability}%
              </div>
              <div className="text-[10px] font-mono text-slate-500 font-semibold">
                {nextLikelyBehaviour.timeHorizon}
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-forecast-border/60 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-500 text-[11px] flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-critical" /> Target Asset:
            </span>
            <span className="font-bold text-navy-800">{nextLikelyBehaviour.targetAsset}</span>
          </div>
        </div>

        {/* 2. FORECAST HORIZON BARS */}
        <div className="space-y-2 mb-4">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
            FORECAST HORIZON INTENSITY
          </div>
          {horizonData?.map((item) => (
            <div key={item.horizon} className="space-y-1">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-semibold text-navy-800 w-12">{item.horizon}</span>
                <span className="text-slate-500 font-mono text-[10px]">{item.label}</span>
                <span className="font-bold text-forecast w-10 text-right">{item.probability}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-forecast h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WHEN - Actionable Timing Bar */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-semibold mb-2">
          <span>Actionable Warning Window</span>
          <span className="text-warning font-bold">~{warningWindow?.durationSec || 75}s</span>
        </div>

        {/* Horizontal Timing Visual */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between font-mono text-[11px]">
          <div className="flex flex-col items-center">
            <span className="font-bold text-navy-800">NOW</span>
            <span className="text-[9px] text-slate-400">Current</span>
          </div>

          <div className="flex-1 flex flex-col items-center px-2">
            <span className="text-[9px] font-bold text-warning uppercase">Warning Window (60–90s)</span>
            <div className="w-full h-1 bg-warning/40 rounded my-0.5 relative">
              <div className="absolute inset-0 bg-warning animate-pulse-subtle rounded" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-bold text-forecast">Lateral Move</span>
            <span className="text-[9px] text-slate-400">+60s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
