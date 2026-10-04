"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import ReplayControlBar from "./ReplayControlBar";
import { fetchScenarios } from "@/lib/api";
import { ReplayProvider, useReplay } from "@/context/ReplayContext";
import { REPLAY_TICKS } from "@/data/mockData";

function AppShellContent({ children, title }) {
  const [activeScenarioIdState, setActiveScenarioIdState] = useState(null);
  const [scenariosList, setScenariosList] = useState([]);
  const [activeScenarioName, setActiveScenarioName] = useState(null);
  const { currentTickIndex, backendState, setScenarioId, activeScenarioId: contextScenarioId } = useReplay();

  const activeScenarioId = activeScenarioIdState || contextScenarioId;

  const handleSelectScenario = (id) => {
    setActiveScenarioIdState(id);
    if (setScenarioId) {
      setScenarioId(id);
    }
  };

  // Load scenarios metadata on mount
  useEffect(() => {
    fetchScenarios().then((list) => {
      if (list && list.length > 0) {
        setScenariosList(list);
      }
    });
  }, []);

  // Sync initial scenario ID if none set
  useEffect(() => {
    if (!activeScenarioIdState && scenariosList.length > 0) {
      const defaultId = scenariosList[0].id;
      setActiveScenarioIdState(defaultId);
      if (setScenarioId) setScenarioId(defaultId);
    }
  }, [scenariosList, activeScenarioIdState, setScenarioId]);

  // Update active scenario name when activeScenarioId changes
  useEffect(() => {
    if (activeScenarioId) {
      const match = scenariosList.find((s) => s.id === activeScenarioId);
      if (match) {
        setActiveScenarioName(match.name);
      } else {
        setActiveScenarioName(activeScenarioId);
      }
    } else {
      setActiveScenarioName(null);
    }
  }, [activeScenarioId, scenariosList]);

  // Construct activeScenario object dynamically from backendState or fallback mock
  const curState = backendState?.current_state;
  const fcState = backendState?.forecast;
  const mockTick = REPLAY_TICKS[currentTickIndex] || REPLAY_TICKS[0];

  const activeScenario = activeScenarioId
    ? {
        id: activeScenarioId,
        name: activeScenarioName || activeScenarioId,
        currentState: curState?.phase ? curState.phase.replace("_", " ") : mockTick?.phase || "BASELINE",
        telemetry: {
          activeHosts: curState?.active_hosts ?? mockTick?.activeHosts ?? 12,
          activeFlows: curState?.traffic?.active_flows ?? mockTick?.activeFlows ?? 180,
          trafficMbps: curState?.traffic?.traffic_mbps ? `${curState.traffic.traffic_mbps} Mbps` : mockTick?.trafficMbps ?? "310 Mbps",
          networkState: curState?.phase ?? mockTick?.networkState ?? "BASELINE",
          anomalyIndex: curState?.phase && curState.phase !== "BASELINE" ? "ELEVATED" : mockTick?.anomalyIndex ?? "Baseline (0%)",
        },
        trajectory: fcState?.trajectory?.length ? fcState.trajectory : mockTick?.trajectory || [],
        warningWindow: fcState
          ? fcState.status === "model_not_ready"
            ? null
            : {
                status: "WARNING ACTIVE",
                leadTimeSeconds: fcState.warning_lead_time_seconds ?? mockTick?.warningWindow?.durationSec ?? 45,
                horizonLabel: fcState.warning_lead_time_seconds ? `${fcState.warning_lead_time_seconds} sec lead time` : "45–60s Horizon",
                predictedBehavior: fcState.predicted_behavior || "Lateral Movement",
                predictedTechnique: fcState.predicted_technique || "T1021.002",
                targetAsset: fcState.target_host || "FIN-SRV-01 (10.0.4.12)",
                recommendedAction: "Isolate Host & Block Communication Port",
                confidenceScore: fcState.uncertainty?.calibrated_confidence ?? 0.88,
                threatLevel: "CRITICAL"
              }
          : mockTick?.warningWindow || null,
        modelStatus: fcState?.status || "ready",
        modelErrorMessage: fcState?.message || null,
        topology: curState?.topology || mockTick?.topology || { zones: [], nodes: [], edges: [] },
        evidence: fcState?.evidence || mockTick?.evidence || [],
        validationNotice: backendState?.quality_report ? `Validated dataset (${backendState.quality_report.total_rows || 0} rows)` : null,
      }
    : null;

  return (
    <div className="flex min-h-screen bg-[#0D1015] text-[#E7EAF0] antialiased font-sans transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          title={title}
          activeScenarioName={activeScenarioName}
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
        />

        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Top Replay Control Bar (rendered when a scenario is active) */}
          {activeScenarioId && <ReplayControlBar />}

          {/* Pass dynamic active scenario data & handlers to children */}
          {typeof children === "function"
            ? children({ activeScenario, activeScenarioId, setActiveScenarioId: handleSelectScenario })
            : React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, { activeScenario, activeScenarioId, setActiveScenarioId: handleSelectScenario });
                }
                return child;
              })}
        </main>
      </div>
    </div>
  );
}

export default function AppShell(props) {
  return (
    <ReplayProvider>
      <AppShellContent {...props} />
    </ReplayProvider>
  );
}

