"use client";

import React from "react";
import { Sliders, Clock, Network, ArrowRight } from "lucide-react";

export default function ForecastEvidenceSection({
  featureSignals,
  temporalEvidence,
  topologyEvidence,
}) {
  const defaultSignals = [
    { feature: "Destination Diversity", trend: "↑ High Variance", detail: "Multi-subnet target fan-out" },
    { feature: "TCP SYN Sweep Rate", trend: "↑ Burst", detail: "Sequential port probing" },
    { feature: "SMB Port 445 Activity", trend: "↑ Spike", detail: "+340% flow burst rate" },
    { feature: "Inter-Arrival Time (IAT)", trend: "↓ Decreased", detail: "Automated sequence timing" }
  ];

  const signalsToRender = featureSignals?.length
    ? featureSignals.map((s) => ({
        feature: s.feature,
        trend: s.weight > 20 ? "↑ Increased" : "→ Elevated",
        detail: `Relative weight: ${s.weight}%`,
      }))
    : defaultSignals;

  const defaultTimeline = [
    { time: "T-90s", stage: "Discovery / Probing", label: "Port scan activity targeting SMB/RPC across subnet", status: "OBSERVED" },
    { time: "T-45s", stage: "Account Enumeration", label: "LDAP domain admin privilege queries to DC-PRIMARY", status: "OBSERVED" },
    { time: "NOW", stage: "Privilege-Related Behaviour", label: "LSASS process memory handle access on Workstation-302", status: "CURRENT" }
  ];

  const timelineToRender = temporalEvidence?.length
    ? temporalEvidence.map((t) => ({
        time: t.time === "T-40s" ? "T-45s" : t.time,
        stage: t.time === "NOW" ? "Privilege-Related Behaviour" : t.time === "T-40s" || t.time === "T-90s" ? "Discovery / Probing" : "Account Enumeration",
        label: t.label,
        status: t.time === "NOW" ? "CURRENT" : "OBSERVED"
      }))
    : defaultTimeline;

  return (
    <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-5 shadow-card h-full flex flex-col justify-between font-mono select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase tracking-wider">
            WHY THIS FORECAST?
          </h2>
          <p className="text-[11px] text-[#5F6268] dark:text-[#8B8D91] mt-0.5">
            Network signals + temporal sequence + topology evidence
          </p>
        </div>
        <span className="text-[10px] text-[#8B8D91] uppercase font-semibold">
          EXPLAINABLE AI EVIDENCE
        </span>
      </div>

      {/* 3 Evidence Group Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* COLUMN 01: NETWORK SIGNALS */}
        <div className="bg-[#FBFAF6] dark:bg-[#17191C] p-3.5 rounded-lg border border-[#E5E1D8] dark:border-[#2B2E33] h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#E5E1D8] dark:border-[#2B2E33] text-xs font-bold text-[#314B78] dark:text-[#9AB0D3]">
              <Sliders className="w-3.5 h-3.5 text-[#314B78]" />
              <span>01 NETWORK SIGNALS</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {signalsToRender.map((item, idx) => (
                <div key={idx} className="pb-2 border-b border-[#E5E1D8]/60 dark:border-[#2B2E33] last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#17191C] dark:text-[#F7F5EE] text-[11px] truncate">{item.feature}</span>
                    <span className="text-[10px] font-semibold text-[#314B78] dark:text-[#9AB0D3]">{item.trend}</span>
                  </div>
                  <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91] mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 02: TEMPORAL STREAM */}
        <div className="bg-[#FBFAF6] dark:bg-[#17191C] p-3.5 rounded-lg border border-[#E5E1D8] dark:border-[#2B2E33] h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#E5E1D8] dark:border-[#2B2E33] text-xs font-bold text-[#314B78] dark:text-[#9AB0D3]">
              <Clock className="w-3.5 h-3.5 text-[#314B78]" />
              <span>02 TEMPORAL STREAM</span>
            </div>

            <div className="space-y-3 relative pl-3 border-l border-[#E5E1D8] dark:border-[#2B2E33] text-xs">
              {timelineToRender.map((item, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`w-2 h-2 rounded-full absolute -left-[17px] top-1 ${
                      item.status === "CURRENT" ? "bg-[#314B78] ring-2 ring-[#314B78]/30" : "bg-[#8B8D91]"
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[11px]">
                      <span className={item.status === "CURRENT" ? "text-[#314B78] dark:text-[#9AB0D3]" : "text-[#17191C] dark:text-[#F7F5EE]"}>{item.time}:</span>
                      <span className="text-[#17191C] dark:text-[#F7F5EE]">{item.stage}</span>
                    </div>
                    <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91] mt-0.5 leading-snug">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 03: TOPOLOGY EVIDENCE */}
        <div className="bg-[#FBFAF6] dark:bg-[#17191C] p-3.5 rounded-lg border border-[#E5E1D8] dark:border-[#2B2E33] h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#E5E1D8] dark:border-[#2B2E33] text-xs font-bold text-[#314B78] dark:text-[#9AB0D3]">
              <Network className="w-3.5 h-3.5 text-[#314B78]" />
              <span>03 TOPOLOGY EVIDENCE</span>
            </div>

            <div className="space-y-3 text-xs pt-0.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#17191C] dark:text-[#F7F5EE] text-[11px]">Workstation-302</div>
                  <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91]">10.0.2.45 (Compromised)</div>
                </div>
                <span className="text-[10px] text-[#B68432] font-bold">INFECTED NODE</span>
              </div>

              <div className="flex items-center gap-1.5 py-1.5 px-2 bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded text-[10px] text-[#314B78] dark:text-[#9AB0D3] font-bold">
                <span>NEW INTERNAL EDGE</span>
                <ArrowRight className="w-3 h-3 text-[#314B78]" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#17191C] dark:text-[#F7F5EE] text-[11px]">FIN-SRV-01</div>
                  <div className="text-[10px] text-[#5F6268] dark:text-[#8B8D91]">10.0.4.12 (Forecast Target)</div>
                </div>
                <span className="text-[10px] text-[#314B78] dark:text-[#9AB0D3] font-bold">TARGET NODE</span>
              </div>

              <div className="pt-2 border-t border-[#E5E1D8] dark:border-[#2B2E33] text-[10px] text-[#5F6268] dark:text-[#8B8D91]">
                Increased east-west communication detected between Workstation and Server subnets.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


