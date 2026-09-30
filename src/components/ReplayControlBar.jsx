"use client";

import React from "react";
import { useReplay, REPLAY_STATES } from "@/context/ReplayContext";
import { REPLAY_TICKS } from "@/data/mockData";
import { Play, Pause, RotateCcw, Sparkles, SkipForward, SkipBack, CheckCircle2, Info } from "lucide-react";

export default function ReplayControlBar() {
  const {
    currentTickIndex,
    currentTick,
    replayState,
    play,
    pause,
    reset,
    revealFuture,
    stepForward,
    stepBack,
    jumpToTick,
    isFrozenAtCurrent,
  } = useReplay();

  const renderPrimaryButton = () => {
    if (replayState === REPLAY_STATES.PLAYING) {
      return (
        <button
          onClick={pause}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
        >
          <Pause className="w-3.5 h-3.5 fill-white" />
          <span>PAUSE</span>
        </button>
      );
    }

    if (replayState === REPLAY_STATES.AT_CURRENT) {
      return (
        <button
          onClick={revealFuture}
          className="px-3.5 py-1.5 bg-accent hover:bg-blue-600 text-white rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>REVEAL FUTURE EVENT</span>
        </button>
      );
    }

    if (replayState === REPLAY_STATES.VALIDATED || currentTickIndex === REPLAY_TICKS.length - 1) {
      return (
        <button
          onClick={reset}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent" />
          <span>RESTART REPLAY</span>
        </button>
      );
    }

    return (
      <button
        onClick={play}
        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
      >
        <Play className="w-3.5 h-3.5 fill-white text-white" />
        <span>PLAY</span>
      </button>
    );
  };

  return (
    <div className="space-y-2">
      {/* Replay Strip */}
      <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Current Replay State */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wide">
            TEMPORAL REPLAY
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-500 dark:text-slate-400">
            State: <strong className="text-navy-800 dark:text-slate-100">{currentTick.timeLabel}</strong> ({currentTick.phase.replace("_", " ")})
          </span>
        </div>

        {/* Right: Controls & Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={stepBack}
            disabled={currentTickIndex === 0}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-navy-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
            title="Step Back"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {renderPrimaryButton()}

          <button
            onClick={stepForward}
            disabled={currentTickIndex === REPLAY_TICKS.length - 1}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-navy-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={reset}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-navy-800 dark:hover:text-slate-200 transition-colors ml-1"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quiet Progress Stepper */}
      <div className="px-1 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[560px] py-1 font-mono text-[11px]">
          {REPLAY_TICKS.map((tick, idx) => {
            const isActive = idx === currentTickIndex;
            const isPassed = idx < currentTickIndex;
            const isFreezeNode = idx === 2;
            const isActualRevealed = idx >= 3 && idx <= currentTickIndex;

            return (
              <React.Fragment key={tick.tickIndex}>
                <button
                  onClick={() => jumpToTick(idx)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                    isActive
                      ? "text-navy-800 dark:text-slate-100 font-bold bg-slate-100 dark:bg-slate-800"
                      : isPassed
                      ? "text-slate-600 dark:text-slate-300"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFreezeNode && isActive
                        ? "bg-accent ring-2 ring-accent/30"
                        : isActualRevealed
                        ? "bg-emerald-600"
                        : isActive
                        ? "bg-navy-800 dark:bg-slate-200"
                        : isPassed
                        ? "bg-slate-400 dark:bg-slate-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                  <span>{tick.timeLabel}</span>
                </button>
                {idx < REPLAY_TICKS.length - 1 && (
                  <div className="flex-1 h-px mx-1.5 bg-slate-200/80 dark:bg-slate-800" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Validation Banner Climax */}
      {currentTick.validationNotice && (
        <div className="bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 rounded-lg p-3 font-mono text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-emerald-950 dark:text-emerald-200 uppercase mr-2">
                {currentTick.validationNotice.title}
              </span>
              <span className="text-emerald-800 dark:text-emerald-300 text-[11px]">
                {currentTick.validationNotice.subtitle}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded uppercase">
            FORECAST VALIDATED
          </span>
        </div>
      )}

      {/* Freeze Banner at CURRENT */}
      {isFrozenAtCurrent && (
        <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-accent/30 dark:border-accent/40 rounded-lg p-3 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-slate-700 dark:text-slate-200">
              Replay frozen at <strong className="text-navy-800 dark:text-slate-100">NOW (Privilege Access)</strong>. Click <strong className="text-navy-800 dark:text-slate-100">REVEAL FUTURE EVENT</strong> to observe actual outcome.
            </span>
          </div>
          <button
            onClick={revealFuture}
            className="px-3 py-1 bg-accent hover:bg-blue-600 text-white rounded text-xs font-mono font-bold flex-shrink-0 transition-colors"
          >
            REVEAL FUTURE
          </button>
        </div>
      )}
    </div>
  );
}

