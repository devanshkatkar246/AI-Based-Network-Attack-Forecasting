import React from "react";
import { Cpu } from "lucide-react";

export default function EmptyState({ 
  title = "MODULE INTEGRATION READY", 
  description = "Engine interface initialized. Live telemetry feed standing by.",
  icon: Icon = Cpu
}) {
  return (
    <div className="bg-[#151A21] border border-[#2A323D] rounded-xl p-12 text-center flex flex-col items-center justify-center shadow-card max-w-2xl mx-auto my-8">
      <div className="w-12 h-12 rounded-xl bg-[#1D232C] border border-[#2A323D] text-[#7898C7] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#7898C7]" />
      </div>

      <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#737D89] mb-1">
        TEMPORAL WORLD MODEL PLATFORM
      </div>

      <h2 className="text-base font-bold text-[#E7EBF0] tracking-tight mb-2 font-mono">
        {title}
      </h2>

      <p className="text-xs text-[#A7B0BC] max-w-md font-sans mb-6">
        {description}
      </p>

      <div className="flex items-center gap-3 font-mono text-[10px] text-[#A7B0BC] bg-[#10141A] px-4 py-2 rounded-lg border border-[#2A323D]">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Interface Schema Ready
        </span>
        <span>•</span>
        <span>SIH 2026 #26153</span>
        <span>•</span>
        <span>Temporal Engine Active</span>
      </div>
    </div>
  );
}

