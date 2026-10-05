"use client";

import React, { useState, useEffect } from "react";
import ScenarioSelector from "./ScenarioSelector";
import StatusBadge from "./StatusBadge";

export default function TopHeader({ title, activeScenarioName, activeScenarioId, onSelectScenario, scenariosList }) {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeParts = now.toTimeString().split(" ");
      const timeStr = timeParts[0];
      const tzMatch = now.toTimeString().match(/\((.+)\)/);
      const tz = tzMatch ? tzMatch[1].split(" ").map(w => w[0]).join("") : "IST";
      setTimeString(`${timeStr} ${tz}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-13 bg-[#11161D] border-b border-[#27303A] px-6 py-3 flex items-center justify-between sticky top-0 z-20 select-none min-w-0">
      {/* Left: Page Title & Active Scenario Indicator */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <h1 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider whitespace-nowrap flex-shrink-0">
          {title}
        </h1>
        <span className="text-[#27303A] flex-shrink-0">|</span>
        <span className="hidden sm:inline text-xs font-mono text-[#6F95D6] truncate min-w-0">
          {activeScenarioName ? activeScenarioName : "No Scenario Loaded"}
        </span>
      </div>

      {/* Right: Controls, Status & Time */}
      <div className="flex items-center gap-3 font-mono text-xs flex-shrink-0 ml-4">
        <ScenarioSelector 
          activeScenarioId={activeScenarioId} 
          onSelectScenario={onSelectScenario} 
          scenariosList={scenariosList}
        />

        <div className="h-3 w-px bg-[#27303A]" />

        <StatusBadge status={activeScenarioId ? "ACTIVE" : "STANDBY"} size="sm" />

        <div className="h-3 w-px bg-[#27303A]" />

        <div className="font-mono text-[11px] text-[#9AA6B2] whitespace-nowrap">
          {timeString || "19:55:09 UTC"}
        </div>
      </div>
    </header>
  );
}

