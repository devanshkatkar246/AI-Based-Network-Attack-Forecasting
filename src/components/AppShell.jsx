"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import ReplayControlBar from "./ReplayControlBar";
import { SCENARIOS } from "../data/mockData";
import { ReplayProvider, useReplay } from "@/context/ReplayContext";

function AppShellContent({ children, title }) {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const { currentTick } = useReplay();

  const baseScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // Merge current tick data into active scenario when primary scenario is selected
  const isPrimaryScenario = baseScenario.id === SCENARIOS[0].id;

  const activeScenario = isPrimaryScenario && currentTick
    ? {
        ...baseScenario,
        telemetry: {
          ...baseScenario.telemetry,
          activeHosts: currentTick.activeHosts || baseScenario.telemetry.activeHosts,
          activeFlows: currentTick.activeFlows || baseScenario.telemetry.activeFlows,
          trafficMbps: currentTick.trafficMbps || baseScenario.telemetry.trafficMbps,
          networkState: currentTick.networkState || baseScenario.telemetry.networkState,
          anomalyIndex: currentTick.anomalyIndex || baseScenario.telemetry.anomalyIndex,
        },
        currentState: currentTick.phase ? currentTick.phase.replace("_", " ") : baseScenario.currentState,
        trajectory: currentTick.trajectory || baseScenario.trajectory,
        warningWindow: currentTick.warningWindow || baseScenario.warningWindow,
        likelihoodOverTime: currentTick.likelihoodOverTime || baseScenario.likelihoodOverTime,
        topology: currentTick.topology || baseScenario.topology,
        validationNotice: currentTick.validationNotice,
      }
    : baseScenario;

  return (
    <div className="flex min-h-screen bg-background dark:bg-slate-950 text-navy-800 dark:text-slate-100 antialiased font-sans transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          title={title}
          activeScenarioId={activeScenarioId}
          onSelectScenario={setActiveScenarioId}
        />

        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Top Replay Control Bar */}
          {isPrimaryScenario && <ReplayControlBar />}

          {/* Pass dynamic active scenario data to children */}
          {typeof children === "function"
            ? children({ activeScenario, setActiveScenarioId })
            : React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, { activeScenario, setActiveScenarioId });
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
