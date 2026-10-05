"use client";

import React from "react";
import Link from "next/link";
import { Sliders, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function DefenderInterventionCard({ scenario }) {
  const targetLabel = scenario?.warningWindow?.targetAsset || "Target Host";
  const predBehavior = scenario?.warningWindow?.predictedBehavior || "Attack Progression";

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Story & Context */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#6F95D6]" />
            <h3 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              DEFENDER INTERVENTION / WHAT-IF
            </h3>
            <StatusBadge status="FORECAST" size="sm" customLabel="COUNTERFACTUAL SIMULATION" />
          </div>
          <p className="text-xs text-[#9AA6B2] leading-relaxed">
            "How might the projected attack trajectory change if we intervene now?"
          </p>
          <div className="flex items-center gap-4 text-xs pt-1 text-[#6C7987]">
            <span>
              Baseline projection: <strong className="text-[#B85C5C] font-semibold">{targetLabel} — {predBehavior} (+30s)</strong>
            </span>
            <span>|</span>
            <span>
              Intervention-conditioned projection: <strong className="text-[#659477] font-semibold">Attack Vector Severed</strong>
            </span>
          </div>
        </div>

        {/* Right Side: Action Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/what-if"
            className="px-4 py-2.5 rounded-lg bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14] font-semibold text-xs transition-colors inline-flex items-center gap-2"
          >
            <span>SIMULATE INTERVENTION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

