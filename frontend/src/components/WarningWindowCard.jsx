"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";
import { useReplay } from "@/context/ReplayContext";

export default function WarningWindowCard({ warningWindow }) {
  const { isFrozenAtCurrent, revealFuture } = useReplay();

  const initialLeadTime = warningWindow?.leadTimeSeconds ?? warningWindow?.timeRemainingSec;
  const [timeLeft, setTimeLeft] = useState(initialLeadTime);

  useEffect(() => {
    const val = warningWindow?.leadTimeSeconds ?? warningWindow?.timeRemainingSec;
    if (val !== undefined) {
      setTimeLeft(val);
    }
  }, [warningWindow]);

  const status = warningWindow?.status || "NO_FORECAST";
  const predictedEvent = warningWindow?.predictedBehavior || "Lateral Movement";
  const recommendedAction = warningWindow?.recommendedAction || "Investigate / isolate suspicious host";
  const targetAsset = warningWindow?.targetAsset || "Monitored Subnet";
  const isResolved = warningWindow?.isResolved || status === "RESOLVED" || status === "WARNING_RESOLVED";

  // 1. Resolved State
  if (isResolved) {
    return (
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
        <div className="flex items-center justify-between pb-3 border-b border-[#27303A]">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#9AA6B2]">
            EARLY WARNING
          </h2>
          <span className="font-mono text-[10px] font-bold text-[#659477] bg-[#1C2620] border border-[#659477]/30 px-2 py-0.5 rounded">
            WARNING RESOLVED
          </span>
        </div>

        <div className="my-3 p-3.5 bg-[#1C2620] border border-[#659477]/40 rounded-lg flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#659477] shrink-0 mt-0.5" />
          <div className="text-xs text-[#9AA6B2] space-y-1">
            <div className="font-bold text-[#E8EDF3]">WARNING RESOLVED</div>
            <p className="text-[11px] text-[#A7B0BC]">
              Projected event <strong className="text-[#659477]">{predictedEvent}</strong> has entered observed ground truth.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#27303A] text-[10px] font-mono text-[#9AA6B2] flex items-center justify-between">
          <span>Target: {targetAsset}</span>
          <span className="text-[#659477] font-bold">Outcome Confirmed</span>
        </div>
      </div>
    );
  }

  // 2. No Forecast / Standby State
  if (status === "NO_FORECAST" || !warningWindow || initialLeadTime === null || initialLeadTime === undefined) {
    return (
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
        <div className="flex items-center justify-between pb-3 border-b border-[#27303A]">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#9AA6B2]">
            EARLY WARNING
          </h2>
          <span className="font-mono text-[10px] text-[#6C7987]">STANDBY</span>
        </div>

        <div className="my-4 p-3.5 bg-[#19202A] border border-[#27303A] rounded-lg flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-[#6C7987] shrink-0 mt-0.5" />
          <div className="text-xs text-[#9AA6B2] space-y-1">
            <div className="font-bold text-[#E8EDF3]">EARLY WARNING</div>
            <div className="text-sm font-semibold text-[#6C7987]">No actionable forecast available</div>
            <p className="text-[11px] text-[#6C7987] mt-1">
              {warningWindow?.rationale || "Continuous temporal flow monitoring active."}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#27303A] text-[10px] font-mono text-[#6C7987]">
          Target asset: {targetAsset}
        </div>
      </div>
    );
  }

  // 3. Active Warning Window
  return (
    <div
      className={`bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between transition-all select-none ${
        isFrozenAtCurrent ? "ring-2 ring-[#6F95D6]/40" : ""
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27303A]">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#9AA6B2]">
          EARLY WARNING
        </h2>
        <span className="font-mono text-[10px] font-bold text-[#C59A45] bg-[#2A2318] border border-[#C59A45]/30 px-2 py-0.5 rounded">
          {warningWindow.horizonLabel || `~${timeLeft}s LEAD TIME`}
        </span>
      </div>

      {/* Visually Dominant Metric */}
      <div className="my-3">
        <div className="text-4xl sm:text-5xl font-mono font-bold text-[#E8EDF3] tracking-tight flex items-baseline gap-2">
          <span>{timeLeft}</span>
          <span className="text-sm font-normal text-[#9AA6B2] font-sans">sec</span>
        </div>
        <div className="text-xs text-[#9AA6B2] mt-0.5">
          estimated warning lead time
        </div>
        <div className="text-xs text-[#E8EDF3] mt-2.5 font-medium">
          Projected transition: <strong className="text-[#6F95D6] font-semibold">{predictedEvent}</strong>
        </div>
        <div className="text-[11px] text-[#9AA6B2] mt-1 font-mono">
          Target: <span className="text-[#E8EDF3]">{targetAsset}</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-3 border-t border-[#27303A]">
        {isFrozenAtCurrent ? (
          <button
            onClick={revealFuture}
            className="w-full bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14] rounded-lg px-3.5 py-2 text-xs font-mono font-bold flex items-center justify-between transition-colors shadow-sm group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0B0F14]" />
              <span>REVEAL FUTURE EVENT</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0B0F14] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </button>
        ) : (
          <Link
            href="/what-if"
            className="w-full bg-[#19202A] hover:bg-[#1E2632] text-[#E8EDF3] border border-[#27303A] hover:border-[#6F95D6] rounded-lg px-3.5 py-2 text-xs font-mono font-medium flex items-center justify-between transition-colors group"
          >
            <span className="truncate pr-2">{recommendedAction}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#6F95D6] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
}
