"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import { SCENARIOS } from "../data/mockData";

export default function AppShell({ children, title = "Command Center" }) {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <div className="flex min-h-screen bg-background text-navy-800 antialiased font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          title={title}
          activeScenarioId={activeScenarioId}
          onSelectScenario={setActiveScenarioId}
        />

        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
          {/* Pass active scenario data to children if clone element, or render children directly */}
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
