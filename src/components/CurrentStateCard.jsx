"use client";

import React from "react";
import StatusBadge from "./StatusBadge";

export default function CurrentStateCard({ scenario, currentTick }) {
  if (!scenario) return null;

  // Extract current step from trajectory
  const currentStep =
    scenario.trajectory?.find((step) => step.isCurrent || step.status === "CURRENT") ||
    scenario.trajectory?.[2] ||
    {};

  const activeHost = currentStep.sourceHost || "10.0.2.45 (Workstation-302)";
  const currentStage = currentStep.stage || scenario.currentState || "Privilege Access";
  const technique = currentStep.techniqueName || "LSASS Memory Dump";
  const techniqueId = currentStep.techniqueId || "T1003.001";

  return (
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
      {/* Top Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
          CURRENT STATE
        </h2>
        <span className="font-mono text-[10px] font-bold text-accent bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
          NOW
        </span>
      </div>

      {/* Primary Value: Current Behaviour */}
      <div className="my-4">
        <div className="text-xl font-mono font-bold text-navy-800 dark:text-slate-100 leading-tight">
          {currentStage}
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
          [{techniqueId}] {technique}
        </div>
      </div>

      {/* Details: Compromised Host */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <span className="text-slate-400 dark:text-slate-500 text-[11px]">Compromised Host</span>
        <span className="font-bold text-navy-800 dark:text-slate-100">{activeHost}</span>
      </div>
    </div>
  );
}

