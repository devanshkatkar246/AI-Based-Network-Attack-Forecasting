"use client";

import React from "react";
import { ShieldAlert, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function AttackInterpretationCard({ scenario }) {
  const currentStep = scenario?.trajectory?.find((s) => s.isCurrent || s.status === "CURRENT") || scenario?.trajectory?.[1] || {};
  const forecastStep = scenario?.trajectory?.find((s) => s.status === "FORECAST" || s.semanticState === "forecast") || scenario?.trajectory?.[3] || {};

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27303A] mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#6F95D6]" />
            <h3 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              BEHAVIOURAL INTERPRETATION
            </h3>
          </div>
          <span className="text-xs text-[#9AA6B2] font-mono">MITRE ATT&CK</span>
        </div>

        {/* Mapped Behaviors */}
        <div className="space-y-3">
          {/* Observed Stage */}
          <div className="p-3 bg-[#19202A] border border-[#27303A] rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#9AA6B2] font-bold">OBSERVED BEHAVIOUR</span>
              <StatusBadge status="OBSERVED" size="sm" />
            </div>
            <div className="text-sm font-bold text-[#E8EDF3]">
              {currentStep.stage || "Baseline"}
            </div>
            <div className="text-xs font-mono text-[#6F95D6]">
              {currentStep.techniqueId ? `[${currentStep.techniqueId}] ${currentStep.techniqueName || ""}` : "No ATT&CK technique assigned (Baseline/Normal)"}
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-center text-[#6C7987] text-xs">
            <span>↓</span>
          </div>

          {/* Forecast Stage */}
          <div className="p-3 bg-[#19202A] border border-[#6F95D6]/40 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#6F95D6] font-bold">FORECAST BEHAVIOUR</span>
              <StatusBadge status="FORECAST" size="sm" />
            </div>
            <div className="text-sm font-bold text-[#6F95D6]">
              {forecastStep.stage || "Standby"}
            </div>
            <div className="text-xs text-[#E8EDF3]">
              {forecastStep.techniqueId ? (
                <span>
                  <span className="font-mono text-[#9AA6B2]">[{forecastStep.techniqueId}]</span> {forecastStep.techniqueName || ""}
                </span>
              ) : (
                forecastStep.techniqueName || "Modelled State Transition"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Epistemic Notice */}
      <div className="pt-3 mt-4 border-t border-[#27303A] text-[11px] text-[#6C7987]">
        MITRE ATT&CK taxonomy standardizes observed vs predicted adversary tactics.
      </div>
    </div>
  );
}
