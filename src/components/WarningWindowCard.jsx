"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useReplay, REPLAY_STATES } from "@/context/ReplayContext";

export default function WarningWindowCard({ warningWindow }) {
  const { replayState, isFrozenAtCurrent, revealFuture } = useReplay();

  const [timeLeft, setTimeLeft] = useState(warningWindow?.timeRemainingSec || 75);

  useEffect(() => {
    if (warningWindow?.timeRemainingSec) {
      setTimeLeft(warningWindow.timeRemainingSec);
    }
  }, [warningWindow]);

  useEffect(() => {
    if (replayState === REPLAY_STATES.PLAYING && warningWindow) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 1 ? prev - 1 : warningWindow.durationSec));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [replayState, warningWindow]);

  if (!warningWindow) {
    return (
      <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            WARNING WINDOW
          </h2>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">STANDBY</span>
        </div>

        <div className="py-8 text-center font-mono text-xs text-slate-400 dark:text-slate-500">
          Awaiting forecast replay state...
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 dark:text-slate-500">
          Lead time: 60–90 Seconds
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between transition-all ${
        isFrozenAtCurrent ? "ring-2 ring-accent/30" : ""
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
          WARNING WINDOW
        </h2>
        <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
          {warningWindow.horizonLabel || "60–90s Horizon"}
        </span>
      </div>

      {/* Visually Dominant Metric */}
      <div className="my-3">
        <div className="text-4xl font-mono font-extrabold text-navy-800 dark:text-slate-100 tracking-tight flex items-baseline gap-1.5">
          <span>{timeLeft}</span>
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400 font-sans">sec</span>
        </div>
        <div className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-1">
          Forecasted event: <strong className="text-navy-800 dark:text-slate-100">Lateral Movement</strong>
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        {isFrozenAtCurrent ? (
          <button
            onClick={revealFuture}
            className="w-full bg-accent hover:bg-blue-600 text-white rounded-lg px-3.5 py-2 text-xs font-mono font-bold flex items-center justify-between transition-colors shadow-sm group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>REVEAL FUTURE EVENT</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </button>
        ) : (
          <Link
            href="/what-if"
            className="w-full bg-navy-800 dark:bg-slate-800 hover:bg-navy-700 dark:hover:bg-slate-700 text-white rounded-lg px-3.5 py-2 text-xs font-mono font-semibold flex items-center justify-between transition-colors group border border-transparent dark:border-slate-700"
          >
            <span className="truncate pr-2">{warningWindow.recommendedAction}</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
}

