"use client";

import React from "react";
import { useReplay, REPLAY_STATES } from "@/context/ReplayContext";
import { REPLAY_TICKS } from "@/data/mockData";
import { formatRelativeTimestamp } from "@/lib/temporalUtils";
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
    totalTicks,
    CURRENT_FREEZE_INDEX,
  } = useReplay();

  const maxIndex = totalTicks - 1;

  const renderPrimaryButton = () => {
    if (replayState === REPLAY_STATES.PLAYING) {
      return (
        <button
          onClick={pause}
          className="px-3 py-1.5 bg-[#1D242D] hover:bg-[#2A323C] text-[#E7EAF0] border border-[#2A323C] rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
        >
          <Pause className="w-3.5 h-3.5 text-[#E7EAF0]" />
          <span>PAUSE</span>
        </button>
      );
    }

    if (replayState === REPLAY_STATES.AT_CURRENT) {
      return (
        <button
          onClick={revealFuture}
          className="px-3.5 py-1.5 bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0D1015]" />
          <span>REVEAL FUTURE EVENT</span>
        </button>
      );
    }

    if (replayState === REPLAY_STATES.VALIDATED || currentTickIndex === maxIndex) {
      return (
        <button
          onClick={reset}
          className="px-3 py-1.5 bg-[#1D242D] hover:bg-[#2A323C] text-[#E7EAF0] border border-[#2A323C] rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#6F8FBE]" />
          <span>RESTART REPLAY</span>
        </button>
      );
    }

    return (
      <button
        onClick={play}
        className="px-3 py-1.5 bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
      >
        <Play className="w-3.5 h-3.5 fill-[#0D1015] text-[#0D1015]" />
        <span>PLAY</span>
      </button>
    );
  };

  const currentLabel = formatRelativeTimestamp(currentTick?.timeLabel, currentTickIndex, CURRENT_FREEZE_INDEX);

  return (
    <div className="space-y-2 font-mono select-none">
      {/* Replay Control Strip */}
      <div className="bg-[#151A21] border border-[#2A323C] rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card">
        {/* Left: Current Replay State */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-[#E7EAF0] uppercase tracking-wide">
            TEMPORAL REPLAY
          </span>
          <span className="text-[#2A323C]">|</span>
          <span className="text-[#9BA4B0]">
            Position: <strong className="text-[#6F8FBE]">{currentLabel}</strong> {currentTick?.phase ? `(${currentTick.phase.replace("_", " ")})` : ""}
          </span>
        </div>

        {/* Right: Controls & Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={stepBack}
            disabled={currentTickIndex === 0}
            className="p-1 text-[#6F7885] hover:text-[#E7EAF0] disabled:opacity-30 transition-colors"
            title="Step Back"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {renderPrimaryButton()}

          <button
            onClick={stepForward}
            disabled={currentTickIndex === maxIndex}
            className="p-1 text-[#6F7885] hover:text-[#E7EAF0] disabled:opacity-30 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={reset}
            className="p-1 text-[#6F7885] hover:text-[#E7EAF0] transition-colors ml-1"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Dynamic Stepper Bar */}
      <div className="px-1 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[560px] py-1 text-[11px]">
          {Array.from({ length: totalTicks }).map((_, idx) => {
            const isActive = idx === currentTickIndex;
            const isPassed = idx < currentTickIndex;
            const isFreezeNode = idx === CURRENT_FREEZE_INDEX;
            const isActualRevealed = idx > CURRENT_FREEZE_INDEX && idx <= currentTickIndex;
            const mockItem = REPLAY_TICKS[idx];
            const nodeLabel = formatRelativeTimestamp(mockItem?.timeLabel, idx, CURRENT_FREEZE_INDEX);

            return (
              <React.Fragment key={idx}>
                <button
                  onClick={() => jumpToTick(idx)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                    isActive
                      ? "text-[#E7EAF0] font-bold bg-[#1D242D] border border-[#6F8FBE]/40"
                      : isPassed
                      ? "text-[#9BA4B0]"
                      : "text-[#6F7885] hover:text-[#E7EAF0]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFreezeNode && isActive
                        ? "bg-[#6F8FBE] ring-2 ring-[#6F8FBE]/40"
                        : isActualRevealed
                        ? "bg-[#668B73]"
                        : isActive
                        ? "bg-[#E7EAF0]"
                        : isPassed
                        ? "bg-[#6F7885]"
                        : "bg-[#2A323C]"
                    }`}
                  />
                  <span>{nodeLabel}</span>
                </button>
                {idx < maxIndex && (
                  <div className="flex-1 h-px mx-1.5 bg-[#2A323C]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Validation Banner Climax */}
      {currentTick?.validationNotice && (
        <div className="bg-[#19241E] border border-[#668B73]/40 rounded-lg p-3 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#668B73] flex-shrink-0" />
            <div>
              <span className="font-bold text-[#E7EAF0] uppercase mr-2">
                {currentTick.validationNotice.title || "VALIDATED"}
              </span>
              <span className="text-[#9BA4B0] text-[11px]">
                {currentTick.validationNotice.subtitle || "Replay matches observed temporal ground truth"}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#668B73] bg-[#0D1015] border border-[#668B73]/40 px-2 py-0.5 rounded uppercase">
            FORECAST VALIDATED
          </span>
        </div>
      )}

      {/* Freeze Banner at CURRENT */}
      {isFrozenAtCurrent && (
        <div className="bg-[#151D28] border border-[#6F8FBE]/40 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#6F8FBE] flex-shrink-0" />
            <span className="text-[#E7EAF0]">
              Replay paused at <strong className="text-[#6F8FBE]">CURRENT NETWORK STATE (NOW)</strong>. Click <strong className="text-[#6F8FBE]">REVEAL FUTURE EVENT</strong> to step forward into model prediction rollout.
            </span>
          </div>
          <button
            onClick={revealFuture}
            className="px-3 py-1 bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] rounded text-xs font-mono font-bold flex-shrink-0 transition-colors"
          >
            REVEAL FUTURE
          </button>
        </div>
      )}
    </div>
  );
}



