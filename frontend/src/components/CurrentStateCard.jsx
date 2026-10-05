"use client";

import React from "react";
import StatusBadge from "./StatusBadge";

export default function CurrentStateCard({ scenario }) {
  if (!scenario) return null;

  // Extract current step from trajectory
  const currentStep =
    scenario.trajectory?.find((step) => step.isCurrent || step.status === "CURRENT" || step.semanticState === "current") ||
    scenario.trajectory?.[0] ||
    {};

  const activeHost = currentStep.sourceHost || "Monitored Host";
  const currentStage = currentStep.stage || scenario.currentState || "Baseline";
  const technique = currentStep.techniqueName;
  const techniqueId = currentStep.techniqueId;
  const telemetry = scenario.telemetry || {};

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27303A]">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#9AA6B2]">
          CURRENT NETWORK STATE
        </h2>
        <div className="flex items-center gap-2">
          {scenario.verificationStatus?.isVerified ? (
            <StatusBadge status="ACTUAL" size="sm" customLabel="✓ FORECAST VERIFIED" />
          ) : (
            <StatusBadge status="CURRENT" size="sm" customLabel="NOW" />
          )}
        </div>
      </div>

      {/* Primary Value: Current Behaviour */}
      <div className="my-3">
        <div className="text-2xl font-bold text-[#E8EDF3] leading-tight tracking-tight">
          {currentStage}
        </div>
        <div className="text-xs text-[#9AA6B2] mt-1 font-medium">
          {techniqueId ? (
            <span>
              <span className="font-mono text-[#9AA6B2]">[{techniqueId}]</span> {technique || ""}
            </span>
          ) : (
            "Empirically Observed Telemetry Window"
          )}
        </div>
        <div className="text-xs mt-3 flex items-center justify-between bg-[#19202A] p-2.5 rounded-lg border border-[#27303A]">
          <span className="text-[#9AA6B2]">Active Host:</span>
          <span className="font-bold font-mono text-[#E8EDF3] truncate max-w-[200px] text-[11px]">{activeHost}</span>
        </div>
      </div>

      {/* Metrics Row: Active Flows, New Edges, East-West Traffic */}
      <div className="pt-3 border-t border-[#27303A] text-xs text-[#9AA6B2] space-y-1.5 font-mono">
        <div className="flex justify-between">
          <span>Active Flows: <strong className="text-[#E8EDF3]">{telemetry.activeFlows ?? 0}</strong></span>
          <span>Active Hosts: <strong className="text-[#6F95D6]">{telemetry.activeHosts ?? 0}</strong></span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span>Network State: <strong className="text-[#C59A45]">{telemetry.networkState || "BASELINE"}</strong></span>
          <span>Anomaly Status: <strong className="text-[#6F95D6]">{telemetry.anomalyIndex || "Baseline"}</strong></span>
        </div>
      </div>
    </div>
  );
}



