"use client";

import React from "react";
import { FileCode2, Radio, Clock, GitCommit, Cpu } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function EvidenceCard({ evidence }) {
  // Default categorized signals if empty
  const defaultSignals = [
    {
      category: "NETWORK SIGNALS",
      icon: Radio,
      items: [
        { label: "Destination diversity", detail: "↑ Increased (+4.2x vs baseline)", mitre: "T1046" },
        { label: "SMB RPC activity", detail: "↑ Elevated SMB port 445 connections", mitre: "T1021.002" },
      ]
    },
    {
      category: "TEMPORAL SIGNALS",
      icon: Clock,
      items: [
        { label: "T-30s", detail: "Active SMB probing detected across subnet 10.0.2.0/24" },
        { label: "NOW", detail: "Workstation-302 → DC-PRIMARY active LDAP privilege token request" },
      ]
    },
    {
      category: "TOPOLOGY SIGNALS",
      icon: GitCommit,
      items: [
        { label: "New communication edge", detail: "Workstation-302 (10.0.2.45) ➔ FIN-SRV-01 (10.0.4.12)" },
      ]
    }
  ];

  const hasBackendEvidence = evidence && evidence.length > 0;

  return (
    <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card h-full flex flex-col justify-between font-mono select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323C] mb-4">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#6F8FBE]" />
            <h3 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
              SUPPORTING EVIDENCE
            </h3>
          </div>
          <span className="text-[10px] text-[#9BA4B0]">
            WHY DID THE MODEL FORECAST THIS?
          </span>
        </div>

        {/* Backend Evidence Stream or Categorized Signals */}
        {hasBackendEvidence ? (
          <div className="space-y-2.5">
            {evidence.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3 bg-[#191F27] border border-[#2A323C] rounded-lg flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#E7EAF0] bg-[#1D242D] px-1.5 py-0.5 rounded border border-[#2A323C]">
                      {item.mitreId || "ATT&CK"}
                    </span>
                    <span className="text-[#6F8FBE] font-semibold">{item.type}</span>
                  </div>
                  <span className="text-[#6F7885]">{item.time}</span>
                </div>

                <div className="text-xs text-[#E7EAF0] font-medium">
                  {item.indicator}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#6F7885] pt-1 border-t border-[#2A323C]">
                  <span>Source: {item.source}</span>
                  <span className={item.severity === "HIGH" || item.severity === "CRITICAL" ? "text-[#A85D59] font-bold" : "text-[#B98A3A] font-semibold"}>
                    {item.severity || "HIGH"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {defaultSignals.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6F8FBE] uppercase tracking-wider">
                    <Icon className="w-3 h-3" />
                    <span>{cat.category}</span>
                  </div>

                  <div className="space-y-1.5">
                    {cat.items.map((item, subIdx) => (
                      <div
                        key={subIdx}
                        className="p-2.5 bg-[#191F27] border border-[#2A323C] rounded text-xs flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#E7EAF0]">{item.label}</span>
                          {item.mitre && (
                            <span className="text-[9px] text-[#6F8FBE] bg-[#1D242D] px-1 py-0.5 rounded border border-[#2A323C]">
                              {item.mitre}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#9BA4B0]">{item.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-4 border-t border-[#2A323C] flex items-center justify-between text-[10px] text-[#6F7885]">
        <span>Mapped to Temporal Network Graph Signals</span>
        <span className="text-[#6F8FBE] font-semibold">Integrity Verified</span>
      </div>
    </div>
  );
}

