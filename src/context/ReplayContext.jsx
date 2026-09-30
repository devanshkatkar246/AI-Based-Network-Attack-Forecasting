"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { REPLAY_TICKS } from "@/data/mockData";

const ReplayContext = createContext(null);

export const REPLAY_STATES = {
  IDLE: "idle",
  PLAYING: "playing",
  PAUSED: "paused",
  AT_CURRENT: "at_current", // Frozen at CURRENT (NOW)
  VALIDATED: "validated",   // Replay finished / all actual events revealed
};

export function ReplayProvider({ children }) {
  const [currentTickIndex, setCurrentTickIndex] = useState(0);
  const [replayState, setReplayState] = useState(REPLAY_STATES.IDLE);
  const [playbackSpeed, setPlaybackSpeed] = useState(1800); // ms per step

  const CURRENT_FREEZE_INDEX = 2; // Tick index 2 corresponds to CURRENT (NOW)
  const MAX_TICK_INDEX = REPLAY_TICKS.length - 1;

  const currentTick = REPLAY_TICKS[currentTickIndex] || REPLAY_TICKS[0];

  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const play = useCallback(() => {
    if (replayState === REPLAY_STATES.AT_CURRENT) {
      // Must use revealFuture to proceed past CURRENT freeze
      return;
    }
    setReplayState(REPLAY_STATES.PLAYING);
  }, [replayState]);

  const pause = useCallback(() => {
    clearTimer();
    setReplayState(REPLAY_STATES.PAUSED);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentTickIndex(0);
    setReplayState(REPLAY_STATES.IDLE);
  }, []);

  const revealFuture = useCallback(() => {
    // Step forward past CURRENT state and continue playing/revealing
    if (currentTickIndex < MAX_TICK_INDEX) {
      const nextIdx = currentTickIndex + 1;
      setCurrentTickIndex(nextIdx);
      setReplayState(REPLAY_STATES.PLAYING);
    }
  }, [currentTickIndex, MAX_TICK_INDEX]);

  const stepForward = useCallback(() => {
    if (currentTickIndex < MAX_TICK_INDEX) {
      const nextIdx = currentTickIndex + 1;
      setCurrentTickIndex(nextIdx);
      if (nextIdx === CURRENT_FREEZE_INDEX) {
        setReplayState(REPLAY_STATES.AT_CURRENT);
      } else if (nextIdx === MAX_TICK_INDEX) {
        setReplayState(REPLAY_STATES.VALIDATED);
      } else {
        setReplayState(REPLAY_STATES.PAUSED);
      }
    }
  }, [currentTickIndex, MAX_TICK_INDEX]);

  const stepBack = useCallback(() => {
    if (currentTickIndex > 0) {
      const prevIdx = currentTickIndex - 1;
      setCurrentTickIndex(prevIdx);
      setReplayState(REPLAY_STATES.PAUSED);
    }
  }, [currentTickIndex]);

  const jumpToTick = useCallback((index) => {
    if (index >= 0 && index <= MAX_TICK_INDEX) {
      setCurrentTickIndex(index);
      if (index === CURRENT_FREEZE_INDEX) {
        setReplayState(REPLAY_STATES.AT_CURRENT);
      } else if (index === MAX_TICK_INDEX) {
        setReplayState(REPLAY_STATES.VALIDATED);
      } else {
        setReplayState(REPLAY_STATES.PAUSED);
      }
    }
  }, [MAX_TICK_INDEX]);

  // Main playback interval loop
  useEffect(() => {
    if (replayState === REPLAY_STATES.PLAYING) {
      clearTimer();
      timerRef.current = setInterval(() => {
        setCurrentTickIndex((prev) => {
          const next = prev + 1;
          // Check if we hit the CURRENT freeze point
          if (next === CURRENT_FREEZE_INDEX) {
            clearTimer();
            setReplayState(REPLAY_STATES.AT_CURRENT);
            return next;
          }
          // Check if we hit the end
          if (next >= MAX_TICK_INDEX) {
            clearTimer();
            setReplayState(REPLAY_STATES.VALIDATED);
            return MAX_TICK_INDEX;
          }
          return next;
        });
      }, playbackSpeed);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [replayState, playbackSpeed, MAX_TICK_INDEX]);

  const value = {
    currentTickIndex,
    currentTick,
    replayState,
    playbackSpeed,
    setPlaybackSpeed,
    isFrozenAtCurrent: replayState === REPLAY_STATES.AT_CURRENT || (currentTickIndex === CURRENT_FREEZE_INDEX && replayState !== REPLAY_STATES.PLAYING && currentTickIndex < 3),
    isCompleted: replayState === REPLAY_STATES.VALIDATED || currentTickIndex === MAX_TICK_INDEX,
    play,
    pause,
    reset,
    revealFuture,
    stepForward,
    stepBack,
    jumpToTick,
    totalTicks: REPLAY_TICKS.length,
    CURRENT_FREEZE_INDEX,
  };

  return <ReplayContext.Provider value={value}>{children}</ReplayContext.Provider>;
}

export function useReplay() {
  const context = useContext(ReplayContext);
  if (!context) {
    throw new Error("useReplay must be used within a ReplayProvider");
  }
  return context;
}
