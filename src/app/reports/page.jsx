"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import ModelEvaluationSection from "@/components/ModelEvaluationSection";
import { useReplay } from "@/context/ReplayContext";
import { generateThreatReportPDF } from "@/lib/pdfGenerator";
import { FileText, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function ReportsContent({ activeScenario, activeScenarioId }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState(null);

  const { currentTickIndex } = useReplay();

  if (!activeScenarioId || !activeScenario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center select-none">
        <EmptyState
          title="NO SCENARIO LOADED"
          message="Select or upload a network attack scenario to view executive threat intelligence reports."
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

  const handleExportPDF = async () => {
    setIsGenerating(true);
    setExportError(null);
    setExportSuccess(false);

    try {
      await generateThreatReportPDF(activeScenario, currentTickIndex);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error("[PDF Export Failed]:", err);
      setExportError(err.message || "Failed to generate Threat Report PDF document.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Executive Header Banner */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#E8EDF3] uppercase font-mono">
            <FileText className="w-4 h-4 text-[#6F95D6]" />
            <span>EXECUTIVE THREAT INTELLIGENCE SUMMARY</span>
            <StatusBadge status="HIGH" size="sm" />
          </div>
          <h2 className="text-lg font-bold text-[#E8EDF3]">
            {activeScenario.name || activeScenario.id}
          </h2>
          <div className="text-xs text-[#9AA6B2] mt-0.5 font-mono">
            Scenario ID: <span className="font-bold text-[#E8EDF3]">{activeScenario.id}</span>
          </div>
        </div>

        {/* Stateful Direct PDF Export Button */}
        <button
          onClick={handleExportPDF}
          disabled={isGenerating}
          className={`px-5 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 flex-shrink-0 shadow-sm ${
            isGenerating
              ? "bg-[#27303A] text-[#9AA6B2] cursor-not-allowed"
              : exportSuccess
              ? "bg-[#659477] hover:bg-[#527d62] text-[#0B0F14]"
              : "bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14]"
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0B0F14]" />
              <span>GENERATING REPORT...</span>
            </>
          ) : exportSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#0B0F14]" />
              <span>REPORT DOWNLOADED ✓</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#0B0F14]" />
              <span>EXPORT REPORT (PDF)</span>
            </>
          )}
        </button>
      </div>

      {/* Export Error Banner */}
      {exportError && (
        <div className="p-3.5 bg-[#2B1D1C] border border-[#B85C5C] rounded-lg text-xs text-[#E8EDF3] flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-[#B85C5C] shrink-0" />
          <span>REPORT GENERATION FAILED: {exportError}</span>
        </div>
      )}

      {/* 4 Key Summary Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-4">
          <div className="text-[10px] text-[#9AA6B2] uppercase font-bold mb-1 font-mono">Current State</div>
          <div className="text-sm font-bold text-[#E8EDF3]">{activeScenario.currentState || "BASELINE"}</div>
          <div className="text-[11px] text-[#9AA6B2] mt-1">Active Window State</div>
        </div>

        <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-4">
          <div className="text-[10px] text-[#9AA6B2] uppercase font-bold mb-1 font-mono">Forecast Trajectory</div>
          <div className="text-sm font-bold text-[#6F95D6]">
            {activeScenario.warningWindow?.predictedBehavior || "Forecast Active"}
          </div>
          <div className="text-[11px] text-[#6F95D6] font-semibold mt-1">
            Model Rollout Active
          </div>
        </div>

        <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-4">
          <div className="text-[10px] text-[#9AA6B2] uppercase font-bold mb-1 font-mono">Warning Window</div>
          <div className="text-sm font-bold text-[#C59A45] font-mono">
            {activeScenario.warningWindow?.leadTimeSeconds ? `${activeScenario.warningWindow.leadTimeSeconds}s` : "VERIFIED"}
          </div>
          <div className="text-[11px] text-[#9AA6B2] mt-1">Intervention Horizon</div>
        </div>

        <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-4">
          <div className="text-[10px] text-[#9AA6B2] uppercase font-bold mb-1 font-mono">Target Host</div>
          <div className="text-sm font-bold text-[#E8EDF3] truncate font-mono">
            {activeScenario.warningWindow?.targetAsset || "Monitored Subnet Host"}
          </div>
          <div className="text-[11px] text-[#B85C5C] font-semibold mt-1">Projected Target</div>
        </div>
      </div>

      {/* Model Evaluation Section */}
      <ModelEvaluationSection />

      <div className="p-3 bg-[#11161D] rounded-lg border border-[#27303A] text-center text-xs text-[#9AA6B2] font-mono">
        THE FORECASTER • Temporal Network Intelligence • SIH 26153 • Generated locally
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <AppShell title="THREAT REPORT">
      {({ activeScenario, activeScenarioId }) => (
        <ReportsContent
          activeScenario={activeScenario}
          activeScenarioId={activeScenarioId}
        />
      )}
    </AppShell>
  );
}
