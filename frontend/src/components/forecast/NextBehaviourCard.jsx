"use client";

import React from "react";
import { Target, Activity } from "lucide-react";

export default function NextBehaviourCard({
  horizonData,
  selectedHorizon,
  onSelectHorizon,
}) {
  const cleanSelected = selectedHorizon ? selectedHorizon.replace("+", "") : "";
  const normHorizon = cleanSelected ? `+${cleanSelected}` : (horizonData?.[0]?.horizon || "+10s");

  const activeItem =
    horizonData?.find((h) => h.horizon === normHorizon || h.horizon.replace("+", "") === cleanSelected) ||
    horizonData?.[0] || {
      horizon: "+10s",
      probability: null,
      label: "Forecast Horizon",
      stage: "Modelled Transition",
      technique: "MITRE Attack Transition",
      targetAsset: "Monitored Subnet",
      warningSec: 10,
    };

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#27303A] mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#6F95D6]" />
            <h2 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
              NEXT LIKELY BEHAVIOUR
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#6F95D6] bg-[#19202A] px-2 py-0.5 rounded uppercase border border-[#27303A] font-mono">
            {activeItem.horizon} HORIZON
          </span>
        </div>

        {/* Dynamic Horizon Hero Box */}
        <div className="p-4 bg-[#11161D] border border-[#27303A] rounded-lg mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] text-[#9AA6B2] uppercase font-semibold font-mono">
                Projected Attack Vector
              </div>
              <div className="text-lg font-bold text-[#E8EDF3] leading-tight mt-0.5">
                {activeItem.stage}
              </div>
              <div className="text-xs text-[#9AA6B2] mt-0.5 font-mono">
                {activeItem.technique}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-[#6F95D6] font-mono">
                {activeItem.probability !== null && activeItem.probability !== undefined
                  ? `${activeItem.probability}%`
                  : "N/A"}
              </div>
              <div className="text-[10px] text-[#9AA6B2] font-semibold uppercase font-mono">
                {activeItem.probability !== null && activeItem.probability !== undefined
                  ? "Model Prediction"
                  : "Confidence Unavailable"}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#27303A] flex items-center justify-between text-xs font-mono">
            <span className="text-[#9AA6B2] text-[11px] flex items-center gap-1.5 font-sans">
              <Target className="w-3.5 h-3.5 text-[#B85C5C] flex-shrink-0" /> Target Asset:
            </span>
            <span className="font-bold text-[#E8EDF3] truncate max-w-[220px]">{activeItem.targetAsset}</span>
          </div>
        </div>

        {/* Forecast Horizon Intensity Rows */}
        <div className="space-y-2 mb-4">
          <div className="text-[10px] uppercase text-[#9AA6B2] font-semibold tracking-wider font-mono">
            FORECAST HORIZONS
          </div>
          {horizonData?.map((item) => {
            const isSelected = item.horizon === activeItem.horizon;
            return (
              <div
                key={item.horizon}
                onClick={() => onSelectHorizon && onSelectHorizon(item.horizon.replace("+", ""))}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "bg-[#1E2632] border border-[#6F95D6] font-bold" : "hover:bg-[#19202A] border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`w-12 ${isSelected ? "text-[#E8EDF3] font-bold" : "text-[#9AA6B2]"}`}>
                    {item.horizon}
                  </span>
                  <span className="text-[#E8EDF3] font-medium flex-1 px-2 truncate font-sans text-xs">
                    {item.stage}
                  </span>
                  <span className="text-[#6F95D6] font-bold">
                    {item.probability !== null && item.probability !== undefined ? `${item.probability}%` : "—"}
                  </span>
                </div>
                <div className="w-full bg-[#11161D] h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected ? "bg-[#6F95D6]" : "bg-[#27303A]"
                    }`}
                    style={{ width: `${item.probability || 50}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Warning Window */}
      <div className="pt-3 border-t border-[#27303A]">
        <div className="flex items-center justify-between text-[11px] text-[#9AA6B2] uppercase font-semibold mb-2 font-mono">
          <span>Actionable Warning Window</span>
          <span className="text-[#C59A45] font-bold">~{activeItem.warningSec || 30}s Lead Time</span>
        </div>

        <div className="bg-[#11161D] border border-[#27303A] rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#E8EDF3]">NOW</span>
            <span className="text-[10px] text-[#9AA6B2]">Active State</span>
          </div>

          <div className="flex-1 flex flex-col items-center px-3">
            <span className="text-[10px] font-bold text-[#C59A45] uppercase">
              Warning Window ({activeItem.warningSec || 30}s)
            </span>
            <div className="w-full h-1 bg-[#2A2318] rounded my-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#C59A45] rounded" />
            </div>
          </div>

          <div className="flex flex-col items-center text-right">
            <span className="font-bold text-[#6F95D6]">{activeItem.stage}</span>
            <span className="text-[10px] text-[#9AA6B2]">{activeItem.horizon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

