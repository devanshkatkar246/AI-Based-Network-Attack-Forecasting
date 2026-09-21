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
          TIME HORIZON: {label}
        </div>
        {data.forecast !== null && (
          <div className="flex justify-between gap-4 text-forecast text-xs">
            <span>Forecast Probability:</span>
            <span className="font-bold">{data.forecast}%</span>
          </div>
        )}
        {data.upper !== null && (
          <div className="flex justify-between gap-4 text-slate-400 text-[10px] mt-0.5">
            <span>Projected Range:</span>
            <span>{data.lower}% - {data.upper}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function ForecastProbabilityChart({ data }) {
  if (!data) return null;

  return (
    <div className="bg-surface border border-slate-200/90 rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <div>
          <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
            FORECAST PROBABILITY & UNCERTAINTY RANGE
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Probability trajectory curve (NOW → +120s)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-forecast border-t border-dashed border-forecast" />
            <span className="text-forecast font-bold">Forecast Curve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-forecast/20 rounded border border-forecast/40" />
            <span className="text-slate-500 font-medium">Projected Range</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="projectedRangeShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
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

            {/* Marker for Peak Forecast at +60s */}
            <ReferenceLine
              x="+60s"
              stroke="#6366F1"
              strokeWidth={1}
              strokeDasharray="2 2"
              label={{
                value: "● 81% Peak",
                fill: "#6366F1",
                fontSize: 10,
                position: "top",
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            />

            {/* Shaded Projected Uncertainty Range Area */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#projectedRangeShade)"
            />

            {/* Forecast Line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#6366F1"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: "#6366F1", stroke: "#EEF2FF", strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Annotation */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Projected uncertainty range shaded area</span>
        <span className="text-forecast font-bold">Lateral Movement (+60s Horizon)</span>
      </div>
    </div>
  );
}
