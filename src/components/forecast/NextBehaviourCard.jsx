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
    <div className="bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between font-mono">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-forecast" />
            <h2 className="text-xs font-bold text-navy-800 dark:text-slate-100 uppercase tracking-wider">
              NEXT LIKELY BEHAVIOUR
            </h2>
          </div>
          <span className="text-[10px] font-bold text-forecast bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded uppercase">
            {activeItem.horizon} HORIZON
          </span>
        </div>

        {/* Dynamic Horizon Hero Box */}
        <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-lg mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                Projected Attack Vector
              </div>
              <div className="text-base font-bold text-navy-800 dark:text-slate-100 leading-tight mt-0.5">
                {activeItem.stage}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {activeItem.technique}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-forecast">
                {activeItem.probability}%
              </div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                Demonstration Forecast
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-red-500 flex-shrink-0" /> Target Asset:
            </span>
            <span className="font-bold text-navy-800 dark:text-slate-100 truncate">{activeItem.targetAsset}</span>
          </div>
        </div>

        {/* Forecast Horizon Intensity Rows */}
        <div className="space-y-2 mb-4">
          <div className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-semibold tracking-wider">
            FORECAST HORIZONS
          </div>
          {horizonData?.map((item) => {
            const isSelected = item.horizon === activeItem.horizon;
            return (
              <div
                key={item.horizon}
                onClick={() => onSelectHorizon && onSelectHorizon(item.horizon.replace("+", ""))}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  isSelected ? "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`w-12 ${isSelected ? "text-navy-800 dark:text-slate-100 font-bold" : "text-slate-600 dark:text-slate-400"}`}>
                    {item.horizon}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold flex-1 px-2 truncate">
                    {item.stage}
                  </span>
                  <span className="text-forecast font-bold">{item.probability}%</span>
                </div>
                <div className="w-full bg-slate-200/70 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected ? "bg-accent" : "bg-forecast/60"
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
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold mb-2">
          <span>Actionable Warning Window</span>
          <span className="text-amber-700 dark:text-amber-400 font-bold">~{activeItem.warningSec || 30}s Lead Time</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 flex items-center justify-between text-[11px]">
          <div className="flex flex-col items-center">
            <span className="font-bold text-navy-800 dark:text-slate-100">NOW</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500">Privilege Access</span>
          </div>

          <div className="flex-1 flex flex-col items-center px-3">
            <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase">
              Warning Window ({activeItem.warningSec || 30}s)
            </span>
            <div className="w-full h-1 bg-amber-200 dark:bg-amber-950 rounded my-0.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-amber-500 rounded" />
            </div>
          </div>

          <div className="flex flex-col items-center text-right">
            <span className="font-bold text-forecast">{activeItem.stage}</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500">{activeItem.horizon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

