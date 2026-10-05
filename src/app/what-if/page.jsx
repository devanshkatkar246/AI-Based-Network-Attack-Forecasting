"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import ScenarioSelector from "@/components/ScenarioSelector";
import EmptyState from "@/components/EmptyState";
import { SCENARIOS } from "@/data/mockData";
import { simulateWhatIf } from "@/lib/api";
import {
  Sliders,
  Play,
  RotateCcw,
  Shield,
  Server,
  ArrowRight,
  Activity,
  CheckCircle2,
  XCircle,
  Zap,
  Info
} from "lucide-react";

function WhatIfSimulatorContent({ activeScenario, setActiveScenarioId }) {
  const searchParams = useSearchParams();
  const targetParam = searchParams.get("target");

  const scenario = activeScenario;
  const defaultSimData = scenario?.whatIfSimulationData || {
    targetHost: "Monitored Subnet Host",
    targetIp: targetParam || "10.0.2.45",
    baselineTrajectory: [
      { stage: scenario?.currentState || "Baseline", time: "NOW", probability: 95, status: "OBSERVED" },
      { stage: "Projected Movement", time: "+30s", probability: 75, status: "FORECAST" }
    ],
    interventionTrajectory: [
      { stage: scenario?.currentState || "Baseline", time: "NOW", isInterventionPoint: true, status: "OBSERVED" },
      { stage: "Vector Contained", time: "+30s", probability: 4, status: "CONTAINED" }
    ],
    riskComparison: [
      { stage: "Projected Movement (+30s)", baselineProb: 75, interventionProb: 4 }
    ]
  };

  const [simResult, setSimResult] = useState(null);
  const simData = simResult || defaultSimData;

  const [selectedHost, setSelectedHost] = useState(targetParam || simData.targetHost || "Monitored Subnet Host");
  const [isSimulated, setIsSimulated] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (targetParam) {
      setSelectedHost(targetParam);
    } else if (scenario?.warningWindow?.targetAsset) {
      setSelectedHost(scenario.warningWindow.targetAsset);
    } else if (scenario?.whatIfSimulationData?.targetHost) {
      setSelectedHost(scenario.whatIfSimulationData.targetHost);
    }
  }, [targetParam, scenario?.id, scenario?.warningWindow?.targetAsset, scenario?.whatIfSimulationData?.targetHost]);

  // Reset simulation when scenario switches
  useEffect(() => {
    setSimResult(null);
    setIsSimulated(false);
  }, [scenario?.id]);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      if (scenario?.id) {
        const res = await simulateWhatIf(scenario.id, "isolate", selectedHost);
        if (res) {
          setSimResult(res);
        }
      }
    } catch (e) {
      console.warn("What-if simulation fallback:", e);
    } finally {
      setIsSimulating(false);
      setIsSimulated(true);
    }
  };

  const handleResetSimulation = () => {
    setIsSimulated(false);
  };


  return (
    <div className="space-y-6 select-none">
      {/* 1. Header */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              INTERVENTION ANALYSIS
            </h1>
            <StatusBadge status="FORECAST" size="sm" customLabel="DECISION SUPPORT" />
          </div>
          <p className="text-xs text-[#9AA6B2]">
            COUNTERFACTUAL INTERVENTION SIMULATION • Current State:{" "}
            <span className="font-bold text-[#E8EDF3] font-mono">{scenario.currentState}</span>
          </p>
        </div>

        <ScenarioSelector
          activeScenarioId={scenario.id}
          onSelectScenario={setActiveScenarioId}
        />
      </div>

      {/* Safety Notice Badge */}
      <div className="bg-[#11161D] border border-[#27303A] rounded-xl p-3.5 text-xs flex items-center justify-between text-[#9AA6B2]">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#6F95D6] shrink-0" />
          <span>
            <strong className="text-[#E8EDF3]">SIMULATED MODEL PROJECTION:</strong> Interventions evaluate hypothetical future trajectories. <strong className="text-[#C59A45]">NOT ACTUAL NETWORK ACTION.</strong>
          </span>
        </div>
        <StatusBadge status="NORMAL" size="sm" customLabel="SIMULATED ONLY" />
      </div>

      {/* 2. Intervention Control Panel */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#27303A] mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E8EDF3] uppercase font-mono">
            <Sliders className="w-4 h-4 text-[#6F95D6]" />
            <span>SIMULATE DEFENDER INTERVENTION</span>
          </div>
          <span className="text-xs text-[#9AA6B2] font-mono">
            Intervention Point: <span className="font-bold text-[#6F95D6]">NOW</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Selector */}
          <div className="p-3.5 bg-[#11161D] border border-[#27303A] rounded-lg">
            <label className="text-[10px] text-[#9AA6B2] uppercase font-bold block mb-2 font-mono">
              Select Intervention Action
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 bg-[#151B23] border border-[#6F95D6] rounded-lg cursor-pointer font-bold text-[#6F95D6]">
                <input type="radio" name="action" defaultChecked className="accent-[#6F95D6]" />
                <span>Isolate Host</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-[#151B23]/50 border border-[#27303A] text-[#6C7987] cursor-not-allowed rounded-lg">
                <input type="radio" name="action" disabled />
                <span>Block Communication Path</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-[#151B23]/50 border border-[#27303A] text-[#6C7987] cursor-not-allowed rounded-lg">
                <input type="radio" name="action" disabled />
                <span>Restrict Remote Service</span>
              </label>
            </div>
          </div>

          {/* Target Host Selector */}
          <div className="p-3.5 bg-[#11161D] border border-[#27303A] rounded-lg flex flex-col justify-between">
            <div>
              <label className="text-[10px] text-[#9AA6B2] uppercase font-bold block mb-2 font-mono">
                Target Host Selection
              </label>
              <div className="p-2.5 bg-[#151B23] border border-[#27303A] rounded-lg text-xs space-y-1">
                <div className="font-bold text-[#E8EDF3] font-mono">{selectedHost}</div>
                <div className="text-xs text-[#9AA6B2] font-mono">IP: {simData.targetIp}</div>
              </div>
            </div>
            <div className="text-[11px] text-[#B85C5C] font-mono font-bold bg-[#2B1D1C] px-2.5 py-1 rounded-lg border border-[#B85C5C]/30 mt-3">
              HIGH RISK ASSET AT RISK
            </div>
          </div>

          {/* Simulate Action Button */}
          <div className="p-3.5 bg-[#11161D] border border-[#27303A] rounded-lg flex flex-col justify-between">
            <div>
              <label className="text-[10px] text-[#9AA6B2] uppercase font-bold block mb-2 font-mono">
                Modelled Simulation Trigger
              </label>
              <p className="text-xs text-[#9AA6B2] leading-relaxed">
                Calculate counterfactual trajectory divergence under host isolation.
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex-1 bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14] rounded-lg px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-[#0B0F14]" />
                    <span>CALCULATING PROJECTION...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#0B0F14] fill-[#0B0F14]" />
                    <span>SIMULATE HOST ISOLATION</span>
                  </>
                )}
              </button>
              {isSimulated && (
                <button
                  onClick={handleResetSimulation}
                  className="px-3 py-2.5 bg-[#1E2632] hover:bg-[#27303A] text-[#E8EDF3] rounded-lg text-xs font-semibold transition-colors"
                  title="Reset Simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. HERO VISUAL — BEFORE VS AFTER TRAJECTORY COMPARISON */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#27303A] mb-4">
          <div>
            <h2 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              PROJECTED TRAJECTORY DIVERGENCE: BASELINE VS INTERVENTION
            </h2>
            <p className="text-xs text-[#9AA6B2] mt-0.5">
              Side-by-side comparison of baseline forecast vs. intervention-conditioned trajectory
            </p>
          </div>
          <StatusBadge
            status={isSimulated ? "FORECAST" : "OBSERVED"}
            size="sm"
            customLabel={isSimulated ? "MODELLED DIVERGENCE" : "BASELINE FORECAST"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: WITHOUT INTERVENTION */}
          <div className="p-4 bg-[#11161D] border border-[#27303A] rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#27303A] text-xs font-bold text-[#E8EDF3]">
              <span className="font-mono">WITHOUT INTERVENTION</span>
              <span className="text-[#B85C5C] text-[10px] font-mono bg-[#2B1D1C] px-2 py-0.5 rounded font-bold border border-[#B85C5C]/40">
                81% Risk Peak
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {simData.baselineTrajectory.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    step.status === "OBSERVED"
                      ? "bg-[#151B23] border-[#27303A] text-[#E8EDF3]"
                      : "bg-[#19202A] border-dashed border-[#6F95D6]/50 text-[#6F95D6]"
                  }`}
                >
                  <div>
                    <span className="font-semibold text-[#E8EDF3]">{step.stage}</span>
                    <span className="text-[11px] font-mono text-[#9AA6B2] ml-2">({step.time})</span>
                  </div>
                  {step.probability && (
                    <span className="font-bold font-mono text-[#6F95D6]">{step.probability}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: WITH INTERVENTION */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 space-y-3 ${
              isSimulated
                ? "bg-[#11161D] border-2 border-[#659477] shadow-card"
                : "bg-[#11161D] border border-[#27303A]"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#27303A] text-xs font-bold text-[#E8EDF3]">
              <span className="font-mono">WITH INTERVENTION</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${isSimulated ? "text-[#659477] bg-[#1C2620] border-[#659477]/40" : "text-[#9AA6B2] bg-[#151B23] border-[#27303A]"}`}>
                {isSimulated ? "CONTAINED / REDUCED" : "Standing By"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {isSimulated ? (
                simData.interventionTrajectory.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      step.isInterventionPoint
                        ? "bg-[#1E2632] text-[#E8EDF3] border-[#6F95D6] font-semibold"
                        : step.status === "CONTAINED"
                        ? "bg-[#1C2620] border-[#659477]/50 text-[#659477]"
                        : "bg-[#151B23] border-[#27303A] text-[#E8EDF3]"
                    }`}
                  >
                    <div>
                      <span>{step.stage}</span>
                      <span className="text-[11px] font-mono text-[#9AA6B2] ml-2">({step.time})</span>
                    </div>
                    {step.probability && (
                      <span className="font-bold font-mono text-[#659477]">{step.probability}%</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-[#9AA6B2] text-xs flex flex-col items-center justify-center space-y-2">
                  <Zap className="w-6 h-6 text-[#6C7987]" />
                  <span>Click "SIMULATE HOST ISOLATION" to project counterfactual path</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. TOPOLOGY BEFORE / AFTER VISUAL COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline Topology */}
        <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-bold font-mono text-[#E8EDF3] uppercase pb-2 border-b border-[#27303A] mb-3">
            CURRENT TOPOLOGY (BASELINE)
          </div>
          <div className="p-3 bg-[#11161D] border border-[#27303A] rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold font-mono text-[#E8EDF3]">{selectedHost}</span>
              <span className="text-[#B85C5C] font-mono text-[10px] font-bold bg-[#2B1D1C] px-1.5 py-0.5 rounded border border-[#B85C5C]/40">CONNECTED</span>
            </div>
            <div className="text-xs text-[#9AA6B2]">
              Active communication edges to Workstation-302, DB-CLUSTER-01, and External C2.
            </div>
          </div>
        </div>

        {/* Intervention Topology */}
        <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-bold font-mono text-[#E8EDF3] uppercase pb-2 border-b border-[#27303A] mb-3">
            SIMULATED INTERVENTION TOPOLOGY
          </div>
          <div className={`p-3 rounded-lg text-xs space-y-2 border ${isSimulated ? "bg-[#1C2620] border-[#659477]/40" : "bg-[#11161D] border-[#27303A]"}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold font-mono text-[#E8EDF3]">{selectedHost}</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSimulated ? "bg-[#1C2620] text-[#659477] border border-[#659477]/40" : "bg-[#19202A] text-[#9AA6B2]"}`}>
                {isSimulated ? "MODELLED ISOLATED [X]" : "PENDING SIMULATION"}
              </span>
            </div>
            <div className="text-xs text-[#9AA6B2]">
              {isSimulated
                ? "Modelled intervention drops projected communication edges to internal servers."
                : "Run simulation to visualize isolated edge topology."}
            </div>
          </div>
        </div>
      </div>

      {/* 5. RISK PROBABILITY DIVERGENCE COMPARISON */}
      {isSimulated && (
        <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card text-xs">
          <div className="font-bold text-[#E8EDF3] uppercase pb-3 border-b border-[#27303A] mb-3 font-mono">
            MODELLED PROJECTION: PROBABILITY DIVERGENCE COMPARISON
          </div>

          <div className="space-y-3">
            {simData.riskComparison.map((item) => (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-[#E8EDF3]">{item.stage}</span>
                  <span>
                    Baseline: <span className="font-bold text-[#B85C5C]">{item.baselineProb}%</span> → Modelled Intervention: <span className="font-bold text-[#659477]">{item.interventionProb}%</span>
                  </span>
                </div>
                <div className="w-full bg-[#11161D] h-2.5 rounded-full overflow-hidden flex border border-[#27303A]">
                  <div className="bg-[#B85C5C] h-full" style={{ width: `${item.baselineProb}%` }} />
                  <div className="bg-[#659477] h-full" style={{ width: `${item.interventionProb}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concise Disclaimer Footer */}
      <div className="p-3 bg-[#11161D] rounded-lg border border-[#27303A] text-center text-xs text-[#9AA6B2]">
        Intervention changes the modelled future state trajectory. Decision Support Mode only.
      </div>
    </div>
  );
}

export default function WhatIfPage() {
  return (
    <AppShell title="WHAT-IF INTERVENTION SIMULATION">
      {({ activeScenario, activeScenarioId, setActiveScenarioId }) => {
        if (!activeScenarioId) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
              <EmptyState
                title="NO SCENARIO LOADED"
                message="Select or upload a network attack scenario to run counterfactual intervention rollouts."
              />
              <Link
                href="/scenarios"
                className="px-5 py-2.5 rounded-lg bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14] font-mono text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>OPEN SCENARIO LIBRARY</span>
              </Link>
            </div>
          );
        }
        return (
          <React.Suspense fallback={<div className="p-8 font-mono text-xs text-[#9AA6B2]">Loading simulation engine...</div>}>
            <WhatIfSimulatorContent
              activeScenario={activeScenario}
              setActiveScenarioId={setActiveScenarioId}
            />
          </React.Suspense>
        );
      }}
    </AppShell>
  );
}
