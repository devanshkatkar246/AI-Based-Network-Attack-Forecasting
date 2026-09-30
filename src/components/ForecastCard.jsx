"use client";

import React from "react";

export default function ForecastCard({ scenario }) {
  if (!scenario) return null;

  // Extract forecast steps from trajectory
  const forecastSteps =
    scenario.trajectory?.filter(
      (step) => step.status === "FORECAST" || step.status === "ACTUAL"
    ) || [];

  const primaryForecast = forecastSteps[0] || {
    stage: "Lateral Movement",
    techniqueId: "T1021.002",
    techniqueName: "SMB/PsExec Execution",
    estimatedTime: "+30s",
    targetHost: "FIN-SRV-01 (10.0.4.12)",
  };

  const secondaryForecast = forecastSteps[1] || {
    stage: "Command & Control",
    techniqueId: "T1071.001",
    techniqueName: "Encrypted Web Protocol",
    estimatedTime: "+60s",
    targetHost: "198.51.100.42 (External C2)",
  };

  return (
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
          MODEL FORECAST
        </h2>
        <span className="font-mono text-[10px] font-bold text-forecast bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
          {primaryForecast.estimatedTime || "+30s"}
        </span>
      </div>

      {/* Primary Forecast Value */}
      <div className="my-3">
        <div className="text-xl font-mono font-bold text-forecast leading-tight">
          {primaryForecast.stage}
        </div>
        <div className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-1">
          {primaryForecast.techniqueName}
        </div>
        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
          Target: <span className="font-semibold text-navy-800 dark:text-slate-100">{primaryForecast.targetHost}</span>
        </div>
      </div>

      {/* Secondary Horizon */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Subsequent: <strong className="text-slate-700 dark:text-slate-200">{secondaryForecast.stage}</strong></span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{secondaryForecast.estimatedTime || "+60s"}</span>
      </div>
    </div>
  );
}

