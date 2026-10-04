"use client";

import React from "react";
import StatusBadge from "./StatusBadge";

export default function CurrentStateCard({ scenario }) {
  if (!scenario) return null;

  // Extract current step from trajectory
  const currentStep =
    scenario.trajectory?.find((step) => step.isCurrent || step.status === "CURRENT" || step.semanticState === "current") ||
    scenario.trajectory?.[2] ||
    {};

  const activeHost = currentStep.sourceHost || "10.0.2.45 (Workstation-302)";
  const currentStage = currentStep.stage || scenario.currentState || "Privilege Access";
  const technique = currentStep.techniqueName || "LSASS Memory Dump";
  const techniqueId = currentStep.techniqueId || "T1003.001";
  const telemetry = scenario.telemetry || {};

  return (
    <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A323C]">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#9BA4B0]">
          CURRENT NETWORK STATE
        </h2>
        <StatusBadge status="CURRENT" size="sm" customLabel="NOW" />
      </div>

      {/* Primary Value: Current Behaviour */}
      <div className="my-3">
        <div className="text-lg font-mono font-bold text-[#E7EAF0] leading-tight">
          {currentStage}
        </div>
        <div className="text-xs font-mono text-[#9BA4B0] mt-1">
          [{techniqueId}] {technique}
        </div>
        <div className="text-[11px] font-mono text-[#9BA4B0] mt-2.5 flex items-center justify-between bg-[#191F27] p-2 rounded border border-[#2A323C]">
          <span>Compromised Host:</span>
          <span className="font-bold text-[#E7EAF0]">{activeHost}</span>
        </div>
      </div>

      {/* Metrics Row: Active Flows, New Edges, East-West Traffic */}
      <div className="pt-3 border-t border-[#2A323C] font-mono text-[11px] text-[#9BA4B0] space-y-1.5">
        <div className="flex justify-between">
          <span>Active Flows: <strong className="text-[#E7EAF0]">{telemetry.activeFlows || "8.4k"}</strong></span>
          <span>New Edges: <strong className="text-[#6F8FBE]">{telemetry.newEdges || 17}</strong></span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>East-West Activity: <strong className="text-[#B98A3A]">{telemetry.networkState || "ELEVATED"}</strong></span>
          <span>Anomaly Index: <strong className="text-[#6F8FBE]">{telemetry.anomalyIndex || "Elevated (+34%)"}</strong></span>
        </div>
      </div>
    </div>
  );
}



