"use client";

import React, { useState, useEffect } from "react";
import ScenarioSelector from "./ScenarioSelector";
import StatusBadge from "./StatusBadge";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function TopHeader({ title, activeScenarioName, activeScenarioId, onSelectScenario }) {
  const [timeString, setTimeString] = useState("");
  const { theme, toggleTheme } = useTheme();

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
    <header className="h-13 bg-[#11151B] border-b border-[#2A323C] px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Page Title & Active Scenario Indicator */}
      <div className="flex items-center gap-3">
        <h1 className="text-xs font-bold font-mono text-[#E7EAF0] uppercase tracking-wider">
          {title}
        </h1>
        <span className="text-[#2A323C]">|</span>
        <span className="hidden sm:inline text-[11px] font-mono text-[#6F8FBE]">
          {activeScenarioName ? activeScenarioName : "No Scenario Loaded"}
        </span>
      </div>

      {/* Right: Controls, Status & Time */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <ScenarioSelector 
          activeScenarioId={activeScenarioId} 
          onSelectScenario={onSelectScenario} 
        />

        <div className="h-3 w-px bg-[#2A323C]" />

        <StatusBadge status={activeScenarioId ? "ACTIVE" : "STANDBY"} size="sm" />

        <div className="h-3 w-px bg-[#2A323C]" />

        <div className="font-mono text-[11px] text-[#9BA4B0]">
          {timeString || "19:55:09 UTC"}
        </div>

        <div className="h-3 w-px bg-[#2A323C]" />

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1 rounded bg-[#151A21] hover:bg-[#191F27] text-[#9BA4B0] transition-colors border border-[#2A323C] flex items-center justify-center"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme mode"
        >
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5 text-[#B98A3A]" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[#6F8FBE]" />
          )}
        </button>
      </div>
    </header>
  );
}
