"use client";

import React from "react";
import StatusBadge from "./StatusBadge";
import { AlertCircle } from "lucide-react";

export default function ForecastCard({ scenario }) {
  if (!scenario) return null;

  // Handle MODEL NOT READY / UNAVAILABLE
  if (scenario.modelStatus === "model_not_ready") {
    return (
      <div className="bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323C]">
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#6F7885]">
              MODEL FORECAST
            </h2>
            <div className="text-[10px] font-mono text-[#6F7885]">
              FORECAST ENGINE UNREADY
            </div>
          </div>
          <StatusBadge status="OFFLINE" size="sm" customLabel="MODEL NOT READY" />
        </div>

        <div className="my-4 p-3 bg-[#191F27] border border-[#2A323C] rounded flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#B98A3A] shrink-0 mt-0.5" />
          <div className="font-mono text-xs text-[#9BA4B0] space-y-1">
            <div className="font-bold text-[#E7EAF0]">FORECAST UNAVAILABLE</div>
            <p className="text-[11px] text-[#6F7885]">
              {scenario.modelErrorMessage || "Insufficient temporal history or model checkpoint pending initialization."}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#2A323C] font-mono text-[10px] text-[#6F7885]">
          System status: Awaiting temporal context windows
        </div>
      </div>
    );
  }

  // Extract forecast steps from trajectory
  const forecastSteps =
    scenario.trajectory?.filter(
      (step) => step.status === "FORECAST" || step.semanticState === "forecast" || step.status === "ACTUAL"
    ) || [];

  const primaryForecast = forecastSteps[0] || {
    stage: "Lateral Movement",
    techniqueId: "T1021.002",
    techniqueName: "SMB/PsExec Execution",
    estimatedTime: "+30s",
    targetHost: "FIN-SRV-01 (10.0.4.12)",
  };

  const secondaryForecast = forecastSteps[1] || {
    stage: "Command & Control",
    techniqueId: "T1071.001",
    techniqueName: "Encrypted Web Protocol",
    estimatedTime: "+60s",
    targetHost: "198.51.100.42 (External C2)",
  };

  return (
    <div className="bg-[#151A21] border-2 border-[#718CB8]/40 rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none relative overflow-hidden">
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#718CB8]" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A323C]">
        <div>
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#718CB8]">
            MODEL FORECAST
          </h2>
          <div className="text-[10px] font-mono text-[#9BA4B0]">
            WHAT IS LIKELY TO HAPPEN NEXT?
          </div>
        </div>
        <StatusBadge status="FORECAST" size="sm" customLabel="MODEL PREDICTION" />
      </div>

      {/* Hero Forecast Body */}
      <div className="my-3">
        <div className="text-xl font-mono font-bold text-[#718CB8] leading-tight">
          {primaryForecast.stage}
        </div>
        <div className="text-xs font-mono text-[#E7EAF0] font-semibold mt-1">
          [{primaryForecast.techniqueId}] {primaryForecast.techniqueName}
        </div>

        <div className="mt-2.5 p-2 bg-[#192230] rounded border border-[#718CB8]/30 text-[11px] font-mono space-y-1">
          <div className="flex justify-between">
            <span className="text-[#9BA4B0]">Target Asset:</span>
            <span className="font-bold text-[#E7EAF0]">{primaryForecast.targetHost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9BA4B0]">Forecast Horizon:</span>
            <span className="font-bold text-[#718CB8]">{primaryForecast.estimatedTime || "+30s"}</span>
          </div>
        </div>
      </div>

      {/* Secondary Horizon Footer */}
      <div className="pt-3 border-t border-[#2A323C] font-mono text-[11px] text-[#9BA4B0] flex items-center justify-between">
        <span>Subsequent: <strong className="text-[#E7EAF0]">{secondaryForecast.stage}</strong></span>
        <span className="text-[10px] font-bold text-[#718CB8]">{secondaryForecast.estimatedTime || "+60s"}</span>
      </div>
    </div>
  );
}



