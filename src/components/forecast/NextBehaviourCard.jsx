"use client";

import React from "react";
import { Target, Activity } from "lucide-react";
import StatusBadge from "../StatusBadge";

export default function NextBehaviourCard({
  horizonData,
  selectedHorizon,
  onSelectHorizon,
}) {
  const normHorizon = selectedHorizon
    ? selectedHorizon.startsWith("+") ? selectedHorizon : `+${selectedHorizon}`
    : "+30s";

  // Match active horizon item from canonical horizonData
  const activeItem =
    horizonData?.find((h) => h.horizon === normHorizon) ||
    horizonData?.[0] || {
      horizon: "+30s",
      probability: 64,
      label: "Medium Likelihood",
      stage: "Lateral Movement",
      technique: "SMB/PsExec Execution (T1021.002)",
      targetAsset: "FIN-SRV-01 (10.0.4.12)",
      warningSec: 30,
    };

  return (
    <div className="bg-[#FFFDF8] dark:bg-slate-900 border border-[#E5E1D8] dark:border-slate-800 rounded-xl p-5 shadow-subtle h-full flex flex-col justify-between font-mono">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E1D8] dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#314B78]" />
            <h2 className="text-xs font-bold text-[#17191C] dark:text-slate-100 uppercase tracking-wider">
              NEXT LIKELY BEHAVIOUR
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#314B78] bg-[#F7F5EE] dark:bg-indigo-950/60 px-2 py-0.5 rounded uppercase border border-[#E5E1D8]">
            {activeItem.horizon} HORIZON
          </span>
        </div>

        {/* Dynamic Horizon Hero Box */}
        <div className="p-4 bg-[#F7F5EE] dark:bg-slate-800/60 border border-[#D6D1C5] dark:border-indigo-800/80 rounded-lg mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] text-[#8B8D91] dark:text-slate-500 uppercase font-semibold">
                Projected Attack Vector
              </div>
              <div className="text-base font-bold text-[#17191C] dark:text-slate-100 leading-tight mt-0.5">
                {activeItem.stage}
              </div>
              <div className="text-xs text-[#5F6268] dark:text-slate-300 mt-0.5">
                {activeItem.technique}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-[#314B78]">
                {activeItem.probability}%
              </div>
              <div className="text-[9px] text-[#8B8D91] dark:text-slate-500 font-semibold uppercase">
                Model Prediction
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#E5E1D8] dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <span className="text-[#5F6268] dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#9A4D48] flex-shrink-0" /> Target Asset:
            </span>
            <span className="font-bold text-[#17191C] dark:text-slate-100 truncate">{activeItem.targetAsset}</span>
          </div>
        </div>

        {/* Forecast Horizon Intensity Rows */}
        <div className="space-y-2 mb-4">
          <div className="text-[10px] uppercase text-[#8B8D91] dark:text-slate-500 font-semibold tracking-wider">
            FORECAST HORIZONS
          </div>
          {horizonData?.map((item) => {
            const isSelected = item.horizon === activeItem.horizon;
            return (
              <div
                key={item.horizon}
                onClick={() => onSelectHorizon && onSelectHorizon(item.horizon.replace("+", ""))}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  isSelected ? "bg-[#F7F5EE] dark:bg-slate-800 border border-[#D6D1C5] dark:border-slate-700 font-bold" : "hover:bg-[#FBFAF6] dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`w-12 ${isSelected ? "text-[#17191C] dark:text-slate-100 font-bold" : "text-[#5F6268] dark:text-slate-400"}`}>
                    {item.horizon}
                  </span>
                  <span className="text-[#17191C] dark:text-slate-300 font-semibold flex-1 px-2 truncate">
                    {item.stage}
                  </span>
                  <span className="text-[#314B78] font-bold">{item.probability}%</span>
                </div>
                <div className="w-full bg-[#E5E1D8] dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected ? "bg-[#314B78]" : "bg-[#657A9C]"
                    }`}
                    style={{ width: `${item.probability}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Warning Window */}
      <div className="pt-3 border-t border-[#E5E1D8] dark:border-slate-800">
        <div className="flex items-center justify-between text-[10px] text-[#8B8D91] dark:text-slate-500 uppercase font-semibold mb-2">
          <span>Actionable Warning Window</span>
          <span className="text-[#B68432] font-bold">~{activeItem.warningSec || 30}s Lead Time</span>
        </div>

        <div className="bg-[#F7F5EE] dark:bg-slate-800/60 border border-[#E5E1D8] dark:border-slate-700 rounded-lg p-2.5 flex items-center justify-between text-[11px]">
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#17191C] dark:text-slate-100">NOW</span>
            <span className="text-[9px] text-[#8B8D91]">Privilege Access</span>
          </div>

          <div className="flex-1 flex flex-col items-center px-3">
            <span className="text-[9px] font-bold text-[#B68432] uppercase">
              Warning Window ({activeItem.warningSec || 30}s)
            </span>
            <div className="w-full h-1 bg-[#E5E1D8] dark:bg-amber-950 rounded my-0.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#B68432] rounded" />
            </div>
          </div>

          <div className="flex flex-col items-center text-right">
            <span className="font-bold text-[#314B78]">{activeItem.stage}</span>
            <span className="text-[9px] text-[#8B8D91]">{activeItem.horizon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


