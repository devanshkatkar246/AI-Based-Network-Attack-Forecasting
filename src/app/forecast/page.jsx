"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import ForecastHeader from "@/components/forecast/ForecastHeader";
import ForecastTrajectoryHero from "@/components/forecast/ForecastTrajectoryHero";
import ForecastProbabilityChart from "@/components/forecast/ForecastProbabilityChart";
import NextBehaviourCard from "@/components/forecast/NextBehaviourCard";
import ForecastEvidenceSection from "@/components/forecast/ForecastEvidenceSection";
import AttackInterpretationFlow from "@/components/forecast/AttackInterpretationFlow";
import { SCENARIOS } from "@/data/mockData";

function ForecastDeepDiveContent({ activeScenario, setActiveScenarioId }) {
  const scenario = activeScenario || SCENARIOS[0];
  const [selectedHorizon, setSelectedHorizon] = useState("60s");

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

      {/* 3. Mid Grid: Forecast Probability & Uncertainty Range (Left) + Next Likely Behaviour & Horizon (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <ForecastProbabilityChart data={scenario.likelihoodOverTime} />
        <NextBehaviourCard
          nextLikelyBehaviour={scenario.nextLikelyBehaviour}
          horizonData={scenario.horizonData}
          warningWindow={scenario.warningWindow}
        />
      </div>

      {/* 4. WHY THIS FORECAST? — Evidence Section (Feature Signals, Temporal Forensic Timeline, Topology Edge) */}
      <ForecastEvidenceSection
        featureSignals={scenario.featureSignals}
        temporalEvidence={scenario.temporalEvidence}
        topologyEvidence={scenario.topologyEvidence}
      />

      {/* 5. MITRE ATT&CK Behavioural Interpretation */}
      <AttackInterpretationFlow
        attackInterpretation={scenario.attackInterpretation}
      />
    </div>
  );
}

export default function ForecastPage() {
  return (
    <AppShell title="Attack Forecast Deep-Dive">
      {({ activeScenario, setActiveScenarioId }) => (
        <ForecastDeepDiveContent
          activeScenario={activeScenario}
          setActiveScenarioId={setActiveScenarioId}
        />
      )}
    </AppShell>
  );
}
