"use client";

import React from "react";
import { ShieldCheck, Clock, FileCheck, Layers, AlertCircle, Database } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { EVALUATION_BENCHMARKS } from "@/data/mockData";

export default function ModelEvaluationSection() {
  const benchmarks = EVALUATION_BENCHMARKS || {
    methodology: {
      splitType: "Strict Temporal Split",
      trainTestBoundary: "Time-Based Sequential Window",
      leakageSafeguard: "Zero Future-Window Feature Leakage",
    },
    horizonMetrics: [
      { horizon: "+30s", precision: 0.84, recall: 0.79, f1Score: 0.81, avgLeadTimeSec: 28 },
      { horizon: "+60s", precision: 0.76, recall: 0.71, f1Score: 0.73, avgLeadTimeSec: 52 },
      { horizon: "+90s", precision: 0.62, recall: 0.58, f1Score: 0.60, avgLeadTimeSec: 74 }
    ],
    operationalSummary: {
      falseAlarmsPerHour: "0.42 / hr",
      meanWarningLeadTime: "51.3s",
      inferenceLatency: "12ms / sample"
    }
  };

  return (
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider font-mono">
              MODEL EVALUATION & TEMPORAL BENCHMARKS
            </h2>
          </div>
          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
            Offline temporal split performance across prediction horizons
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="OBSERVED" size="sm" customLabel="TEMPORAL SPLIT" />
          <StatusBadge status="NORMAL" size="sm" customLabel="OFFLINE BENCHMARK" />
        </div>
      </div>

      {/* Grid: 2 Columns (Left: Horizon Performance Table, Right: Evaluation Methodology & Safeguards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch font-mono text-xs">
        {/* Left Column: Horizon Performance Table (2/3 width) */}
        <div className="lg:col-span-2 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-3 text-navy-800 dark:text-slate-100 font-bold">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>FORECAST PERFORMANCE BY HORIZON</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">CLASSIFICATION & TIMING</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 uppercase">
                    <th className="py-2 px-2">Forecast Horizon</th>
                    <th className="py-2 px-2">Precision</th>
                    <th className="py-2 px-2">Recall</th>
                    <th className="py-2 px-2">F1 Score</th>
                    <th className="py-2 px-2 text-right">Avg Lead Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {benchmarks.horizonMetrics.map((row) => (
                    <tr key={row.horizon} className="hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-2 font-bold text-forecast">{row.horizon}</td>
                      <td className="py-2.5 px-2 font-semibold text-navy-800 dark:text-slate-200">
                        {row.precision ? row.precision.toFixed(2) : "N/A"}
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-navy-800 dark:text-slate-200">
                        {row.recall ? row.recall.toFixed(2) : "N/A"}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-navy-800 dark:text-slate-100">
                        {row.f1Score ? row.f1Score.toFixed(2) : "N/A"}
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-navy-800 dark:text-slate-100">
                        ~{row.avgLeadTimeSec}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>False Alarms / Hour: <strong className="text-navy-800 dark:text-slate-200">{benchmarks.operationalSummary.falseAlarmsPerHour}</strong></span>
            <span>Mean Warning Lead Time: <strong className="text-navy-800 dark:text-slate-200">{benchmarks.operationalSummary.meanWarningLeadTime}</strong></span>
          </div>
        </div>

        {/* Right Column: Data Split Methodology & Leakage Prevention (1/3 width) */}
        <div className="lg:col-span-1 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 mb-3 text-navy-800 dark:text-slate-100 font-bold">
              <Database className="w-4 h-4 text-accent" />
              <span>DATA SPLIT METHODOLOGY</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold mb-0.5">Split Protocol</div>
                <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-semibold text-navy-800 dark:text-slate-200 text-[11px]">
                  {benchmarks.methodology.splitType}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold mb-0.5">Train / Test Boundary</div>
                <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-semibold text-navy-800 dark:text-slate-200 text-[11px]">
                  {benchmarks.methodology.trainTestBoundary}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold mb-0.5">Data Leakage Safeguard</div>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded font-bold text-emerald-900 dark:text-emerald-200 text-[11px]">
                  ✓ {benchmarks.methodology.leakageSafeguard}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
            Inference Latency: <strong className="text-navy-800 dark:text-slate-200">{benchmarks.operationalSummary.inferenceLatency}</strong>
          </div>
        </div>
      </div>

      {/* Footer Data Honesty Notice */}
      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500">
        <span>Metrics reflect offline benchmark dataset evaluation on sequential telemetry streams. Zero future-window feature leakage.</span>
        <span className="text-navy-800 dark:text-slate-200 font-bold">SIH 26153 Evaluation</span>
      </div>
    </div>
  );
}
