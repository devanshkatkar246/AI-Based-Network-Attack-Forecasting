"use client";

import React from "react";
import { ShieldAlert, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function AttackInterpretationCard({ scenario }) {
  const currentStep = scenario?.trajectory?.find((s) => s.isCurrent || s.status === "CURRENT") || scenario?.trajectory?.[1] || {};
  const forecastStep = scenario?.trajectory?.find((s) => s.status === "FORECAST" || s.semanticState === "forecast") || scenario?.trajectory?.[3] || {};

  return (
    <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card h-full flex flex-col justify-between font-mono select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323C] mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#6F8FBE]" />
            <h3 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
              BEHAVIOURAL INTERPRETATION
            </h3>
          </div>
          <span className="text-[10px] text-[#9BA4B0]">MITRE ATT&CK</span>
        </div>

        {/* Mapped Behaviors */}
        <div className="space-y-3">
          {/* Observed Stage */}
          <div className="p-3 bg-[#191F27] border border-[#2A323C] rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#9BA4B0] font-bold">OBSERVED BEHAVIOUR</span>
              <StatusBadge status="OBSERVED" size="sm" />
            </div>
            <div className="text-xs font-bold text-[#E7EAF0]">
              {currentStep.stage || "Network Service Discovery"}
            </div>
            <div className="text-[11px] text-[#6F8FBE]">
              [{currentStep.techniqueId || "T1046"}] {currentStep.techniqueName || "Network Service Discovery"}
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-center text-[#6F7885] text-xs">
            <span>↓</span>
          </div>

          {/* Forecast Stage */}
          <div className="p-3 bg-[#192230] border border-[#718CB8]/40 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#718CB8] font-bold">FORECAST BEHAVIOUR</span>
              <StatusBadge status="FORECAST" size="sm" />
            </div>
            <div className="text-xs font-bold text-[#718CB8]">
              {forecastStep.stage || "SMB / Windows Admin Shares"}
            </div>
            <div className="text-[11px] text-[#E7EAF0]">
              [{forecastStep.techniqueId || "T1021.002"}] {forecastStep.techniqueName || "SMB/PsExec Execution"}
            </div>
          </div>
        </div>
      </div>

      {/* Epistemic Notice */}
      <div className="pt-3 mt-4 border-t border-[#2A323C] text-[10px] text-[#6F7885]">
        MITRE ATT&CK taxonomy provides standard taxonomy for observed and predicted states.
      </div>
    </div>
  );
}
