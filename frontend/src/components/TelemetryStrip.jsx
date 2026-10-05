"use client";

import React from "react";
import StatusBadge from "./StatusBadge";

export default function TelemetryStrip({ telemetry }) {
  if (!telemetry) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
      {/* Active Hosts */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
        <div>
          <div className="text-base font-bold text-[#E8EDF3] font-mono leading-tight">
            {telemetry.activeHosts}
          </div>
          <div className="text-[11px] text-[#9AA6B2] uppercase tracking-wide font-medium">
            Active Hosts
          </div>
        </div>
      </div>

      {/* Active Flows */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
        <div>
          <div className="text-base font-bold text-[#E8EDF3] font-mono leading-tight">
            {telemetry.activeFlows}
          </div>
          <div className="text-[11px] text-[#9AA6B2] uppercase tracking-wide font-medium">
            Active Flows
          </div>
        </div>
      </div>

      {/* Telemetry Throughput */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
        <div>
          <div className="text-base font-bold text-[#E8EDF3] font-mono leading-tight">
            {telemetry.trafficMbps}
          </div>
          <div className="text-[11px] text-[#9AA6B2] uppercase tracking-wide font-medium">
            Throughput
          </div>
        </div>
      </div>

      {/* Network State */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-lg px-4 py-2.5 flex items-center justify-between shadow-subtle">
        <div>
          <div className="mt-0.5">
            <StatusBadge status={telemetry.networkState} size="sm" />
          </div>
          <div className="text-[11px] text-[#9AA6B2] uppercase tracking-wide font-medium mt-1">
            Network State
          </div>
        </div>
      </div>
    </div>
  );
}


