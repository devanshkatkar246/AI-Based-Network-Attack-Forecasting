"use client";

import React, { useState, useEffect } from "react";
import ScenarioSelector from "./ScenarioSelector";
import StatusBadge from "./StatusBadge";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function TopHeader({ title, activeScenarioId, onSelectScenario }) {
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
    <header className="h-14 bg-surface dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-navy-800 dark:text-slate-100 tracking-tight">{title}</h1>
        <span className="hidden sm:inline text-[10px] font-mono text-slate-400 dark:text-slate-500">
          SIH 26153 MVP
        </span>
      </div>

      {/* Right: Controls, Status & Theme Toggle */}
      <div className="flex items-center gap-3.5">
        <ScenarioSelector 
          activeScenarioId={activeScenarioId} 
          onSelectScenario={onSelectScenario} 
        />

        <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />

        <StatusBadge status="OFFLINE" size="sm" />

        <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="font-mono text-xs text-slate-400 dark:text-slate-500">
          {timeString || "19:55:09 UTC"}
        </div>

        <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme mode"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
}

