"use client";

import React from "react";
import { useReplay } from "@/context/ReplayContext";
import { CheckCircle2, FileText } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ForecastResultNarrative({ scenario }) {
  let tickIndex = 2;
  try {
    const replay = useReplay();
    if (replay && typeof replay.currentTickIndex === "number") {
      tickIndex = replay.currentTickIndex;
    }
  } catch (e) {
    tickIndex = 2;
  }

  const isBeforeForecast = tickIndex < 2;
  const isAtCurrent = tickIndex === 2;

  // Extract canonical details from scenario
  const compromisedHost = scenario?.trajectory?.[2]?.sourceHost || "Workstation-302 (10.0.2.45)";
  const targetAsset = scenario?.warningWindow?.targetAsset || "FIN-SRV-01 (10.0.4.12)";
  const primaryTechnique = scenario?.warningWindow?.predictedBehavior || "Lateral Movement";

  if (isBeforeForecast) {
    return (
      <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card font-mono text-xs select-none">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#2A323C] mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6F7885]" />
            <h3 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
              FORECAST SUMMARY
            </h3>
          </div>
          <span className="text-[10px] text-[#6F7885] uppercase">
            AWAITING CURRENT STATE
          </span>
        </div>
        <p className="text-[#9BA4B0] leading-relaxed">
          Replay is currently prior to the forecast boundary. Advance replay to{" "}
          <strong className="text-[#E7EAF0]">CURRENT (Privilege Access / NOW)</strong> to inspect the projected attack trajectory.
        </p>
      </div>
    );
  }

  if (isAtCurrent) {
    return (
      <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card font-mono text-xs select-none">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#2A323C] mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6F8FBE]" />
            <h3 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
              FORECAST SUMMARY
            </h3>
          </div>
          <StatusBadge status="FORECAST" size="sm" customLabel="MODEL FORECAST ACTIVE" />
        </div>
        <p className="text-[#E7EAF0] leading-relaxed">
          Prior to current state, network telemetry showed progression from reconnaissance to domain account discovery, culminating in privilege-access activity on{" "}
          <strong className="text-[#6F8FBE]">{compromisedHost}</strong>. Based on this temporal progression, the system projects {primaryTechnique.toLowerCase()} toward{" "}
          <strong className="text-[#6F8FBE]">{targetAsset}</strong> via SMB/PsExec at +30s, followed by command-and-control beaconing at +60s.
        </p>
      </div>
    );
  }

  // ACTUAL FUTURE REVEALED
  return (
    <div className="bg-[#151A21] border border-[#668B73]/40 rounded-xl p-5 shadow-card font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#2A323C] mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#668B73]" />
          <h3 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
            FORECAST RESULT
          </h3>
        </div>
        <StatusBadge status="ACTUAL" size="sm" customLabel="FORECAST → ACTUAL" />
      </div>
      <p className="text-[#E7EAF0] leading-relaxed mb-3">
        Prior to the forecast point, the network progressed from reconnaissance through discovery to privilege-access activity on{" "}
        <strong className="text-[#E7EAF0]">{compromisedHost}</strong>. Based on this temporal progression, the system projected {primaryTechnique.toLowerCase()} toward{" "}
        <strong className="text-[#E7EAF0]">{targetAsset}</strong> via SMB/PsExec at +30s. Replay reveals the corresponding {primaryTechnique.toLowerCase()} event on {targetAsset}, matching the projected trajectory.
      </p>
      <div className="pt-2.5 border-t border-[#2A323C] flex items-center justify-between text-[11px] text-[#9BA4B0]">
        <span className="flex items-center gap-1.5">
          <strong className="text-[#668B73]">FORECAST → ACTUAL:</strong>
          <span>{primaryTechnique} forecast at +30s; corresponding ground-truth event observed in replay.</span>
        </span>
        <span className="text-[#668B73] font-bold text-[10px] uppercase tracking-wider">REPLAY VERIFIED</span>
      </div>
    </div>
  );
}


