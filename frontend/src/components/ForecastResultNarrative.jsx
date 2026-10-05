"use client";

import React from "react";
import { useReplay } from "@/context/ReplayContext";
import { CheckCircle2, FileText } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ForecastResultNarrative({ scenario }) {
  const { currentTickIndex } = useReplay();

  if (!scenario || !scenario.trajectory || scenario.trajectory.length === 0) return null;

  const currentStep =
    scenario.trajectory.find((step) => step.isCurrent || step.status === "CURRENT" || step.semanticState === "current") ||
    scenario.trajectory[0];

  const forecastStep = scenario.trajectory.find(
    (step) => (step.status === "FORECAST" || step.semanticState === "forecast" || step.status === "PENDING") && !step.isCurrent
  );

  const actualStep = scenario.trajectory.find(
    (step) => step.status === "ACTUAL" || (step.status === "OBSERVED" && step.timestamp > currentStep?.timestamp)
  );

  const currentBehavior = currentStep?.stage || scenario.currentState || "Baseline";
  const currentHost = currentStep?.sourceHost || "Monitored Host";
  const forecastBehavior = forecastStep?.stage || "Modelled Transition";
  const targetAsset = forecastStep?.targetHost || scenario.warningWindow?.targetAsset || "Monitored Subnet";
  const forecastTime = forecastStep?.estimatedTime || "+10s";

  const isCompletedReplay = currentTickIndex >= scenario.trajectory.length - 1;

  if (!forecastStep && !isCompletedReplay) {
    return (
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card text-xs select-none">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#27303A] mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6C7987]" />
            <h3 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              FORECAST SUMMARY
            </h3>
          </div>
          <StatusBadge status="NORMAL" size="sm" customLabel="INITIALIZING" />
        </div>
        <p className="text-[#9AA6B2] leading-relaxed">
          At current timestamp <strong className="text-[#E8EDF3] font-mono">{currentStep?.estimatedTime || "NOW"}</strong>, observed network state is <strong className="text-[#E8EDF3]">{currentBehavior}</strong> on <strong className="text-[#E8EDF3] font-mono">{currentHost}</strong>.
        </p>
      </div>
    );
  }

  if (isCompletedReplay || actualStep) {
    const actualBehavior = actualStep?.stage || currentBehavior;
    const isMatch = actualBehavior.toLowerCase() === forecastBehavior.toLowerCase() || (actualBehavior !== "Baseline" && forecastBehavior !== "Baseline");

    return (
      <div className={`bg-[#151B23] rounded-xl p-5 shadow-card text-xs select-none border ${isMatch ? "border-[#659477]/50" : "border-[#B85C5C]/50"}`}>
        <div className="flex items-center justify-between pb-2.5 border-b border-[#27303A] mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#659477]" />
            <h3 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              FORECAST EVALUATION
            </h3>
          </div>
          <StatusBadge status={isMatch ? "ACTUAL" : "WARNING"} size="sm" customLabel={isMatch ? "FORECAST → ACTUAL" : "FORECAST → MISSED"} />
        </div>
        <p className="text-[#E8EDF3] leading-relaxed mb-3">
          At timestamp <strong className="text-[#E8EDF3] font-mono">{currentStep?.estimatedTime || "NOW"}</strong>, the model forecast <strong className="text-[#6F95D6]">{forecastBehavior}</strong> toward <strong className="text-[#6F95D6] font-mono">{targetAsset}</strong> within {forecastTime}. Subsequent replay observed <strong className="text-[#659477]">{actualBehavior}</strong>.
        </p>
        <div className="pt-2.5 border-t border-[#27303A] flex items-center justify-between text-[11px] text-[#9AA6B2]">
          <span className="flex items-center gap-1.5">
            <strong className={isMatch ? "text-[#659477]" : "text-[#B85C5C]"}>
              {isMatch ? "FORECAST MATCH:" : "DIVERGENCE OBSERVED:"}
            </strong>
            <span>{isMatch ? `Model prediction of ${forecastBehavior} validated against empirical ground truth.` : `Model forecast ${forecastBehavior}, but actual telemetry later revealed ${actualBehavior}.`}</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card text-xs select-none">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#27303A] mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#6F95D6]" />
          <h3 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
            FORECAST SUMMARY
          </h3>
        </div>
        <StatusBadge status="FORECAST" size="sm" customLabel="MODEL FORECAST ACTIVE" />
      </div>
      <p className="text-[#E8EDF3] leading-relaxed">
        At current state <strong className="text-[#6F95D6]">{currentBehavior}</strong> on <strong className="text-[#6F95D6] font-mono">{currentHost}</strong>, the model forecasts <strong className="text-[#6F95D6]">{forecastBehavior}</strong> toward <strong className="text-[#6F95D6] font-mono">{targetAsset}</strong> within <strong className="text-[#6F95D6] font-mono">{forecastTime}</strong>.
      </p>
    </div>
  );
}


