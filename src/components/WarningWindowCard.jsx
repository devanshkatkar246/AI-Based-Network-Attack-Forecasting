"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useReplay, REPLAY_STATES } from "@/context/ReplayContext";

export default function WarningWindowCard({ warningWindow }) {
  const { replayState, isFrozenAtCurrent, revealFuture } = useReplay();

  const initialLeadTime = warningWindow?.leadTimeSeconds ?? warningWindow?.timeRemainingSec;
  const [timeLeft, setTimeLeft] = useState(initialLeadTime);

  useEffect(() => {
    const val = warningWindow?.leadTimeSeconds ?? warningWindow?.timeRemainingSec;
    if (val !== undefined) {
      setTimeLeft(val);
    }
  }, [warningWindow]);

  // Handle UNAVAILABLE warning lead time (Section 16 & 17)
  if (!warningWindow || initialLeadTime === null || initialLeadTime === undefined) {
    return (
      <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323C]">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#9BA4B0]">
            EARLY WARNING
          </h2>
          <span className="font-mono text-[10px] text-[#6F7885]">STANDBY</span>
        </div>

        <div className="my-4 p-3 bg-[#191F27] border border-[#2A323C] rounded flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#6F7885] shrink-0 mt-0.5" />
          <div className="font-mono text-xs text-[#9BA4B0] space-y-1">
            <div className="font-bold text-[#E7EAF0]">WARNING LEAD TIME</div>
            <div className="text-sm font-bold text-[#6F7885]">Not available</div>
            <p className="text-[11px] text-[#6F7885] mt-1">
              Reason: Insufficient ground truth / model output in current temporal state window.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#2A323C] text-[10px] font-mono text-[#6F7885]">
          Target asset: {warningWindow?.targetAsset || "Monitored Subnet"}
        </div>
      </div>
    );
  }

  const predictedEvent = warningWindow.predictedBehavior || "Lateral Movement";
  const recommendedAction = warningWindow.recommendedAction || "Investigate / isolate suspicious host";

  return (
    <div
      className={`bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card h-full flex flex-col justify-between transition-all select-none ${
        isFrozenAtCurrent ? "ring-2 ring-[#6F8FBE]/40" : ""
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A323C]">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#9BA4B0]">
          EARLY WARNING
        </h2>
        <span className="font-mono text-[10px] font-bold text-[#B98A3A] bg-[#2A2318] border border-[#4A3C26] px-2 py-0.5 rounded">
          {warningWindow.horizonLabel || `${timeLeft} sec Horizon`}
        </span>
      </div>

      {/* Visually Dominant Metric */}
      <div className="my-3 font-mono">
        <div className="text-4xl font-mono font-bold text-[#E7EAF0] tracking-tight flex items-baseline gap-1.5">
          <span>{timeLeft}</span>
          <span className="text-xs font-normal text-[#9BA4B0] font-sans">sec</span>
        </div>
        <div className="text-[11px] text-[#9BA4B0] mt-0.5">
          estimated warning lead time
        </div>
        <div className="text-xs text-[#E7EAF0] mt-2 font-semibold">
          Predicted event: <strong className="text-[#6F8FBE]">{predictedEvent}</strong>
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-3 border-t border-[#2A323C] font-mono">
        {isFrozenAtCurrent ? (
          <button
            onClick={revealFuture}
            className="w-full bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] rounded-lg px-3.5 py-2 text-xs font-mono font-bold flex items-center justify-between transition-colors shadow-subtle group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0D1015]" />
              <span>REVEAL FUTURE EVENT</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0D1015] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </button>
        ) : (
          <Link
            href="/what-if"
            className="w-full bg-[#191F27] hover:bg-[#1D242D] text-[#E7EAF0] border border-[#2A323C] hover:border-[#6F8FBE] rounded-lg px-3.5 py-2 text-xs font-mono font-semibold flex items-center justify-between transition-colors group"
          >
            <span className="truncate pr-2">{recommendedAction}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#6F8FBE] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
}



