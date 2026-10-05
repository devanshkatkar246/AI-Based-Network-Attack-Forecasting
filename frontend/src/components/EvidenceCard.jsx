"use client";

import React from "react";
import { FileCode2 } from "lucide-react";

export default function EvidenceCard({ evidence }) {
  const items = evidence && evidence.length > 0 ? evidence : [
    {
      step: "01",
      category: "TEMPORAL SIGNAL",
      title: "Flow Telemetry Indicator",
      detail: "Active flow stream window evaluated for behavioural deviations.",
      time: "NOW",
      confidence: "HIGH"
    }
  ];

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27303A] mb-4">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#6F95D6]" />
            <h3 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              SUPPORTING EVIDENCE
            </h3>
          </div>
          <span className="text-xs text-[#9AA6B2]">
            WHY DID THE MODEL FORECAST THIS?
          </span>
        </div>

        {/* Connected Visual Evidence Chain */}
        <div className="space-y-3 my-2">
          {items.map((item, idx, arr) => (
            <div key={idx} className="relative">
              <div className="p-3 bg-[#19202A] border border-[#27303A] hover:border-[#6F95D6]/60 rounded-lg flex items-start gap-3 transition-colors">
                <div className="w-6 h-6 rounded-full bg-[#1E2632] border border-[#6F95D6] text-[#6F95D6] flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                  {item.step || idx + 1}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#6F95D6] uppercase tracking-wider text-[10px] font-mono">{item.category || item.type || "SIGNAL"}</span>
                    <span className="text-[#6C7987] font-mono text-[11px]">{item.time || item.timestamp || "NOW"}</span>
                  </div>
                  <div className="text-xs font-bold text-[#E8EDF3] truncate">
                    {item.title || item.indicator || item.description}
                  </div>
                  <div className="text-xs text-[#9AA6B2] leading-relaxed">
                    {item.detail || item.details || item.indicator}
                  </div>
                </div>
              </div>

              {/* Vertical Connector */}
              {idx < arr.length - 1 && (
                <div className="w-full flex justify-center my-1">
                  <div className="w-0.5 h-3 bg-[#27303A]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-4 border-t border-[#27303A] flex items-center justify-between text-xs text-[#6C7987]">
        <span>Mapped to Temporal Network Graph Signals</span>
        <span className="text-[#6F95D6] font-semibold font-mono text-[11px]">REPLAY OBSERVED</span>
      </div>
    </div>
  );
}

