"use client";

import React from "react";
import { Sliders, Clock, Network, ArrowRight } from "lucide-react";

export default function ForecastEvidenceSection({
  featureSignals,
  temporalEvidence,
  topologyEvidence,
}) {
  const defaultSignals = [
    { feature: "SMB Port 445 Flow Burst", trend: "↑ Increased", detail: "+340% flow burst rate" },
    { feature: "Destination IP Diversity", trend: "↑ Expanded", detail: "Subnet -> DC-PRIMARY" },
    { feature: "Inter-Arrival Time Variance", trend: "↓ Decreased", detail: "Periodic automated burst" },
    { feature: "TCP SYN Probing Sweep", trend: "↑ Spike", detail: "Port scan across 10.0.2.0/24" }
  ];

  const signalsToRender = featureSignals?.length
    ? featureSignals.map((s) => ({
        feature: s.feature,
        trend: s.weight > 20 ? "↑ Increased" : "→ Elevated",
        detail: `Relative weight: ${s.weight}%`,
      }))
    : defaultSignals;

  const defaultTimeline = [
    { time: "T-90s", stage: "Reconnaissance", label: "Port probing targeting SMB/RPC across 10.0.2.0/24", status: "OBSERVED" },
    { time: "T-45s", stage: "Discovery", label: "LDAP domain admin account enumeration to DC-PRIMARY", status: "OBSERVED" },
    { time: "NOW", stage: "Privilege Access", label: "LSASS process memory dump handle open detected", status: "CURRENT" }
  ];

  const timelineToRender = temporalEvidence?.length
    ? temporalEvidence.map((t) => ({
        time: t.time,
        stage: t.time === "NOW" ? "Privilege Access" : t.time === "T-40s" ? "Reconnaissance" : "Discovery",
        label: t.label,
        status: t.time === "NOW" ? "CURRENT" : "OBSERVED"
      }))
    : defaultTimeline;

  return (
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider font-mono">
            WHY DID THE SYSTEM FORECAST: LATERAL MOVEMENT?
          </h2>
          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
            Network signals, temporal sequence, and topology path preceding forecast
          </p>
        </div>
        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
          SCENARIO EVIDENCE
        </span>
      </div>

      {/* 3 Evidence Group Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* GROUP 1: NETWORK / FEATURE SIGNALS */}
        <div>
          <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-slate-100 dark:border-slate-800 font-mono text-xs font-bold text-navy-800 dark:text-slate-100">
            <Sliders className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>1. NETWORK SIGNALS</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {signalsToRender.map((item, idx) => (
              <div key={idx} className="pb-2 border-b border-slate-100 dark:border-slate-800/80 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-800 dark:text-slate-200 text-[11px] truncate">{item.feature}</span>
                  <span className="text-[10px] font-semibold text-accent">{item.trend}</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* GROUP 2: TEMPORAL FORENSIC TIMELINE */}
        <div>
          <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-slate-100 dark:border-slate-800 font-mono text-xs font-bold text-navy-800 dark:text-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>2. TEMPORAL STREAM</span>
          </div>

          <div className="space-y-3 font-mono text-xs relative pl-3 border-l border-slate-200 dark:border-slate-800">
            {timelineToRender.map((item, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`w-2 h-2 rounded-full absolute -left-[16px] top-1 ${
                    item.status === "CURRENT" ? "bg-accent ring-2 ring-accent/30" : "bg-slate-400 dark:bg-slate-600"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span className={item.status === "CURRENT" ? "text-accent" : "text-navy-800 dark:text-slate-200"}>{item.time}:</span>
                    <span className="text-slate-800 dark:text-slate-200">{item.stage}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GROUP 3: TOPOLOGY EDGE EVIDENCE */}
        <div>
          <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-slate-100 dark:border-slate-800 font-mono text-xs font-bold text-navy-800 dark:text-slate-100">
            <Network className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>3. TOPOLOGY EDGE</span>
          </div>

          <div className="space-y-3 font-mono text-xs pt-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-navy-800 dark:text-slate-200 text-[11px]">Workstation-302</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">10.0.2.45 (Compromised)</div>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">INFECTED</span>
            </div>

            <div className="flex items-center gap-1.5 py-1 text-[10px] text-slate-500 dark:text-slate-400 font-bold border-y border-slate-100 dark:border-slate-800">
              <span>OBSERVED FLOW BURST</span>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-navy-800 dark:text-slate-200 text-[11px]">FIN-SRV-01</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">10.0.4.12 (Target)</div>
              </div>
              <span className="text-[10px] text-forecast font-bold">TARGET</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

