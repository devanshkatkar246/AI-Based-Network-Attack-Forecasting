"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";

import CurrentStateCard from "@/components/CurrentStateCard";
import ForecastCard from "@/components/ForecastCard";
import WarningWindowCard from "@/components/WarningWindowCard";
import TelemetryStrip from "@/components/TelemetryStrip";
import AttackTrajectory from "@/components/AttackTrajectory";
import EvidenceCard from "@/components/EvidenceCard";
import TopologyMap from "@/components/TopologyMap";
import ForecastResultNarrative from "@/components/ForecastResultNarrative";
import AttackInterpretationCard from "@/components/AttackInterpretationCard";
import DefenderInterventionCard from "@/components/DefenderInterventionCard";

function CommandCenterInner({ activeScenario, activeScenarioId }) {
  // Guard check: Require active loaded scenario
  if (!activeScenarioId || !activeScenario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <EmptyState
          title="NO SCENARIO LOADED"
          message="Select or upload a network attack scenario to begin temporal analysis, attack trajectory forecasting, and early warning lead time evaluation."
        />
        <Link
          href="/scenarios"
          className="px-5 py-2.5 rounded bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] font-mono text-xs font-bold transition-colors inline-flex items-center gap-2"
        >
          <span>OPEN SCENARIO LIBRARY</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Telemetry Metric Strip */}
      <TelemetryStrip telemetry={activeScenario.telemetry} />

      {/* 2. Hero Visual Centerpiece: Full Temporal Attack Trajectory Graph */}
      <AttackTrajectory
        trajectory={activeScenario.trajectory}
        forecast={activeScenario.forecast}
        trajectoryGraph={activeScenario.trajectoryGraph}
      />

      {/* 3. Hero Analytical Cards: Current State | Model Forecast | Early Warning Lead Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CurrentStateCard scenario={activeScenario} />
        <ForecastCard scenario={activeScenario} />
        <WarningWindowCard warningWindow={activeScenario.warningWindow} />
      </div>

      {/* 4. Narrative Summary Box */}
      <ForecastResultNarrative scenario={activeScenario} />

      {/* 5. Supporting Evidence ("Why Did The Model Forecast This?") */}
      <EvidenceCard evidence={activeScenario.evidence || []} />

      {/* 6. Topology & ATT&CK Behavioural Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopologyMap topology={activeScenario.topology} />
        </div>
        <div className="lg:col-span-1">
          <AttackInterpretationCard scenario={activeScenario} />
        </div>
      </div>

      {/* 7. Defender Intervention / What-If Entry Point */}
      <DefenderInterventionCard scenario={activeScenario} />
    </div>
  );
}

export default function CommandCenterPage() {
  return (
    <AppShell title="COMMAND CENTER">
      {({ activeScenario, activeScenarioId }) => (
        <CommandCenterInner
          activeScenario={activeScenario}
          activeScenarioId={activeScenarioId}
        />
      )}
    </AppShell>
  );
}

