"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import ForecastHeader from "@/components/forecast/ForecastHeader";
import ForecastTrajectoryHero from "@/components/forecast/ForecastTrajectoryHero";
import ForecastProbabilityChart from "@/components/forecast/ForecastProbabilityChart";
import NextBehaviourCard from "@/components/forecast/NextBehaviourCard";
import ForecastEvidenceSection from "@/components/forecast/ForecastEvidenceSection";
import AttackInterpretationFlow from "@/components/forecast/AttackInterpretationFlow";
import ForecastResultNarrative from "@/components/ForecastResultNarrative";
import ModelEvaluationSection from "@/components/ModelEvaluationSection";
import { SCENARIOS } from "@/data/mockData";

function ForecastDeepDiveContent({ activeScenario, setActiveScenarioId }) {
  const scenario = activeScenario || SCENARIOS[0];
  const [selectedHorizon, setSelectedHorizon] = useState("30s");

  return (
    <div className="space-y-6">
      {/* 1. Forecast Header */}
      <ForecastHeader
        activeScenario={scenario}
        onSelectScenario={setActiveScenarioId}
        selectedHorizon={selectedHorizon}
        onSelectHorizon={setSelectedHorizon}
      />

      {/* 2. Future Trajectory — HERO */}
      <ForecastTrajectoryHero
        trajectory={scenario.trajectory}
        selectedHorizon={selectedHorizon}
      />

      {/* 3. Mid Grid: Forecast Trajectory Curve (Left) + Next Likely Behaviour & Horizon (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <ForecastProbabilityChart
          data={scenario.likelihoodOverTime}
          selectedHorizon={selectedHorizon}
        />
        <NextBehaviourCard
          horizonData={scenario.horizonData}
          selectedHorizon={selectedHorizon}
          onSelectHorizon={setSelectedHorizon}
        />
      </div>

      {/* 4. FORECAST SUMMARY / RESULT NARRATIVE */}
      <ForecastResultNarrative scenario={scenario} />

      {/* 5. WHY THIS FORECAST? — Evidence Section */}
      <ForecastEvidenceSection
        featureSignals={scenario.featureSignals}
        temporalEvidence={scenario.temporalEvidence}
        topologyEvidence={scenario.topologyEvidence}
      />

      {/* 5. MITRE ATT&CK Behavioural Interpretation */}
      <AttackInterpretationFlow
        attackInterpretation={scenario.attackInterpretation}
      />

      {/* 6. Offline Model Evaluation & Methodology */}
      <ModelEvaluationSection />
    </div>
  );
}

import Link from "next/link";
import EmptyState from "@/components/EmptyState";

export default function ForecastPage() {
  return (
    <AppShell title="ATTACK FORECAST DEEP-DIVE">
      {({ activeScenario, activeScenarioId, setActiveScenarioId }) => {
        if (!activeScenarioId) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
              <EmptyState
                title="NO SCENARIO LOADED"
                message="Select or upload a network attack scenario to view multi-horizon forecast trajectory rollouts."
              />
              <Link
                href="/scenarios"
                className="px-5 py-2.5 rounded bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] font-mono text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>OPEN SCENARIO LIBRARY</span>
              </Link>
            </div>
          );
        }
        return (
          <ForecastDeepDiveContent
            activeScenario={activeScenario}
            setActiveScenarioId={setActiveScenarioId}
          />
        );
      }}
    </AppShell>
  );
}

