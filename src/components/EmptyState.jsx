import React from "react";
import { Cpu, Terminal, Shield } from "lucide-react";

export default function EmptyState({ 
  title = "MODULE INTEGRATION READY", 
  description = "Engine interface initialized. Live telemetry feed standing by.",
  icon: Icon = Cpu
}) {
  return (
    <div className="bg-surface border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center shadow-card max-w-2xl mx-auto my-8">
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-600" />
      </div>

      <div className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
        TEMPORAL WORLD MODEL PLATFORM
      </div>

      <h2 className="text-base font-bold text-navy-800 tracking-tight mb-2">
        {title}
      </h2>

      <p className="text-xs text-slate-500 max-w-md font-sans mb-6">
        {description}
      </p>

      <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Interface Schema Ready
        </span>
        <span>•</span>
        <span>SIH 2026 #26153</span>
        <span>•</span>
        <span>Deterministic Mock Engine</span>
      </div>
    </div>
  );
}
