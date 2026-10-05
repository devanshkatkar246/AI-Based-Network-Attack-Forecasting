"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { REPLAY_TICKS } from "@/data/mockData";
import { fetchScenarioReplay } from "@/lib/api";

const ReplayContext = createContext(null);

export const REPLAY_STATES = {
  IDLE: "idle",
  PLAYING: "playing",
  PAUSED: "paused",
  AT_CURRENT: "at_current", // Frozen at CURRENT (NOW)
  VALIDATED: "validated",   // Replay finished / all actual events revealed
};

export function ReplayProvider({ children, initialScenarioId = "enterprise-lateral-movement-01" }) {
  const [activeScenarioId, setActiveScenarioId] = useState(initialScenarioId);
  const [currentTickIndex, setCurrentTickIndex] = useState(0);
  const [replayState, setReplayState] = useState(REPLAY_STATES.IDLE);
  const [playbackSpeed, setPlaybackSpeed] = useState(1800); // ms per step
  const [backendState, setBackendState] = useState(null);

  // When active scenario changes, reset tick index and state
  const setScenarioId = useCallback((newId) => {
    if (newId && newId !== activeScenarioId) {
      setActiveScenarioId(newId);
      setCurrentTickIndex(0);
      setReplayState(REPLAY_STATES.IDLE);
    }
  }, [activeScenarioId]);

  // Total ticks and current freeze index derived dynamically
  const totalTicks = backendState?.totalTicks || REPLAY_TICKS.length;
  const CURRENT_FREEZE_INDEX = Math.min(2, Math.max(0, totalTicks - 1));
  const MAX_TICK_INDEX = totalTicks - 1;

  const currentTick = backendState?.current_state || REPLAY_TICKS[currentTickIndex] || REPLAY_TICKS[0];

  useEffect(() => {
    if (!activeScenarioId) return;
    let isMounted = true;
    fetchScenarioReplay(activeScenarioId, currentTickIndex).then((res) => {
      if (isMounted && res) {
        setBackendState(res);
      }
    });
    return () => { isMounted = false; };
  }, [activeScenarioId, currentTickIndex]);

  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const play = useCallback(() => {
    setReplayState(REPLAY_STATES.PLAYING);
  }, []);

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
      if (nextIdx === MAX_TICK_INDEX) {
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
      if (index === MAX_TICK_INDEX) {
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
    activeScenarioId,
    setScenarioId,
    currentTickIndex,
    currentTick,
    backendState,
    replayState,
    playbackSpeed,
    setPlaybackSpeed,
    isFrozenAtCurrent: replayState === REPLAY_STATES.AT_CURRENT || (currentTickIndex === CURRENT_FREEZE_INDEX && replayState !== REPLAY_STATES.PLAYING && currentTickIndex < MAX_TICK_INDEX),
    isCompleted: replayState === REPLAY_STATES.VALIDATED || currentTickIndex === MAX_TICK_INDEX,
    play,
    pause,
    reset,
    revealFuture,
    stepForward,
    stepBack,
    jumpToTick,
    totalTicks,
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

