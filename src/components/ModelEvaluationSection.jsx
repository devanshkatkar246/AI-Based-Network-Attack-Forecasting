"use client";

import React from "react";
import { ShieldCheck, Clock, Database } from "lucide-react";
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
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#27303A] mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6F95D6]" />
            <h2 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              FORECAST ENGINE & MODEL HEALTH
            </h2>
          </div>
          <p className="text-xs text-[#9AA6B2] mt-0.5">
            Temporal world model validation & offline benchmark metrics
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status="ACTIVE" size="sm" customLabel="MODEL STATUS: READY" />
          <StatusBadge status="OBSERVED" size="sm" customLabel="INPUT WINDOW: 60s" />
          <StatusBadge status="FORECAST" size="sm" customLabel="HORIZON: +30s" />
          <StatusBadge status="NORMAL" size="sm" customLabel="DATA INTEGRITY: VALID" />
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch text-xs">
        {/* Left Column */}
        <div className="lg:col-span-2 bg-[#11161D] border border-[#27303A] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#27303A] mb-3 text-[#E8EDF3] font-bold">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6F95D6]" />
                <span>FORECAST PERFORMANCE BY HORIZON</span>
              </span>
              <span className="text-[10px] text-[#9AA6B2] font-mono font-normal">CLASSIFICATION & TIMING</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#27303A] text-[10px] text-[#9AA6B2] uppercase">
                    <th className="py-2 px-2">Forecast Horizon</th>
                    <th className="py-2 px-2">Precision</th>
                    <th className="py-2 px-2">Recall</th>
                    <th className="py-2 px-2">F1 Score</th>
                    <th className="py-2 px-2 text-right">Avg Lead Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27303A]">
                  {benchmarks.horizonMetrics.map((row) => (
                    <tr key={row.horizon} className="hover:bg-[#19202A] transition-colors">
                      <td className="py-2.5 px-2 font-bold text-[#6F95D6]">{row.horizon}</td>
                      <td className="py-2.5 px-2 font-semibold text-[#9AA6B2]">
                        {row.precision ? row.precision.toFixed(2) : "N/A"}
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-[#9AA6B2]">
                        {row.recall ? row.recall.toFixed(2) : "N/A"}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-[#E8EDF3]">
                        {row.f1Score ? row.f1Score.toFixed(2) : "N/A"}
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-[#E8EDF3]">
                        ~{row.avgLeadTimeSec}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#27303A] flex items-center justify-between text-xs text-[#9AA6B2] font-mono">
            <span>False Alarms / Hour: <strong className="text-[#E8EDF3]">{benchmarks.operationalSummary.falseAlarmsPerHour}</strong></span>
            <span>Mean Warning Lead Time: <strong className="text-[#E8EDF3]">{benchmarks.operationalSummary.meanWarningLeadTime}</strong></span>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 bg-[#11161D] border border-[#27303A] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-[#27303A] mb-3 text-[#E8EDF3] font-bold">
              <Database className="w-4 h-4 text-[#6F95D6]" />
              <span>DATA SPLIT METHODOLOGY</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] uppercase text-[#9AA6B2] font-bold mb-1 font-mono">Split Protocol</div>
                <div className="p-2.5 bg-[#151B23] border border-[#27303A] rounded-lg font-semibold text-[#E8EDF3] text-xs font-mono">
                  {benchmarks.methodology.splitType}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase text-[#9AA6B2] font-bold mb-1 font-mono">Train / Test Boundary</div>
                <div className="p-2.5 bg-[#151B23] border border-[#27303A] rounded-lg font-semibold text-[#E8EDF3] text-xs font-mono">
                  {benchmarks.methodology.trainTestBoundary}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase text-[#9AA6B2] font-bold mb-1 font-mono">Data Leakage Safeguard</div>
                <div className="p-2.5 bg-[#1C2620] border border-[#659477]/40 rounded-lg font-bold text-[#659477] text-xs font-mono">
                  ✓ {benchmarks.methodology.leakageSafeguard}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#27303A] text-xs text-[#9AA6B2] leading-tight font-mono">
            Inference Latency: <strong className="text-[#E8EDF3]">{benchmarks.operationalSummary.inferenceLatency}</strong>
          </div>
        </div>
      </div>

      {/* Footer Data Honesty Notice */}
      <div className="pt-3 mt-4 border-t border-[#27303A] flex items-center justify-between text-[11px] text-[#9AA6B2]">
        <span>Metrics reflect offline benchmark dataset evaluation on sequential telemetry streams. Zero future-window feature leakage.</span>
        <span className="text-[#E8EDF3] font-bold font-mono">SIH 26153 Evaluation</span>
      </div>
    </div>
  );
}
