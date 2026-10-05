"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-navy-800 text-white p-2.5 rounded-md shadow-lg font-mono text-xs border border-slate-700">
        <div className="text-[10px] text-slate-400 border-b border-slate-700 pb-1 mb-1 font-semibold">
          TIME: {label}
        </div>
        {data.observed !== null && (
          <div className="flex justify-between gap-4 text-slate-200 text-xs">
            <span>Observed Likelihood:</span>
            <span className="font-bold text-white">{data.observed}%</span>
          </div>
        )}
        {data.forecast !== null && (
          <div className="flex justify-between gap-4 text-forecast text-xs">
            <span>Forecast Likelihood:</span>
            <span className="font-bold">{data.forecast}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function LikelihoodChart({ data }) {
  if (!data) return null;

  return (
    <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* Header & Subtitle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <div>
          <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
            ATTACK LIKELIHOOD
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Projected malicious behaviour over time
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-slate-800" />
            <span className="text-slate-600 font-medium">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-forecast border-t border-dashed border-forecast" />
            <span className="text-forecast font-bold">Forecast Horizon</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fontFamily: "monospace", fill: "#64748B" }}
              stroke="#E2E8F0"
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 10, fontFamily: "monospace", fill: "#64748B" }}
              stroke="#E2E8F0"
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Vertical Marker at NOW */}
            <ReferenceLine
              x="NOW"
              stroke="#0F172A"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: "NOW",
                fill: "#0F172A",
                fontSize: 10,
                position: "top",
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            />

            {/* Forecast Region Area Shading */}
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="none"
              fill="url(#forecastShade)"
              connectNulls={false}
            />

            {/* Observed Line (Solid) */}
            <Line
              type="monotone"
              dataKey="observed"
              stroke="#1E293B"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "#1E293B" }}
              connectNulls={false}
            />

            {/* Forecast Line (Dashed) */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#6366F1"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 3.5, fill: "#6366F1", stroke: "#EEF2FF", strokeWidth: 1.5 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Timeline: Past (-90s) → Present (NOW) → Projected (+90s)</span>
        <span className="text-forecast font-bold">Temporal Trajectory</span>
      </div>
    </div>
  );
}
