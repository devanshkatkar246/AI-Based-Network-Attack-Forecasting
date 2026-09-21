"use client";

import React, { useState, useEffect } from "react";
import ScenarioSelector from "./ScenarioSelector";
import StatusBadge from "./StatusBadge";
import { Clock } from "lucide-react";

export default function TopHeader({ title, activeScenarioId, onSelectScenario }) {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toUTCString().replace("GMT", "UTC").slice(17, 25) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-surface border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
      {/* Left: Page Title & Subtle Demo Scenario Badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-navy-800 tracking-tight">{title}</h1>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          DEMO SCENARIO
        </span>
      </div>

      {/* Right: Controls & Status */}
      <div className="flex items-center gap-4">
        <ScenarioSelector 
          activeScenarioId={activeScenarioId} 
          onSelectScenario={onSelectScenario} 
        />

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <StatusBadge status="OFFLINE" size="sm" />
        </div>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeString || "19:55:09 UTC"}</span>
        </div>
      </div>
    </header>
  );
}
