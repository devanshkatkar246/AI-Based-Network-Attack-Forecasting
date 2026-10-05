"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import StatusBadge from "../StatusBadge";

export default function AttackInterpretationFlow({ attackInterpretation }) {
  const defaultFlows = [
    {
      observed: "Port scanning activity across 10.0.2.0/24",
      technique: "Network Service Discovery (T1046)",
      tactic: "Discovery"
    },
    {
      observed: "SMB / RPC authentication burst to DC-PRIMARY",
      technique: "Remote Services (T1021.002)",
      tactic: "Lateral Movement"
    },
    {
      observed: "Periodic HTTPS beaconing to unapproved IP",
      technique: "Application Layer Protocol (T1071.001)",
      tactic: "Command & Control"
    }
  ];

  const flowsToRender = attackInterpretation?.length ? attackInterpretation : defaultFlows;

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#27303A] mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
            ATT&CK BEHAVIOURAL INTERPRETATION
          </h2>
          <p className="text-xs text-[#9AA6B2] mt-0.5">
            OBSERVED TELEMETRY → INFERRED BEHAVIOUR → ATT&CK TECHNIQUE → TACTIC
          </p>
        </div>
        <StatusBadge status="FORECAST" size="sm" customLabel="MODEL-INFERRED MAPPING" />
      </div>

      {/* Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {flowsToRender.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-[#11161D] border border-[#27303A] rounded-lg flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <span className="text-[10px] uppercase font-bold text-[#9AA6B2]">
                  Observed Telemetry
                </span>
                <span className="text-[9px] font-bold text-[#9AA6B2] bg-[#19202A] px-1.5 py-0.5 rounded border border-[#27303A]">
                  OBSERVED
                </span>
              </div>
              <div className="font-medium text-[#E8EDF3] text-xs">
                {item.observed}
              </div>
            </div>

            <div className="pt-2 border-t border-[#27303A] flex items-center justify-between text-xs">
              <div>
                <div className="text-[9px] text-[#6F95D6] font-mono font-bold uppercase">MODEL-INFERRED TECHNIQUE</div>
                <div className="font-bold text-[#6F95D6] text-xs font-mono">{item.technique}</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#6C7987] flex-shrink-0 mx-1" />
              <div className="text-right">
                <div className="text-[9px] text-[#9AA6B2] font-mono font-bold uppercase">TACTIC</div>
                <div className="font-bold text-[#E8EDF3] text-xs">{item.tactic}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
