"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Upload, Layers, ShieldCheck, Activity, Terminal } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-[#0D1015] text-[#E7EAF0] font-sans antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader title="HOME" activeScenarioName={null} activeScenarioId={null} />

        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto flex flex-col justify-center space-y-12">
          {/* Main Hero Header */}
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#2A323C] bg-[#151A21] text-xs font-mono text-[#6F8FBE]">
              <Terminal className="w-3.5 h-3.5" />
              <span>SIH 26153 · AI-BASED NETWORK ATTACK FORECASTING</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-[#E7EAF0]">
                Forecast where a network attack is heading.
              </h1>
              <p className="text-base font-sans text-[#9BA4B0] leading-relaxed">
                Transform raw network traffic into temporal network states S_t, future attack trajectories, and calibrated early warning lead times.
              </p>
            </div>

            {/* Primary & Secondary CTA Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4 font-mono text-xs">
              <Link
                href="/scenarios"
                className="px-5 py-3 rounded bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] font-bold transition-colors flex items-center gap-2"
              >
                <span>OPEN SCENARIO LIBRARY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/scenarios?upload=true"
                className="px-5 py-3 rounded bg-[#151A21] hover:bg-[#191F27] border border-[#2A323C] text-[#E7EAF0] font-semibold transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-[#9BA4B0]" />
                <span>UPLOAD NETWORK DATA (CSV)</span>
              </Link>
            </div>
          </div>

          {/* Operational Pillars Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#2A323C]">
            <div className="bg-[#151A21] border border-[#2A323C] rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#6F8FBE]">
                <span>01 · TEMPORAL RECOVERY</span>
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-mono font-semibold text-[#E7EAF0]">Temporal Network States S_t</h3>
              <p className="text-xs text-[#9BA4B0] leading-relaxed">
                Groups flow telemetry into 10-second temporal windows, extracting traffic volume, diversity, and topology changes.
              </p>
            </div>

            <div className="bg-[#151A21] border border-[#2A323C] rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#6F8FBE]">
                <span>02 · TRAJECTORY ROLLOUT</span>
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-mono font-semibold text-[#E7EAF0]">Temporal World Model</h3>
              <p className="text-xs text-[#9BA4B0] leading-relaxed">
                Learns latent state transitions z_t → z_t+K to roll forward predicted attack paths and target hosts.
              </p>
            </div>

            <div className="bg-[#151A21] border border-[#2A323C] rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#6F8FBE]">
                <span>03 · INTERVENTION</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-mono font-semibold text-[#E7EAF0]">Counterfactual What-If</h3>
              <p className="text-xs text-[#9BA4B0] leading-relaxed">
                Simulates host isolation and credential revocation to compare baseline vs intervention trajectory divergence.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
