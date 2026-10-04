"use client";

import React from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import ModelEvaluationSection from "@/components/ModelEvaluationSection";
import { FileText, Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <AppShell title="THREAT REPORT SUMMARY">
      {({ activeScenario, activeScenarioId }) => {
        if (!activeScenarioId) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
              <EmptyState
                title="NO SCENARIO LOADED"
                message="Select or upload a network attack scenario to view executive threat intelligence reports."
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
          <div className="space-y-6 max-w-5xl mx-auto font-mono">
            {/* Executive Header Banner */}
            <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#E7EAF0] uppercase">
                  <FileText className="w-4 h-4 text-[#6F8FBE]" />
                  <span>EXECUTIVE THREAT INTELLIGENCE SUMMARY</span>
                  <StatusBadge status="HIGH" size="sm" />
                </div>
                <h2 className="text-base font-bold text-[#E7EAF0]">
                  {activeScenario.name || "Enterprise Lateral Movement"}
                </h2>
                <div className="text-xs text-[#9BA4B0] mt-1">
                  Scenario ID: <span className="font-bold text-[#E7EAF0]">{activeScenario.id}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] rounded-lg text-xs font-bold transition-colors flex items-center gap-2 flex-shrink-0 shadow-subtle"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report (PDF)</span>
              </button>
            </div>

            {/* 4 Key Summary Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-4">
                <div className="text-[10px] text-[#6F7885] uppercase font-bold mb-1">Current State</div>
                <div className="text-sm font-bold text-[#E7EAF0]">{activeScenario.currentState}</div>
                <div className="text-[10px] text-[#9BA4B0] mt-1">Active Window State</div>
              </div>

              <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-4">
                <div className="text-[10px] text-[#6F7885] uppercase font-bold mb-1">Forecast Trajectory</div>
                <div className="text-sm font-bold text-[#6F8FBE]">Lateral Movement</div>
                <div className="text-[10px] text-[#6F8FBE] font-bold mt-1">
                  Model Rollout Active
                </div>
              </div>

              <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-4">
                <div className="text-[10px] text-[#6F7885] uppercase font-bold mb-1">Warning Window</div>
                <div className="text-sm font-bold text-[#B98A3A]">
                  {activeScenario.warningWindow?.leadTimeSeconds ? `${activeScenario.warningWindow.leadTimeSeconds}s` : "~60s"}
                </div>
                <div className="text-[10px] text-[#9BA4B0] mt-1">Intervention Horizon</div>
              </div>

              <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-4">
                <div className="text-[10px] text-[#6F7885] uppercase font-bold mb-1">Target Host</div>
                <div className="text-sm font-bold text-[#E7EAF0]">10.0.4.12 (FIN-SRV)</div>
                <div className="text-[10px] text-[#A85D59] font-bold mt-1">Projected Target</div>
              </div>
            </div>

            {/* Model Evaluation Section */}
            <ModelEvaluationSection />

            <div className="p-3 bg-[#151A21] rounded-lg border border-[#2A323C] text-center text-xs text-[#9BA4B0]">
              Temporal Network World Model • SIH 26153 • Generated locally • Offline analysis report
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
