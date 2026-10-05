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
    const val = data.forecast ?? data.observed;
    return (
      <div className="bg-[#11161D] text-[#E8EDF3] p-2.5 rounded-lg shadow-lg font-mono text-xs border border-[#6F95D6]/40">
        <div className="text-[10px] text-[#9AA6B2] border-b border-[#27303A] pb-1 mb-1 font-semibold">
          HORIZON: {label}
        </div>
        {val !== null && (
          <div className="flex justify-between gap-4 text-[#6F95D6] text-xs">
            <span>Projection Level:</span>
            <span className="font-bold">{val}%</span>
          </div>
        )}
        {data.upper !== null && (
          <div className="flex justify-between gap-4 text-[#9AA6B2] text-[10px] mt-0.5">
            <span>Bounds:</span>
            <span>{data.lower}% – {data.upper}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function ForecastProbabilityChart({ data, selectedHorizon }) {
  if (!data || data.length === 0) return null;

  const horizonLabel = selectedHorizon
    ? selectedHorizon.startsWith("+") ? selectedHorizon : `+${selectedHorizon}`
    : "+30s";

  const axisStroke = "#27303A";
  const axisTickFill = "#9AA6B2";
  const nowMarkerColor = "#E8EDF3";
  const observedLineColor = "#9AA6B2";

  return (
    <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card h-full flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27303A] mb-2">
        <div>
          <h2 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
            FORECAST TRAJECTORY CURVE
          </h2>
          <p className="text-xs text-[#9AA6B2] mt-0.5">
            Observed history (T-90s → NOW) and forecast horizon projections
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#9AA6B2]" />
            <span className="text-[#9AA6B2] font-medium">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#6F95D6] border-t border-dashed border-[#6F95D6]" />
            <span className="text-[#6F95D6] font-bold">Forecast</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="projectedRangeShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6F95D6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6F95D6" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fontFamily: "monospace", fill: axisTickFill }}
              stroke={axisStroke}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 10, fontFamily: "monospace", fill: axisTickFill }}
              stroke={axisStroke}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Vertical Marker at NOW */}
            <ReferenceLine
              x="NOW"
              stroke={nowMarkerColor}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: "NOW",
                fill: nowMarkerColor,
                fontSize: 10,
                position: "top",
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            />

            {/* Vertical Marker for Selected Horizon */}
            <ReferenceLine
              x={horizonLabel}
              stroke="#6F95D6"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              label={{
                value: horizonLabel,
                fill: "#6F95D6",
                fontSize: 10,
                position: "top",
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            />

            {/* Shaded Bounds */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#projectedRangeShade)"
            />

            {/* Observed Past Line */}
            <Line
              type="monotone"
              dataKey="observed"
              stroke={observedLineColor}
              strokeWidth={2}
              dot={{ r: 3.5, fill: observedLineColor }}
            />

            {/* Forecast Line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#6F95D6"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: "#6F95D6", stroke: "#11161D", strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#27303A] flex items-center justify-between text-xs text-[#9AA6B2] font-mono">
        <span>Forecast Projection — Model Rollout</span>
        <span className="text-[#6F95D6] font-bold">Selected Horizon: {horizonLabel}</span>
      </div>
    </div>
  );
}
