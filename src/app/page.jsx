"use client";

import React from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import TelemetryStrip from "@/components/TelemetryStrip";
import AttackTrajectory from "@/components/AttackTrajectory";
import WarningWindowCard from "@/components/WarningWindowCard";
import LikelihoodChart from "@/components/LikelihoodChart";
import TopologyMap from "@/components/TopologyMap";
import { SCENARIOS } from "@/data/mockData";
import { Sliders, ArrowRight } from "lucide-react";

function CommandCenterContent({ activeScenario }) {
  const scenario = activeScenario || SCENARIOS[0];

  return (
    <div className="space-y-6">
      {/* 1. Compact Telemetry Strip */}
      <TelemetryStrip telemetry={scenario.telemetry} />

      {/* 2. Hero Row: Attack Trajectory (2/3) + Warning Window (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <AttackTrajectory trajectory={scenario.trajectory} />
        </div>
        <div className="lg:col-span-1">
          <WarningWindowCard warningWindow={scenario.warningWindow} />
        </div>
      </div>

      {/* 3. Second Row: Attack Likelihood (1/2) + Network Topology (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <LikelihoodChart data={scenario.likelihoodOverTime} />
        <TopologyMap topology={scenario.topology} />
      </div>

      {/* 4. Bottom CTA: Simulate an Intervention */}
      <div className="bg-surface border border-slate-200/90 rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy-800 text-white flex items-center justify-center font-mono">
            <Sliders className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy-800 font-mono uppercase">
              Defender Intervention Evaluator
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Evaluate counterfactual defense actions to truncate projected attack trajectories.
            </div>
          </div>
        </div>

        <Link
          href="/what-if"
          className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <span>Simulate Intervention</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent" />
        </Link>
      </div>
    </div>
  );
}

export default function CommandCenterPage() {
  return (
    <AppShell title="Command Center">
      {({ activeScenario }) => <CommandCenterContent activeScenario={activeScenario} />}
    </AppShell>
  );
}
