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
    <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-5 shadow-card font-mono text-xs select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase tracking-wider">
            ATT&CK BEHAVIOURAL INTERPRETATION
          </h2>
          <p className="text-[11px] text-[#5F6268] dark:text-[#8B8D91] mt-0.5">
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
            className="p-3.5 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#8B8D91]">
                  Observed Telemetry
                </span>
                <span className="text-[9px] font-bold text-[#5F6268] bg-[#EFECE4] px-1.5 py-0.2 rounded">
                  OBSERVED
                </span>
              </div>
              <div className="font-semibold text-[#17191C] dark:text-[#F7F5EE] text-[11px]">
                {item.observed}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E1D8] dark:border-[#2B2E33] flex items-center justify-between text-[11px]">
              <div>
                <div className="text-[9px] text-[#314B78] dark:text-[#9AB0D3] font-bold uppercase">MODEL-INFERRED TECHNIQUE</div>
                <div className="font-bold text-[#314B78] dark:text-[#9AB0D3]">{item.technique}</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8B8D91] flex-shrink-0 mx-1" />
              <div className="text-right">
                <div className="text-[9px] text-[#5F6268] font-bold uppercase">TACTIC</div>
                <div className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{item.tactic}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


