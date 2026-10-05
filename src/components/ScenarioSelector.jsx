"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Layers } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { fetchScenarios } from "@/lib/api";

export default function ScenarioSelector({ activeScenarioId, onSelectScenario, scenariosList: passedList }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scenarios, setScenarios] = useState(passedList || []);

  useEffect(() => {
    if (passedList && passedList.length > 0) {
      setScenarios(passedList);
    } else {
      fetchScenarios().then((list) => {
        if (list && list.length > 0) {
          setScenarios(list);
        }
      });
    }
  }, [passedList]);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0] || { id: activeScenarioId || "enterprise-lateral-movement-01", name: "Enterprise Lateral Movement" };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-[#151A21] border border-[#2A323D] rounded-md shadow-subtle hover:border-[#35404D] hover:bg-[#191F27] transition-all text-xs font-mono font-medium text-[#E7EBF0]"
      >
        <Layers className="w-3.5 h-3.5 text-[#7898C7]" />
        <span className="font-mono text-[#737D89] text-[11px]">Scenario:</span>
        <span className="font-semibold text-[#E7EBF0] max-w-[140px] truncate">{activeScenario.name || activeScenario.id}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#737D89] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-[#151A21] border border-[#2A323D] rounded-lg shadow-cardHover z-50 overflow-hidden divide-y divide-[#2A323D]">
            <div className="p-2.5 bg-[#10141A] text-[10px] font-mono font-semibold text-[#737D89] uppercase tracking-wider flex items-center justify-between">
              <span>Select Attack Scenario</span>
              <span className="text-[#7898C7]">{scenarios.length} Available</span>
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {scenarios.map((scen) => {
                const isSelected = scen.id === activeScenarioId;
                return (
                  <button
                    key={scen.id}
                    onClick={() => {
                      if (onSelectScenario) onSelectScenario(scen.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 hover:bg-[#191F27] transition-colors flex flex-col gap-1.5 ${
                      isSelected ? "bg-[#1D232C] border-l-2 border-[#7898C7]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#E7EBF0] truncate">{scen.name || scen.id}</span>
                      <StatusBadge status={scen.status === "available" || scen.status === "ready" ? "ACTIVE" : "STANDBY"} size="sm" />
                    </div>
                    <div className="text-xs text-[#A7B0BC] line-clamp-1">{scen.description || scen.source_dataset}</div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#737D89]">
                      <span>Category: {scen.category || "ANALYSIS"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

