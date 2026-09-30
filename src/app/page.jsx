"use client";

import React from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import AttackTrajectory from "@/components/AttackTrajectory";
import CurrentStateCard from "@/components/CurrentStateCard";
import ForecastCard from "@/components/ForecastCard";
import WarningWindowCard from "@/components/WarningWindowCard";
import ForecastEvidenceSection from "@/components/forecast/ForecastEvidenceSection";
import AttackInterpretationFlow from "@/components/forecast/AttackInterpretationFlow";
import ForecastResultNarrative from "@/components/ForecastResultNarrative";
import TopologyMap from "@/components/TopologyMap";
import { SCENARIOS } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

function CommandCenterContent({ activeScenario }) {
  const scenario = activeScenario || SCENARIOS[0];

  return (
    <div className="space-y-8">
      {/* 1. VISUAL HERO: Dominant Attack Trajectory Bar */}
      <div className="w-full">
        <AttackTrajectory trajectory={scenario.trajectory} />
      </div>

      {/* 2. CORE OPERATIONAL TRIAD: Current State (1/3) + Model Forecast (1/3) + Warning Window (1/3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Q1. WHAT IS HAPPENING NOW? */}
        <CurrentStateCard scenario={scenario} />

        {/* Q2. WHAT DOES THE MODEL FORECAST NEXT? */}
        <ForecastCard scenario={scenario} />

        {/* Q3. HOW MUCH WARNING TIME IS AVAILABLE? */}
        <WarningWindowCard warningWindow={scenario.warningWindow} />
      </div>

      {/* 3. FORECAST SUMMARY / RESULT NARRATIVE */}
      <ForecastResultNarrative scenario={scenario} />

      {/* 4. WHY & TOPOLOGY ROW: Evidence Breakdown (1/2) + Network Topology Graph (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Q4. WHY IS THAT BEHAVIOUR BEING FORECAST? */}
        <ForecastEvidenceSection
          featureSignals={scenario.featureSignals}
          temporalEvidence={scenario.temporalEvidence}
          topologyEvidence={scenario.topologyEvidence}
        />

        {/* VISUAL COMMUNICATION GRAPH */}
        <TopologyMap topology={scenario.topology} />
      </div>

      {/* 4. MITRE ATT&CK BEHAVIOURAL INTERPRETATION FLOW */}
      <AttackInterpretationFlow
        attackInterpretation={scenario.attackInterpretation}
      />

      {/* 5. DEFENDER INTERVENTION CTA BAR */}
      <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <strong className="text-navy-800 dark:text-slate-200 uppercase mr-2">Defender Intervention Evaluator:</strong>
          <span>Evaluate counterfactual defense actions to truncate projected attack trajectories.</span>
        </div>

        <Link
          href="/what-if"
          className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 flex-shrink-0"
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

