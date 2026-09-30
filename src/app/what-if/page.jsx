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
  Zap
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
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-surface dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-sm font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider font-mono">
              WHAT-IF SIMULATION
            </h1>
            <StatusBadge status="FORECAST" size="sm" customLabel="SIMULATION MODE" />
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            INTERVENTION-CONDITIONED TRAJECTORY • Current State:{" "}
            <span className="font-bold text-navy-800 dark:text-slate-200">{scenario.currentState}</span>
          </p>
        </div>

        <ScenarioSelector
          activeScenarioId={scenario.id}
          onSelectScenario={setActiveScenarioId}
        />
      </div>

      {/* 2. Intervention Control Panel */}
      <div className="bg-surface dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-navy-800 dark:text-slate-200 uppercase">
            <Sliders className="w-4 h-4 text-accent" />
            <span>SIMULATE DEFENDER INTERVENTION</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            Intervention Point: <span className="font-bold text-navy-800 dark:text-slate-200">NOW</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Selector */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg">
            <label className="text-[10px] font-mono text-slate-400 dark:text-slate-400 uppercase font-bold block mb-2">
              Select Intervention Action
            </label>
            <div className="space-y-2 font-mono text-xs">
              <label className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-accent rounded cursor-pointer font-bold text-navy-800 dark:text-slate-100">
                <input type="radio" name="action" defaultChecked className="accent-accent" />
                <span>Isolate Host</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed">
                <input type="radio" name="action" disabled />
                <span>Block Communication Path</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed">
                <input type="radio" name="action" disabled />
                <span>Restrict Remote Service</span>
              </label>
            </div>
          </div>

          {/* Target Host Selector */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg flex flex-col justify-between">
            <div>
              <label className="text-[10px] font-mono text-slate-400 dark:text-slate-400 uppercase font-bold block mb-2">
                Target Host Selection
              </label>
              <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-xs">
                <div className="font-bold text-navy-800 dark:text-slate-100">{selectedHost}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">IP: {simData.targetIp}</div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-critical dark:text-red-400 font-bold bg-critical-light dark:bg-red-950/40 px-2 py-1 rounded border border-critical-border dark:border-red-900/60 mt-2">
              HIGH RISK ASSET AT RISK
            </div>
          </div>

          {/* Simulate Action Button */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg flex flex-col justify-between">
            <div>
              <label className="text-[10px] font-mono text-slate-400 dark:text-slate-400 uppercase font-bold block mb-2">
                Modelled Simulation Trigger
              </label>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-snug">
                Calculate counterfactual trajectory divergence under host isolation.
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex-1 bg-navy-800 hover:bg-navy-700 text-white rounded-lg px-4 py-2.5 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-subtle disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-accent" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-accent fill-accent" />
                    <span>SIMULATE INTERVENTION</span>
                  </>
                )}
              </button>
              {isSimulated && (
                <button
                  onClick={handleResetSimulation}
                  className="px-3 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-navy-800 dark:text-slate-200 rounded-lg text-xs font-mono font-semibold"
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
      <div className="bg-surface dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h2 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider font-mono">
              PROJECTED TRAJECTORY DIVERGENCE: BASELINE VS INTERVENTION
            </h2>
            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
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
          {/* LEFT: BASELINE TRAJECTORY */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60 font-mono text-xs font-bold text-navy-800 dark:text-slate-200">
              <span>BASELINE TRAJECTORY (NO INTERVENTION)</span>
              <span className="text-critical dark:text-red-400 text-[10px] bg-critical-light dark:bg-red-950/40 px-2 py-0.5 rounded font-bold">
                81% Risk Peak
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {simData.baselineTrajectory.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    step.status === "OBSERVED"
                      ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-navy-800 dark:text-slate-100"
                      : "bg-forecast-light/50 dark:bg-indigo-950/30 border-dashed border-forecast-border dark:border-indigo-800/60 text-navy-800 dark:text-slate-200"
                  }`}
                >
                  <div>
                    <span className="font-bold text-navy-800 dark:text-slate-200">{step.stage}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2">({step.time})</span>
                  </div>
                  {step.probability && (
                    <span className="font-bold text-forecast dark:text-indigo-400">{step.probability}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: INTERVENTION-CONDITIONED TRAJECTORY */}
          <div
            className={`p-4 rounded-xl border transition-all duration-500 space-y-3 ${
              isSimulated
                ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-400 dark:border-emerald-600 shadow-md"
                : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60 font-mono text-xs font-bold text-navy-800 dark:text-slate-200">
              <span>INTERVENTION-CONDITIONED TRAJECTORY</span>
              <span className="text-emerald-700 dark:text-emerald-400 text-[10px] bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-bold">
                {isSimulated ? "9% Residual Risk" : "Standing By"}
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {isSimulated ? (
                simData.interventionTrajectory.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex items-center justify-between animate-fadeIn ${
                      step.isInterventionPoint
                        ? "bg-navy-800 dark:bg-slate-800 text-white border-navy-800 dark:border-slate-700 font-bold"
                        : step.status === "CONTAINED"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-navy-800 dark:text-slate-200"
                    }`}
                  >
                    <div>
                      <span>{step.stage}</span>
                      <span className="text-[10px] opacity-75 ml-2">({step.time})</span>
                    </div>
                    {step.probability && (
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{step.probability}%</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-slate-400 dark:text-slate-500 font-mono text-xs flex flex-col items-center justify-center">
                  <Zap className="w-6 h-6 text-slate-300 dark:text-slate-600 mb-2" />
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
        <div className="bg-surface dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-subtle">
          <div className="font-mono text-xs font-bold text-navy-800 dark:text-slate-100 uppercase pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
            CURRENT TOPOLOGY (BASELINE)
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-navy-800 dark:text-slate-100">{selectedHost}</span>
              <span className="text-critical dark:text-red-400 text-[10px] font-bold bg-critical-light dark:bg-red-950/40 px-1.5 py-0.5 rounded">CONNECTED</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400">
              Active communication edges to Workstation-302, DB-CLUSTER-01, and External C2.
            </div>
          </div>
        </div>

        {/* Intervention Topology */}
        <div className="bg-surface dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-subtle">
          <div className="font-mono text-xs font-bold text-navy-800 dark:text-slate-100 uppercase pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
            SIMULATED INTERVENTION TOPOLOGY
          </div>
          <div className={`p-3 rounded-lg font-mono text-xs space-y-2 border ${isSimulated ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60"}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-navy-800 dark:text-slate-100">{selectedHost}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSimulated ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                {isSimulated ? "MODELLED ISOLATED [X]" : "PENDING SIMULATION"}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400">
              {isSimulated
                ? "Modelled intervention drops projected communication edges to internal servers."
                : "Run simulation to visualize isolated edge topology."}
            </div>
          </div>
        </div>
      </div>

      {/* 5. RISK PROBABILITY DIVERGENCE COMPARISON */}
      {isSimulated && (
        <div className="bg-surface dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-card font-mono text-xs">
          <div className="font-bold text-navy-800 dark:text-slate-100 uppercase pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            MODELLED PROJECTION: PROBABILITY DIVERGENCE COMPARISON
          </div>

          <div className="space-y-3">
            {simData.riskComparison.map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-navy-800 dark:text-slate-200">{item.stage}</span>
                  <span>
                    Baseline: <span className="font-bold text-critical dark:text-red-400">{item.baselineProb}%</span> → Modelled Intervention: <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.interventionProb}%</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-critical h-full" style={{ width: `${item.baselineProb}%` }} />
                  <div className="bg-emerald-500 h-full" style={{ width: `${item.interventionProb}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concise Disclaimer Footer */}
      <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center font-mono text-xs text-slate-500 dark:text-slate-400">
        Intervention changes the modelled future state trajectory.
      </div>
    </div>
  );
}

export default function WhatIfPage() {
  return (
    <AppShell title="What-If Intervention Evaluator">
      {({ activeScenario, setActiveScenarioId }) => (
        <React.Suspense fallback={<div className="p-8 font-mono text-xs">Loading simulation engine...</div>}>
          <WhatIfSimulatorContent
            activeScenario={activeScenario}
            setActiveScenarioId={setActiveScenarioId}
          />
        </React.Suspense>
      )}
    </AppShell>
  );
}
