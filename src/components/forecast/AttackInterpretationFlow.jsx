"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

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
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider">
            ATT&CK BEHAVIOURAL INTERPRETATION
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Observed telemetry → Inferred ATT&CK Technique → Tactic classification
          </p>
        </div>
      </div>

      {/* Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {flowsToRender.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-lg flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
                Observed Telemetry
              </div>
              <div className="font-semibold text-navy-800 dark:text-slate-200 text-[11px]">
                {item.observed}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="font-bold text-forecast">{item.technique}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="font-bold text-navy-800 dark:text-slate-100">{item.tactic}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

