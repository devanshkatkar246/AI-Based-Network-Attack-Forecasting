import React from "react";
import { FileCode2, ShieldAlert, Cpu, Terminal } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function EvidenceCard({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="bg-surface border border-slate-200 rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wider font-mono">
              EVIDENCE & ATT&CK INTERPRETATION
            </h3>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            {evidence.length} Telemetry Signals
          </span>
        </div>

        {/* Signals List */}
        <div className="space-y-2.5">
          {evidence.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg hover:border-slate-300 transition-colors flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {item.mitreId}
                  </span>
                  <span className="text-slate-500 font-semibold">{item.type}</span>
                </div>
                <span className="text-slate-400">{item.time}</span>
              </div>

              <div className="text-xs text-navy-800 font-medium">
                {item.indicator}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200/50">
                <span>Source: {item.source}</span>
                <span className={item.severity === "CRITICAL" ? "text-critical font-bold" : "text-warning font-semibold"}>
                  {item.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Mapped to MITRE ATT&CK Enterprise Matrix</span>
        <span className="text-accent font-semibold">Deterministic Signals</span>
      </div>
    </div>
  );
}
