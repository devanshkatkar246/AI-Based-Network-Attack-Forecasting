import React from "react";

/**
 * Visual badge for OBSERVED, FORECAST, WARNING WINDOW, OFFLINE, ELEVATED, etc.
 * Uses strict visual language distinction between solid (OBSERVED) and dashed/glowing (FORECAST).
 */
export default function StatusBadge({ status, size = "md", customLabel, className = "" }) {
  const norm = (status || "").toUpperCase();

  const isForecast = norm === "FORECAST" || norm.includes("FORECAST");
  const isObserved = norm === "OBSERVED" || norm.includes("OBSERVED");
  const isWarning = norm === "WARNING" || norm === "WARNING WINDOW" || norm === "ELEVATED";
  const isCritical = norm === "CRITICAL" || norm === "HIGH RISK";
  const isOffline = norm === "OFFLINE";
  const isNormal = norm === "NORMAL" || norm === "CLEAN";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] tracking-wider",
    md: "px-2.5 py-1 text-xs tracking-wider",
    lg: "px-3 py-1.5 text-xs font-semibold tracking-wider",
  }[size] || "px-2.5 py-1 text-xs";

  if (isForecast) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold border border-dashed rounded text-forecast bg-forecast-light border-forecast-border dark:bg-indigo-950/60 dark:border-indigo-700/60 dark:text-indigo-300 shadow-subtle ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-forecast animate-pulse-subtle" />
        {customLabel || "FORECAST"}
      </span>
    );
  }

  if (isObserved) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold border rounded text-slate-800 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 dark:bg-slate-300" />
        {customLabel || "OBSERVED"}
      </span>
    );
  }

  if (isWarning) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold border rounded text-warning bg-warning-light border-warning-border dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60 ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse-subtle" />
        {customLabel || status}
      </span>
    );
  }

  if (isCritical) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold border rounded text-critical bg-critical-light border-critical-border dark:bg-red-950/60 dark:text-red-300 dark:border-red-700/60 ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-critical animate-ping" />
        {customLabel || status}
      </span>
    );
  }

  if (isOffline) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase text-slate-500 bg-slate-100 border border-slate-200 rounded dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
        {customLabel || "OFFLINE"}
      </span>
    );
  }

  // Default normal status
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase text-slate-700 bg-slate-100 border border-slate-200 rounded dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${sizeClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-400" />
      {customLabel || status}
    </span>
  );
}
