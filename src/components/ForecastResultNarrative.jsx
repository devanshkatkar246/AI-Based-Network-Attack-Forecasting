"use client";

import React from "react";
import { useReplay } from "@/context/ReplayContext";
import { CheckCircle2, FileText } from "lucide-react";

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
  const isActualRevealed = tickIndex >= 3;

  // Extract canonical details from scenario
  const compromisedHost = scenario?.trajectory?.[2]?.sourceHost || "Workstation-302 (10.0.2.45)";
  const targetAsset = scenario?.nextLikelyBehaviour?.targetAsset || "FIN-SRV-01 (10.0.4.12)";
  const primaryTechnique = scenario?.nextLikelyBehaviour?.behaviour || "Lateral Movement";

  if (isBeforeForecast) {
    return (
      <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm font-mono text-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <h3 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider">
              FORECAST SUMMARY
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase">
            AWAITING CURRENT STATE
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          Replay is currently prior to the forecast boundary. Advance replay to{" "}
          <strong className="text-navy-800 dark:text-slate-100 font-bold">CURRENT (Privilege Access)</strong> to generate and inspect the projected attack trajectory.
        </p>
      </div>
    );
  }

  if (isAtCurrent) {
    return (
      <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm font-mono text-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider">
              FORECAST SUMMARY
            </h3>
          </div>
          <span className="text-[10px] text-accent font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded uppercase">
            STATE S_T FORECAST
          </span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Prior to the current state, network telemetry showed a progression from reconnaissance to domain account discovery, culminating in privilege-access activity on{" "}
          <strong className="text-navy-800 dark:text-slate-100">{compromisedHost}</strong>. Based on this temporal progression, the system projected {primaryTechnique.toLowerCase()} toward{" "}
          <strong className="text-navy-800 dark:text-slate-100">{targetAsset}</strong> via SMB/PsExec at +30s, followed by command-and-control beaconing at the subsequent +60s horizon.
        </p>
      </div>
    );
  }

  // STATE 3: ACTUAL FUTURE REVEALED (tickIndex >= 3)
  return (
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm font-mono text-xs">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider">
            FORECAST RESULT
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>FORECAST → ACTUAL</span>
        </div>
      </div>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
        Prior to the forecast point, the network progressed from reconnaissance through discovery to privilege-access activity on{" "}
        <strong className="text-navy-800 dark:text-slate-100">{compromisedHost}</strong>. Based on this temporal progression, the system projected {primaryTechnique.toLowerCase()} toward{" "}
        <strong className="text-navy-800 dark:text-slate-100">{targetAsset}</strong> via SMB/PsExec at +30s. The subsequent replay revealed the corresponding {primaryTechnique.toLowerCase()} event on {targetAsset}, followed by command-and-control activity at +60s, matching the projected attack trajectory.
      </p>
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <strong className="text-navy-800 dark:text-slate-200">FORECAST → ACTUAL:</strong>
          <span>{primaryTechnique} forecast at +30s; corresponding event observed in replay.</span>
        </span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">REPLAY VERIFIED</span>
      </div>
    </div>
  );
}
