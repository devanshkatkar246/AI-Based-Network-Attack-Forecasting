"use client";

import React, { useState, useEffect } from "react";
import { Timer, ArrowRight, ShieldAlert, Target } from "lucide-react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function WarningWindowCard({ warningWindow }) {
  if (!warningWindow) return null;

  const [timeLeft, setTimeLeft] = useState(warningWindow.timeRemainingSec || 52);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : warningWindow.durationSec));
    }, 1000);
    return () => clearInterval(timer);
  }, [warningWindow]);

  return (
    <div className="bg-surface border-2 border-warning/50 rounded-xl p-5 shadow-card h-full flex flex-col justify-between relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-warning" />
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-navy-800">
            WARNING WINDOW
          </h2>
        </div>
        <StatusBadge status="WARNING WINDOW" size="sm" customLabel="60–90s Horizon" />
      </div>

      {/* Prominent Primary Visual: Time Horizon */}
      <div className="my-3 py-3 px-4 bg-warning-light/60 border border-warning-border rounded-lg flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-warning font-bold uppercase tracking-wider">
            Intervention Window
          </div>
          <div className="text-3xl font-mono font-bold text-navy-800 tracking-tight mt-0.5 flex items-baseline gap-1.5">
            <span>{timeLeft}</span>
            <span className="text-sm font-normal text-slate-500 font-sans">sec</span>
          </div>
        </div>

        {/* Compact Probability Bar */}
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Trajectory Risk
          </div>
          <div className="text-lg font-mono font-bold text-critical">
            81%
          </div>
        </div>
      </div>

      {/* Key Operational Details */}
      <div className="space-y-2.5 font-mono text-xs my-1">
        {/* Next Likely Behaviour */}
        <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
          <div className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">
            Next Likely Behaviour
          </div>
          <div className="font-bold text-navy-800 flex items-center justify-between">
            <span>Lateral Movement</span>
            <span className="text-forecast text-[11px] font-semibold">+30s Projected</span>
          </div>
        </div>

        {/* Target Asset */}
        <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
          <div className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">
            Target Asset at Risk
          </div>
          <div className="font-bold text-navy-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-critical" />
              {warningWindow.targetAsset}
            </span>
            <span className="text-[10px] bg-critical-light text-critical px-1.5 py-0.5 rounded font-bold">
              CRITICAL
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Action CTA */}
      <div className="pt-3 border-t border-slate-100">
        <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1.5">
          Recommended Defender Action
        </div>
        <Link
          href="/what-if"
          className="w-full bg-navy-800 hover:bg-navy-700 text-white rounded-lg px-3 py-2.5 text-xs font-mono font-semibold flex items-center justify-between transition-colors group"
        >
          <span className="truncate pr-2">{warningWindow.recommendedAction}</span>
          <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </Link>
      </div>
    </div>
  );
}
