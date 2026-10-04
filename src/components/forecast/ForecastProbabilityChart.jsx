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

import { useTheme } from "@/context/ThemeContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const val = data.forecast ?? data.observed;
    return (
      <div className="bg-[#17191C] text-white p-2.5 rounded-md shadow-lg font-mono text-xs border border-[#314B78]">
        <div className="text-[10px] text-[#8B8D91] border-b border-slate-700 pb-1 mb-1 font-semibold">
          HORIZON: {label}
        </div>
        {val !== null && (
          <div className="flex justify-between gap-4 text-[#657A9C] text-xs">
            <span>Projection Level:</span>
            <span className="font-bold">{val}%</span>
          </div>
        )}
        {data.upper !== null && (
          <div className="flex justify-between gap-4 text-slate-400 text-[10px] mt-0.5">
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || data.length === 0) return null;

  const horizonLabel = selectedHorizon
    ? selectedHorizon.startsWith("+") ? selectedHorizon : `+${selectedHorizon}`
    : "+30s";

  const axisStroke = isDark ? "#334155" : "#E5E1D8";
  const axisTickFill = isDark ? "#94A3B8" : "#5F6268";
  const nowMarkerColor = isDark ? "#F8FAFC" : "#17191C";
  const observedLineColor = isDark ? "#94A3B8" : "#5F6268";

  return (
    <div className="bg-[#FFFDF8] dark:bg-slate-900 border border-[#E5E1D8] dark:border-slate-800 rounded-xl p-5 shadow-subtle h-full flex flex-col justify-between font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] dark:border-slate-800 mb-2">
        <div>
          <h2 className="text-xs font-bold text-[#17191C] dark:text-slate-100 uppercase tracking-wider">
            FORECAST TRAJECTORY CURVE
          </h2>
          <p className="text-[11px] text-[#5F6268] dark:text-slate-500 mt-0.5">
            Observed history (T-90s → NOW) and forecast horizon projections
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#5F6268] dark:bg-slate-300" />
            <span className="text-[#5F6268] dark:text-slate-300 font-medium">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#314B78] border-t border-dashed border-[#314B78]" />
            <span className="text-[#314B78] font-bold">Forecast</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="projectedRangeShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#314B78" stopOpacity={isDark ? 0.35 : 0.15} />
                <stop offset="95%" stopColor="#314B78" stopOpacity={0.01} />
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
              stroke="#314B78"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              label={{
                value: horizonLabel,
                fill: "#314B78",
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
              stroke="#314B78"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: "#314B78", stroke: isDark ? "#1E293B" : "#FFFDF8", strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#E5E1D8] dark:border-slate-800 flex items-center justify-between text-[10px] text-[#8B8D91] dark:text-slate-500">
        <span>Demonstration Forecast Projection</span>
        <span className="text-[#314B78] font-bold">Selected Horizon: {horizonLabel}</span>
      </div>
    </div>
  );
}


