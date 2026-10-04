import React from "react";

/**
 * Visual badge for OBSERVED, CURRENT, FORECAST, ACTUAL, WARNING WINDOW, OFFLINE, ELEVATED, etc.
 * Strictly encodes epistemic state across warm monochromatic design tokens.
 */
export default function StatusBadge({ status, size = "md", customLabel, className = "" }) {
  const norm = (status || "").toUpperCase();

  const isCurrent = norm === "CURRENT" || norm === "NOW";
  const isActual = norm === "ACTUAL" || norm.includes("ACTUAL");
  const isForecast = norm === "FORECAST" || norm.includes("FORECAST");
  const isObserved = norm === "OBSERVED" || norm.includes("OBSERVED");
  const isWarning = norm === "WARNING" || norm === "WARNING WINDOW" || norm === "ELEVATED";
  const isCritical = norm === "CRITICAL" || norm === "HIGH RISK";
  const isOffline = norm === "OFFLINE";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px] tracking-wider font-mono font-bold",
    md: "px-2.5 py-1 text-[10px] tracking-wider font-mono font-bold",
    lg: "px-3 py-1.5 text-xs tracking-wider font-mono font-bold",
  }[size] || "px-2.5 py-1 text-[10px] font-mono font-bold";

  if (isCurrent) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-bold border rounded bg-[#314B78] text-[#FFFDF8] border-[#314B78] shadow-subtle ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFFDF8] animate-pulse-subtle" />
        {customLabel || "CURRENT"}
      </span>
    );
  }

  if (isActual) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-bold border rounded text-[#557A62] bg-[#F1F5F2] border-[#A5BDAC] dark:bg-[#1C2620] dark:text-[#8BB098] dark:border-[#385242] ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#557A62] dark:bg-[#8BB098]" />
        {customLabel || "ACTUAL"}
      </span>
    );
  }

  if (isForecast) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-bold border border-dashed rounded text-[#314B78] bg-[#F0F4F9] border-[#657A9C] dark:bg-[#1E2633] dark:border-[#657A9C] dark:text-[#9AB0D3] ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full border border-[#314B78] dark:border-[#9AB0D3] bg-transparent" />
        {customLabel || "MODEL FORECAST"}
      </span>
    );
  }

  if (isObserved) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-bold border rounded text-[#17191C] bg-[#FBFAF6] border-[#D6D1C5] dark:bg-[#25282D] dark:text-[#F7F5EE] dark:border-[#3D4045] ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#5F6268] dark:bg-[#8B8D91]" />
        {customLabel || "OBSERVED"}
      </span>
    );
  }

  if (isWarning) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-bold border rounded text-[#B68432] bg-[#FAF6EF] border-[#E2D3B8] dark:bg-[#2A2318] dark:text-[#D4A757] dark:border-[#4A3C26] ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#B68432]" />
        {customLabel || status}
      </span>
    );
  }

  if (isCritical) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase font-bold border rounded text-[#9A4D48] bg-[#F9F2F1] border-[#D9BEBC] dark:bg-[#2B1D1C] dark:text-[#C77873] dark:border-[#523331] ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#9A4D48]" />
        {customLabel || status}
      </span>
    );
  }

  if (isOffline) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase text-[#5F6268] bg-[#EFECE4] border border-[#E5E1D8] rounded dark:bg-[#25282D] dark:text-[#8B8D91] dark:border-[#3D4045] ${sizeClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#8B8D91]" />
        {customLabel || "OFFLINE"}
      </span>
    );
  }

  // Default normal status
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase text-[#17191C] bg-[#FBFAF6] border border-[#E5E1D8] rounded dark:bg-[#25282D] dark:text-[#F7F5EE] dark:border-[#3D4045] ${sizeClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#8B8D91]" />
      {customLabel || status}
    </span>
  );
}

