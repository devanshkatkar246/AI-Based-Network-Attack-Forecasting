"use client";

import React from "react";
import StatusBadge from "./StatusBadge";
import { AlertCircle } from "lucide-react";

export default function ForecastCard({ scenario }) {
  if (!scenario) return null;

  // Handle MODEL NOT READY / UNAVAILABLE
  if (scenario.modelStatus === "model_not_ready") {
    return (
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#27303A]">
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#6C7987]">
              MODEL FORECAST
            </h2>
            <div className="text-[10px] font-mono text-[#6C7987]">
              FORECAST ENGINE UNREADY
            </div>
          </div>
          <StatusBadge status="OFFLINE" size="sm" customLabel="MODEL NOT READY" />
        </div>

        <div className="my-4 p-3.5 bg-[#19202A] border border-[#27303A] rounded-lg flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#C59A45] shrink-0 mt-0.5" />
          <div className="text-xs text-[#9AA6B2] space-y-1">
            <div className="font-bold text-[#E8EDF3]">FORECAST UNAVAILABLE</div>
            <p className="text-[11px] text-[#6C7987]">
              {scenario.modelErrorMessage || "Insufficient temporal history or model checkpoint pending initialization."}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#27303A] font-mono text-[10px] text-[#6C7987]">
          System status: Awaiting temporal context windows
        </div>
      </div>
    );
  }

  // Extract forecast steps from trajectory
  const forecastSteps =
    scenario.trajectory?.filter(
      (step) => (step.status === "FORECAST" || step.semanticState === "forecast" || step.status === "PENDING") && !step.isCurrent
    ) || [];

  if (forecastSteps.length === 0) {
    return (
      <div className="bg-[#151B23] border-2 border-[#6F95D6]/40 rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#6F95D6]" />
        <div className="flex items-center justify-between pb-3 border-b border-[#27303A]">
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#6F95D6]">
              MODEL FORECAST
            </h2>
            <div className="text-[10px] font-mono text-[#9AA6B2]">
              WHAT IS LIKELY TO HAPPEN NEXT?
            </div>
          </div>
          <StatusBadge status="FORECAST" size="sm" customLabel="MODEL STANDBY" />
        </div>

        <div className="my-4 p-3.5 bg-[#19202A] border border-[#27303A] rounded-lg text-xs text-[#9AA6B2] space-y-1">
          <div className="font-bold text-[#E8EDF3]">AWAITING FORECAST ROLLOUT</div>
          <p className="text-[11px] text-[#6C7987]">
            Model evaluates temporal network state context. Advance replay tick to generate forecast.
          </p>
        </div>

        <div className="pt-3 border-t border-[#27303A] font-mono text-[10px] text-[#6C7987]">
          Status: Context initialization
        </div>
      </div>
    );
  }

  const primaryForecast = forecastSteps[0];
  const secondaryForecast = forecastSteps.length > 1 ? forecastSteps[1] : null;

  return (
    <div className="bg-[#151B23] border-2 border-[#6F95D6]/50 rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none relative overflow-hidden">
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#6F95D6]" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27303A]">
        <div>
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#6F95D6]">
            MODEL FORECAST
          </h2>
          <div className="text-[10px] text-[#9AA6B2]">
            WHAT IS LIKELY TO HAPPEN NEXT?
          </div>
        </div>
        <StatusBadge
          status={scenario.verificationStatus?.badgeType || "FORECAST"}
          size="sm"
          customLabel={scenario.verificationStatus?.label || "MODEL PREDICTION"}
        />
      </div>

      {/* Hero Forecast Body */}
      <div className="my-3">
        <div className="text-2xl font-bold text-[#6F95D6] leading-tight tracking-tight">
          {primaryForecast.stage}
        </div>
        <div className="text-xs text-[#E8EDF3] font-medium mt-1">
          {primaryForecast.techniqueId ? (
            <span>
              <span className="font-mono text-[#9AA6B2] font-semibold">[{primaryForecast.techniqueId}]</span>{" "}
              {primaryForecast.techniqueName || ""}
            </span>
          ) : (
            primaryForecast.techniqueName || "Modelled Behavior Transition"
          )}
        </div>

        <div className="mt-3 p-2.5 bg-[#19202A] rounded-lg border border-[#27303A] text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[#9AA6B2]">Target Asset:</span>
            <span className="font-bold text-[#E8EDF3] truncate max-w-[180px] font-mono text-[11px]">
              {primaryForecast.targetHost || "Monitored Subnet"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#9AA6B2]">Forecast Horizon:</span>
            <span className="font-bold font-mono text-[#6F95D6]">{primaryForecast.estimatedTime || "+10s"}</span>
          </div>
        </div>
      </div>

      {/* Secondary Horizon Footer */}
      <div className="pt-3 border-t border-[#27303A] text-xs text-[#9AA6B2] flex items-center justify-between">
        {secondaryForecast ? (
          <>
            <span>Subsequent: <strong className="text-[#E8EDF3] font-medium">{secondaryForecast.stage}</strong></span>
            <span className="text-[11px] font-bold font-mono text-[#6F95D6]">{secondaryForecast.estimatedTime || "+20s"}</span>
          </>
        ) : (
          <span className="text-[11px]">Single Horizon Prediction (+10s)</span>
        )}
      </div>
    </div>
  );
}



