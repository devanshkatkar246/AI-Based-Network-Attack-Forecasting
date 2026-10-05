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
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#27303A] mb-4 gap-2">
        <div>
          <h2 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
            WHY THIS FORECAST?
          </h2>
          <p className="text-xs text-[#9AA6B2] mt-0.5">
            Network signals + temporal sequence + topology evidence
          </p>
        </div>
        <span className="text-xs text-[#9AA6B2] uppercase font-mono">
          EXPLAINABLE AI EVIDENCE
        </span>
      </div>

      {/* 3 Evidence Group Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* COLUMN 01: NETWORK SIGNALS */}
        <div className="bg-[#11161D] p-4 rounded-lg border border-[#27303A] h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#27303A] text-xs font-bold text-[#6F95D6] font-mono">
              <Sliders className="w-3.5 h-3.5 text-[#6F95D6]" />
              <span>01 NETWORK SIGNALS</span>
            </div>

            <div className="space-y-3 text-xs">
              {signalsToRender.map((item, idx) => (
                <div key={idx} className="pb-2 border-b border-[#27303A] last:border-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#E8EDF3] text-xs truncate">{item.feature}</span>
                    <span className="text-[11px] font-mono font-semibold text-[#6F95D6]">{item.trend}</span>
                  </div>
                  <div className="text-xs text-[#9AA6B2]">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 02: TEMPORAL STREAM */}
        <div className="bg-[#11161D] p-4 rounded-lg border border-[#27303A] h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#27303A] text-xs font-bold text-[#6F95D6] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#6F95D6]" />
              <span>02 TEMPORAL STREAM</span>
            </div>

            <div className="space-y-3 relative pl-3 border-l border-[#27303A] text-xs">
              {timelineToRender.map((item, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`w-2 h-2 rounded-full absolute -left-[17px] top-1 ${
                      item.status === "CURRENT" ? "bg-[#6F95D6] ring-2 ring-[#6F95D6]/30" : "bg-[#6C7987]"
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className={`font-mono ${item.status === "CURRENT" ? "text-[#6F95D6]" : "text-[#E8EDF3]"}`}>{item.time}:</span>
                      <span className="text-[#E8EDF3]">{item.stage}</span>
                    </div>
                    <div className="text-xs text-[#9AA6B2] mt-0.5 leading-snug">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 03: TOPOLOGY EVIDENCE */}
        <div className="bg-[#11161D] p-4 rounded-lg border border-[#27303A] h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#27303A] text-xs font-bold text-[#6F95D6] font-mono">
              <Network className="w-3.5 h-3.5 text-[#6F95D6]" />
              <span>03 TOPOLOGY EVIDENCE</span>
            </div>

            <div className="space-y-3 text-xs pt-0.5">
              {topologyEvidence?.nodes && topologyEvidence.nodes.length >= 2 ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#E8EDF3] text-xs font-mono">{topologyEvidence.nodes[0].label || topologyEvidence.nodes[0].ip}</div>
                      <div className="text-xs text-[#9AA6B2] font-mono">{topologyEvidence.nodes[0].ip} (Active Source)</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#C59A45] font-bold">SOURCE NODE</span>
                  </div>

                  <div className="flex items-center gap-1.5 py-1.5 px-2 bg-[#151B23] border border-[#27303A] rounded text-[10px] text-[#6F95D6] font-mono font-bold">
                    <span>{topologyEvidence.edgeLabel || "COMMUNICATION EDGE"}</span>
                    <ArrowRight className="w-3 h-3 text-[#6F95D6]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#E8EDF3] text-xs font-mono">{topologyEvidence.nodes[1].label || topologyEvidence.nodes[1].ip}</div>
                      <div className="text-xs text-[#9AA6B2] font-mono">{topologyEvidence.nodes[1].ip} (Projected Target)</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#6F95D6] font-bold">TARGET NODE</span>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-[#151B23] border border-[#27303A] rounded text-xs text-[#9AA6B2]">
                  Topology graph nodes and communication edges extracted from current temporal slice.
                </div>
              )}

              <div className="pt-2 border-t border-[#27303A] text-xs text-[#9AA6B2]">
                Active communication flows observed across monitored internal subnets.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

