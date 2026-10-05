"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import TopologyMap from "@/components/TopologyMap";
import {
  Network,
  Server,
  Shield,
  Database,
  Radio,
  Globe,
  ArrowRight,
  Clock,
  Activity,
  Zap,
  Layers
} from "lucide-react";

function NetworkStateContent({ activeScenario }) {
  const scenario = activeScenario;
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState(
    scenario?.topology?.nodes?.find((n) => n.status === "forecasted-target") || scenario?.topology?.nodes?.[0]
  );

  return (
    <div className="space-y-6 select-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#27303A] gap-2">
        <div>
          <h1 className="text-xs font-bold text-[#E8EDF3] uppercase tracking-wider font-mono">
            NETWORK STATE
          </h1>
          <p className="text-xs text-[#9AA6B2] mt-0.5">
            Current communication structure • Context: <span className="font-bold text-[#E8EDF3] font-mono">{scenario.id}</span>
          </p>
        </div>
        <StatusBadge status={scenario.telemetry?.networkState || "MONITORED"} size="sm" />
      </div>

      {/* 2. Visual Telemetry Pipeline Explanation */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card">
        <div className="text-[10px] uppercase font-bold text-[#6F95D6] mb-3 font-mono">
          STATE TRANSFORMATION PIPELINE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#11161D] border border-[#27303A] rounded-lg space-y-1">
            <div className="text-[10px] text-[#9AA6B2] font-bold uppercase font-mono">01 TELEMETRY INPUT</div>
            <div className="font-bold text-[#E8EDF3]">Network Telemetry</div>
            <div className="text-xs text-[#9AA6B2]">Flow records, packet counts, protocol events</div>
          </div>
          <div className="p-3.5 bg-[#11161D] border border-[#27303A] rounded-lg space-y-1">
            <div className="text-[10px] text-[#6F95D6] font-bold uppercase font-mono">02 AGGREGATION</div>
            <div className="font-bold text-[#6F95D6]">Temporal Window</div>
            <div className="text-xs text-[#9AA6B2]">10s sliding window feature aggregation</div>
          </div>
          <div className="p-3.5 bg-[#19202A] border border-[#6F95D6]/40 rounded-lg space-y-1">
            <div className="text-[10px] text-[#6F95D6] font-bold uppercase font-mono">03 SYSTEM STATE</div>
            <div className="font-bold text-[#6F95D6]">Network State (S_t)</div>
            <div className="text-xs text-[#9AA6B2]">Communication graph & node features</div>
          </div>
        </div>
      </div>

      {/* 3. Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#151B23] border border-[#27303A] rounded-lg px-4 py-3 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-lg font-bold text-[#E8EDF3] leading-tight font-mono">
              {scenario.telemetry?.activeHosts ?? "—"}
            </div>
            <div className="text-[11px] text-[#9AA6B2] uppercase tracking-wide font-medium">
              Active Hosts
            </div>
          </div>
        </div>

        <div className="bg-[#151B23] border border-[#27303A] rounded-lg px-4 py-3 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-lg font-bold text-[#E8EDF3] leading-tight font-mono">
              {scenario.telemetry?.activeFlows ?? "—"}
            </div>
            <div className="text-[11px] text-[#9AA6B2] uppercase tracking-wide font-medium">
              Active Flows
            </div>
          </div>
        </div>

        <div className="bg-[#151B23] border border-[#27303A] rounded-lg px-4 py-3 flex items-center justify-between shadow-subtle">
          <div>
            <div className="text-lg font-bold text-[#6F95D6] leading-tight font-mono">
              {scenario.telemetry?.newEdges ?? "—"}
            </div>
            <div className="text-[11px] text-[#9AA6B2] uppercase tracking-wide font-medium">
              New Edges
            </div>
          </div>
        </div>

        <div className="bg-[#151B23] border border-[#27303A] rounded-lg px-4 py-3 flex items-center justify-between shadow-subtle">
          <div>
            <div className="mt-0.5">
              <StatusBadge status={scenario.telemetry?.networkState || "MONITORED"} size="sm" />
            </div>
            <div className="text-[11px] text-[#9AA6B2] uppercase tracking-wide font-medium mt-1">
              State Level
            </div>
          </div>
        </div>
      </div>

      {/* 4. Hero Topology Map Component (Full Width) */}
      <TopologyMap topology={scenario.topology} onSelectHost={setSelectedNode} />

      {/* 5. Network Timeline */}
      <div className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#27303A] text-xs font-bold text-[#E8EDF3] uppercase font-mono">
          <Clock className="w-4 h-4 text-[#6F95D6]" />
          <span>NETWORK COMMUNICATION TIMELINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {(scenario.networkTimeline || [
            { time: "T-90s", label: "Initial SMB Service Scan across Subnet" },
            { time: "T-60s", label: "LDAP Domain Admin Enumeration" },
            { time: "NOW", label: "Privilege Access & Host 10.0.2.45 Isolation Window" }
          ]).map((item, idx) => (
            <div key={idx} className="p-3.5 bg-[#11161D] border border-[#27303A] rounded-lg flex items-center gap-3">
              <span className="font-bold text-[#6F95D6] text-xs font-mono flex-shrink-0">{item.time}:</span>
              <span className="text-[#E8EDF3] text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NetworkPage() {
  return (
    <AppShell title="NETWORK STATE & TOPOLOGY">
      {({ activeScenario, activeScenarioId }) => {
        if (!activeScenarioId) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center select-none">
              <EmptyState
                title="NO SCENARIO LOADED"
                message="Select or upload a network attack scenario to view network communication states and dynamic topology."
              />
              <Link
                href="/scenarios"
                className="px-5 py-2.5 rounded-lg bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14] font-mono text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>OPEN SCENARIO LIBRARY</span>
              </Link>
            </div>
          );
        }
        return <NetworkStateContent activeScenario={activeScenario} />;
      }}
    </AppShell>
  );
}
