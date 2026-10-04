"use client";

import React from "react";
import Link from "next/link";
import { Sliders, ArrowRight, ShieldCheck } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function DefenderInterventionCard({ scenario }) {
  const recommendedAction = scenario?.warningWindow?.recommendedAction || "Isolate Host 10.0.2.45 & Block SMB Port 445";

  return (
    <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card font-mono select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Story & Context */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#6F8FBE]" />
            <h3 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
              DEFENDER INTERVENTION / WHAT-IF
            </h3>
            <StatusBadge status="FORECAST" size="sm" customLabel="COUNTERFACTUAL SIMULATION" />
          </div>
          <p className="text-xs text-[#9BA4B0] leading-relaxed">
            "How might the projected attack trajectory change if we intervene now?"
          </p>
          <div className="flex items-center gap-4 text-[11px] pt-1 text-[#6F7885]">
            <span>
              Baseline projection: <strong className="text-[#A85D59]">FIN-SRV-01 Compromise (+30s)</strong>
            </span>
            <span>|</span>
            <span>
              Intervention-conditioned projection: <strong className="text-[#668B73]">Attack Vector Severed</strong>
            </span>
          </div>
        </div>

        {/* Right Side: Action Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/what-if"
            className="px-4 py-2.5 rounded bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] font-mono text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <span>SIMULATE INTERVENTION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
