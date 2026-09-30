"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { SCENARIOS } from "@/data/mockData";
import { Layers, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ScenariosPage() {
  return (
    <AppShell title="Threat Scenarios Library">
      {({ activeScenario, setActiveScenarioId }) => (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-navy-800 dark:text-slate-100 font-mono uppercase tracking-wider">
                TEMPORAL THREAT SCENARIOS
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Deterministic attack trajectories modeled from multi-stage network telemetry streams.
              </p>
            </div>
            <StatusBadge status="FORECAST" size="sm" customLabel="PRIMARY DEMO SCENARIO" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCENARIOS.map((scen) => {
              const isCurrent = scen.id === activeScenario?.id;

              return (
                <div
                  key={scen.id}
                  className={`bg-surface dark:bg-slate-900 border rounded-xl p-5 shadow-card flex flex-col justify-between transition-all ${
                    isCurrent ? "border-2 border-accent ring-2 ring-accent/10" : "border-slate-200/90 dark:border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-navy-800 dark:text-slate-100">{scen.id}</span>
                      <StatusBadge status={scen.riskLevel} size="sm" />
                    </div>

                    <h3 className="text-sm font-bold text-navy-800 dark:text-slate-100 leading-snug mb-2 font-mono">
                      {scen.title}
                    </h3>

                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400 dark:text-slate-500">Category:</span>
                        <span className="text-navy-800 dark:text-slate-200 font-semibold">{scen.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 dark:text-slate-500">Current State:</span>
                        <span className="text-navy-800 dark:text-slate-100 font-bold">{scen.currentState}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 dark:text-slate-500">Warning Window:</span>
                        <span className="text-warning font-bold">~{scen.warningWindowSec}s</span>
                      </div>
                    </div>

                    {/* Compact Visual Story Sequence */}
                    <div className="my-3 py-2 px-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[10px] space-y-1">
                      <div className="text-slate-400 dark:text-slate-500 font-bold uppercase">Trajectory Flow</div>
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate font-semibold">
                        <span>Recon</span> → <span>Discovery</span> → <span className="text-accent font-bold">Privilege</span> → <span className="text-forecast font-bold">Lateral</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <button
                      onClick={() => setActiveScenarioId(scen.id)}
                      className={`flex-1 py-2 px-3 rounded text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 ${
                        isCurrent
                          ? "bg-navy-800 dark:bg-slate-800 text-white border border-transparent dark:border-slate-700"
                          : "bg-slate-100 dark:bg-slate-800/80 text-navy-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span>{isCurrent ? "Active Scenario" : "Load Scenario"}</span>
                    </button>
                    {isCurrent && (
                      <Link
                        href="/"
                        className="px-3 py-2 bg-accent hover:bg-blue-600 text-white rounded text-xs font-mono font-semibold flex items-center justify-center gap-1"
                        title="Launch Console"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppShell>
  );
}
