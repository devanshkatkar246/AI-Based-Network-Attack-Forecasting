"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import ScenarioSelector from "@/components/ScenarioSelector";
import { SCENARIOS } from "@/data/mockData";
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

  const scenario = activeScenario || SCENARIOS[0];
  const simData = scenario.whatIfSimulationData;

  const [selectedHost, setSelectedHost] = useState(targetParam || simData.targetHost);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (targetParam) {
      setSelectedHost(targetParam);
    }
  }, [targetParam]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setIsSimulated(true);
    }, 1200);
  };

  const handleResetSimulation = () => {
    setIsSimulated(false);
  };

  return (
    <div className="space-y-6 font-mono select-none">
      {/* 1. Header */}
      <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-4 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase tracking-wider">
              COMPARE PROJECTED FUTURES
            </h1>
            <StatusBadge status="FORECAST" size="sm" customLabel="DECISION SUPPORT" />
          </div>
          <p className="text-xs text-[#5F6268] dark:text-[#8B8D91]">
            COUNTERFACTUAL INTERVENTION SIMULATION • Current State:{" "}
            <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{scenario.currentState}</span>
          </p>
        </div>

        <ScenarioSelector
          activeScenarioId={scenario.id}
          onSelectScenario={setActiveScenarioId}
        />
      </div>

      {/* Safety Notice Badge */}
      <div className="bg-[#F0F4F9] dark:bg-[#1E2633] border border-[#657A9C]/40 rounded-lg p-3 text-xs flex items-center justify-between text-[#314B78] dark:text-[#9AB0D3]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>SIMULATED MODEL PROJECTION:</strong> Interventions evaluate hypothetical future trajectories. <strong>NOT ACTUAL NETWORK ACTION.</strong>
          </span>
        </div>
        <StatusBadge status="NORMAL" size="sm" customLabel="SIMULATED ONLY" />
      </div>

      {/* 2. Intervention Control Panel */}
      <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase">
            <Sliders className="w-4 h-4 text-[#314B78]" />
            <span>SIMULATE DEFENDER INTERVENTION</span>
          </div>
          <span className="text-[10px] text-[#8B8D91]">
            Intervention Point: <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">NOW</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Selector */}
          <div className="p-3 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg">
            <label className="text-[10px] text-[#8B8D91] uppercase font-bold block mb-2">
              Select Intervention Action
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 p-2 bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#314B78] rounded cursor-pointer font-bold text-[#314B78] dark:text-[#9AB0D3]">
                <input type="radio" name="action" defaultChecked className="accent-[#314B78]" />
                <span>Isolate Host</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-[#EFECE4] dark:bg-[#17191C]/40 border border-[#E5E1D8] dark:border-[#2B2E33] text-[#8B8D91] cursor-not-allowed">
                <input type="radio" name="action" disabled />
                <span>Block Communication Path</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-[#EFECE4] dark:bg-[#17191C]/40 border border-[#E5E1D8] dark:border-[#2B2E33] text-[#8B8D91] cursor-not-allowed">
                <input type="radio" name="action" disabled />
                <span>Restrict Remote Service</span>
              </label>
            </div>
          </div>

          {/* Target Host Selector */}
          <div className="p-3 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg flex flex-col justify-between">
            <div>
              <label className="text-[10px] text-[#8B8D91] uppercase font-bold block mb-2">
                Target Host Selection
              </label>
              <div className="p-2.5 bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded text-xs">
                <div className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{selectedHost}</div>
                <div className="text-[10px] text-[#8B8D91] mt-0.5">IP: {simData.targetIp}</div>
              </div>
            </div>
            <div className="text-[10px] text-[#9A4D48] font-bold bg-[#F9F2F1] dark:bg-[#2B1D1C] px-2 py-1 rounded border border-[#D9BEBC] dark:border-[#523331] mt-2">
              HIGH RISK ASSET AT RISK
            </div>
          </div>

          {/* Simulate Action Button */}
          <div className="p-3 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg flex flex-col justify-between">
            <div>
              <label className="text-[10px] text-[#8B8D91] uppercase font-bold block mb-2">
                Modelled Simulation Trigger
              </label>
              <p className="text-[11px] text-[#5F6268] dark:text-[#8B8D91] leading-snug">
                Calculate counterfactual trajectory divergence under host isolation.
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex-1 bg-[#17191C] hover:bg-[#2B2E33] text-[#FFFDF8] rounded-lg px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-subtle disabled:opacity-50 border border-transparent dark:border-[#3D4045]"
              >
                {isSimulating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-[#9AB0D3]" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#9AB0D3] fill-[#9AB0D3]" />
                    <span>SIMULATE INTERVENTION</span>
                  </>
                )}
              </button>
              {isSimulated && (
                <button
                  onClick={handleResetSimulation}
                  className="px-3 py-2.5 bg-[#EFECE4] dark:bg-[#25282D] hover:bg-[#E5E1D8] text-[#17191C] dark:text-[#F7F5EE] rounded-lg text-xs font-semibold"
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
      <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-4">
          <div>
            <h2 className="text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase tracking-wider">
              PROJECTED TRAJECTORY DIVERGENCE: BASELINE VS INTERVENTION
            </h2>
            <p className="text-[11px] text-[#8B8D91] mt-0.5">
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
          <div className="p-4 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8] dark:border-[#2B2E33] text-xs font-bold text-[#17191C] dark:text-[#F7F5EE]">
              <span>WITHOUT INTERVENTION</span>
              <span className="text-[#9A4D48] text-[10px] bg-[#F9F2F1] dark:bg-[#2B1D1C] px-2 py-0.5 rounded font-bold border border-[#D9BEBC]">
                81% Risk Peak
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {simData.baselineTrajectory.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    step.status === "OBSERVED"
                      ? "bg-[#FFFDF8] dark:bg-[#1F2125] border-[#E5E1D8] dark:border-[#2B2E33] text-[#17191C] dark:text-[#F7F5EE]"
                      : "bg-[#F0F4F9]/60 dark:bg-[#1E2633]/40 border-dashed border-[#657A9C] text-[#314B78] dark:text-[#9AB0D3]"
                  }`}
                >
                  <div>
                    <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{step.stage}</span>
                    <span className="text-[10px] text-[#8B8D91] ml-2">({step.time})</span>
                  </div>
                  {step.probability && (
                    <span className="font-bold text-[#314B78] dark:text-[#9AB0D3]">{step.probability}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: WITH INTERVENTION */}
          <div
            className={`p-4 rounded-xl border transition-all duration-500 space-y-3 ${
              isSimulated
                ? "bg-[#F1F5F2] dark:bg-[#1C2620] border-2 border-[#557A62] shadow-card"
                : "bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33]"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8] dark:border-[#2B2E33] text-xs font-bold text-[#17191C] dark:text-[#F7F5EE]">
              <span>WITH INTERVENTION</span>
              <span className="text-[#557A62] dark:text-[#8BB098] text-[10px] bg-[#FFFDF8] dark:bg-[#17191C] border border-[#A5BDAC] px-2 py-0.5 rounded font-bold">
                {isSimulated ? "CONTAINED / REDUCED" : "Standing By"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {isSimulated ? (
                simData.interventionTrajectory.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex items-center justify-between animate-fadeIn ${
                      step.isInterventionPoint
                        ? "bg-[#17191C] dark:bg-[#25282D] text-[#FFFDF8] border-[#17191C] font-bold"
                        : step.status === "CONTAINED"
                        ? "bg-[#F1F5F2] dark:bg-[#1C2620] border-[#A5BDAC] text-[#557A62] dark:text-[#8BB098]"
                        : "bg-[#FFFDF8] dark:bg-[#1F2125] border-[#E5E1D8] text-[#17191C]"
                    }`}
                  >
                    <div>
                      <span>{step.stage}</span>
                      <span className="text-[10px] opacity-75 ml-2">({step.time})</span>
                    </div>
                    {step.probability && (
                      <span className="font-bold text-[#557A62] dark:text-[#8BB098]">{step.probability}%</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-[#8B8D91] text-xs flex flex-col items-center justify-center">
                  <Zap className="w-6 h-6 text-[#8B8D91] mb-2" />
                  <span>Click "SIMULATE INTERVENTION" to project counterfactual path</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. TOPOLOGY BEFORE / AFTER VISUAL COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline Topology */}
        <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase pb-2 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-3">
            CURRENT TOPOLOGY (BASELINE)
          </div>
          <div className="p-3 bg-[#FBFAF6] dark:bg-[#17191C] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{selectedHost}</span>
              <span className="text-[#9A4D48] text-[10px] font-bold bg-[#F9F2F1] px-1.5 py-0.5 rounded border border-[#D9BEBC]">CONNECTED</span>
            </div>
            <div className="text-[11px] text-[#5F6268] dark:text-[#8B8D91]">
              Active communication edges to Workstation-302, DB-CLUSTER-01, and External C2.
            </div>
          </div>
        </div>

        {/* Intervention Topology */}
        <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-4 shadow-subtle">
          <div className="text-xs font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase pb-2 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-3">
            SIMULATED INTERVENTION TOPOLOGY
          </div>
          <div className={`p-3 rounded-lg text-xs space-y-2 border ${isSimulated ? "bg-[#F1F5F2] dark:bg-[#1C2620] border-[#A5BDAC]" : "bg-[#FBFAF6] dark:bg-[#17191C] border-[#E5E1D8]"}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{selectedHost}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSimulated ? "bg-[#FFFDF8] text-[#557A62] border border-[#A5BDAC]" : "bg-[#EFECE4] text-[#5F6268]"}`}>
                {isSimulated ? "MODELLED ISOLATED [X]" : "PENDING SIMULATION"}
              </span>
            </div>
            <div className="text-[11px] text-[#5F6268] dark:text-[#8B8D91]">
              {isSimulated
                ? "Modelled intervention drops projected communication edges to internal servers."
                : "Run simulation to visualize isolated edge topology."}
            </div>
          </div>
        </div>
      </div>

      {/* 5. RISK PROBABILITY DIVERGENCE COMPARISON */}
      {isSimulated && (
        <div className="bg-[#FFFDF8] dark:bg-[#1F2125] border border-[#E5E1D8] dark:border-[#2B2E33] rounded-xl p-5 shadow-card text-xs">
          <div className="font-bold text-[#17191C] dark:text-[#F7F5EE] uppercase pb-3 border-b border-[#E5E1D8] dark:border-[#2B2E33] mb-3">
            MODELLED PROJECTION: PROBABILITY DIVERGENCE COMPARISON
          </div>

          <div className="space-y-3">
            {simData.riskComparison.map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-[#17191C] dark:text-[#F7F5EE]">{item.stage}</span>
                  <span>
                    Baseline: <span className="font-bold text-[#9A4D48]">{item.baselineProb}%</span> → Modelled Intervention: <span className="font-bold text-[#557A62]">{item.interventionProb}%</span>
                  </span>
                </div>
                <div className="w-full bg-[#EFECE4] dark:bg-[#25282D] h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-[#9A4D48] h-full" style={{ width: `${item.baselineProb}%` }} />
                  <div className="bg-[#557A62] h-full" style={{ width: `${item.interventionProb}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concise Disclaimer Footer */}
      <div className="p-3 bg-[#EFECE4] dark:bg-[#17191C] rounded-lg border border-[#E5E1D8] dark:border-[#2B2E33] text-center text-xs text-[#5F6268] dark:text-[#8B8D91]">
        Intervention changes the modelled future state trajectory. Decision Support Mode only.
      </div>
    </div>
  );
}

import Link from "next/link";
import EmptyState from "@/components/EmptyState";

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
                className="px-5 py-2.5 rounded bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] font-mono text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>OPEN SCENARIO LIBRARY</span>
              </Link>
            </div>
          );
        }
        return (
          <React.Suspense fallback={<div className="p-8 font-mono text-xs text-[#9BA4B0]">Loading simulation engine...</div>}>
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

