"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Upload, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Radio, 
  TrendingUp, 
  GitFork, 
  Search,
  CheckCircle2,
  FileText
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-[#0B0F14] text-[#E8EDF3] font-sans antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader title="THE FORECASTER" activeScenarioName={null} activeScenarioId={null} />

        <main className="flex-1 p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-16">
          {/* 1. HERO SECTION */}
          <div className="pt-4 pb-8 border-b border-[#27303A]">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#27303A] bg-[#151B23] text-xs font-mono text-[#6F95D6]">
                <span className="w-2 h-2 rounded-full bg-[#6F95D6] animate-pulse" />
                <span>TEMPORAL NETWORK INTELLIGENCE</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#E8EDF3] leading-[1.15]">
                  Forecast where a cyber attack is heading — <span className="text-[#6F95D6]">before it gets there.</span>
                </h1>
                <p className="text-base sm:text-lg text-[#9AA6B2] leading-relaxed max-w-3xl">
                  The Forecaster analyzes temporal network telemetry, models how the network state is evolving, and projects likely future attack trajectories to give defenders actionable warning time.
                </p>
              </div>

              {/* Dominant Primary CTA + Secondary Link */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/scenarios?upload=true"
                  className="px-6 py-3.5 rounded-lg bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14] font-semibold text-sm transition-all shadow-md flex items-center gap-2.5 group"
                >
                  <Upload className="w-4 h-4 text-[#0B0F14]" />
                  <span>UPLOAD NETWORK DATA</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/scenarios"
                  className="px-5 py-3.5 rounded-lg bg-[#151B23] hover:bg-[#19202A] border border-[#27303A] text-[#E8EDF3] font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <span>Explore benchmark scenarios</span>
                  <ArrowRight className="w-4 h-4 text-[#9AA6B2]" />
                </Link>
              </div>

              {/* Built For Trust Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#9AA6B2]">
                <span className="font-semibold text-[#E8EDF3]">Built for:</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#659477]" /> SOC Analysts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#659477]" /> Threat Hunters
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#659477]" /> Cyber Defence Teams
                </span>
              </div>
            </div>
          </div>

          {/* 2. CONCEPTUAL VISUAL TRAJECTORY */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#9AA6B2]">
                HOW THE FORECASTER WORKS · FROM OBSERVED BEHAVIOUR TO FUTURE TRAJECTORY
              </h2>
              <span className="text-[11px] font-mono text-[#6C7987]">Conceptual Overview</span>
            </div>

            <div className="p-6 bg-[#11161D] border border-[#27303A] rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Step 1: Observed */}
                <div className="p-4 bg-[#151B23] border border-[#27303A] rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-[#9AA6B2] uppercase font-bold">01 · PAST</span>
                    <span className="font-mono text-[10px] text-[#9AA6B2] bg-[#1E2632] px-1.5 py-0.5 rounded">T-60s</span>
                  </div>
                  <div className="text-xs font-bold text-[#E8EDF3]">OBSERVED</div>
                  <div className="text-sm font-semibold text-[#E8EDF3]">Reconnaissance</div>
                  <p className="text-xs text-[#9AA6B2] leading-relaxed">
                    Flow telemetry reveals port scanning & SMB endpoint probing across subnet.
                  </p>
                </div>

                {/* Step 2: Current */}
                <div className="p-4 bg-[#151B23] border-2 border-[#6F95D6]/60 rounded-lg space-y-2 relative">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-[#6F95D6] uppercase font-bold">02 · ACTIVE</span>
                    <span className="font-mono text-[10px] font-bold text-[#0B0F14] bg-[#6F95D6] px-1.5 py-0.5 rounded">NOW</span>
                  </div>
                  <div className="text-xs font-bold text-[#6F95D6]">CURRENT STATE</div>
                  <div className="text-sm font-semibold text-[#E8EDF3]">Network Discovery</div>
                  <p className="text-xs text-[#9AA6B2] leading-relaxed">
                    Host 10.0.2.45 establishes new graph edges to Domain Controller.
                  </p>
                </div>

                {/* Step 3: Forecast */}
                <div className="p-4 bg-[#151B23] border border-dashed border-[#6F95D6] rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-[#6F95D6] uppercase font-bold">03 · MODEL ROLLOUT</span>
                    <span className="font-mono text-[10px] text-[#6F95D6] bg-[#1E2632] px-1.5 py-0.5 rounded">+30s</span>
                  </div>
                  <div className="text-xs font-bold text-[#6F95D6]">MODEL FORECAST</div>
                  <div className="text-sm font-semibold text-[#E8EDF3]">Lateral Movement</div>
                  <p className="text-xs text-[#9AA6B2] leading-relaxed">
                    Temporal World Model projects target asset FIN-SRV-01 via RPC credentials.
                  </p>
                </div>

                {/* Step 4: Warning Lead Time */}
                <div className="p-4 bg-[#151B23] border border-[#C59A45]/40 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-[#C59A45] uppercase font-bold">04 · DEFENDER WINDOW</span>
                    <span className="font-mono text-[10px] text-[#C59A45] bg-[#2A2318] px-1.5 py-0.5 rounded">EARLY WARNING</span>
                  </div>
                  <div className="text-xs font-bold text-[#C59A45]">WARNING WINDOW</div>
                  <div className="text-2xl font-bold font-mono text-[#E8EDF3]">+75 sec</div>
                  <p className="text-xs text-[#9AA6B2] leading-relaxed">
                    Calibrated lead time for automated or manual isolation before exfiltration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. WHY IT MATTERS — DETECTION VS ANTICIPATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#27303A]">
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F95D6]">
                THE CORE PARADIGM SHIFT
              </div>
              <h2 className="text-2xl font-bold text-[#E8EDF3] leading-tight">
                Move from reactive detection to proactive attack anticipation.
              </h2>
              <p className="text-sm text-[#9AA6B2] leading-relaxed">
                Traditional security monitoring is heavily focused on identifying what is happening right now after signatures fire.
              </p>
              <p className="text-sm text-[#9AA6B2] leading-relaxed">
                <strong className="text-[#E8EDF3]">The Forecaster</strong> focuses on what the current temporal network state suggests is likely to happen next, giving security teams the critical warning window needed to intervene.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-[#11161D] border border-[#27303A] rounded-xl space-y-3">
                <div className="text-xs font-mono font-bold text-[#9AA6B2] uppercase">
                  TRADITIONAL SIEM / IDS
                </div>
                <div className="text-sm font-semibold text-[#E8EDF3]">
                  Alerts on observed past activity
                </div>
                <p className="text-xs text-[#9AA6B2] leading-relaxed">
                  Defenders respond after compromise steps have already succeeded. Warning lead time is zero.
                </p>
              </div>

              <div className="p-5 bg-[#151B23] border border-[#6F95D6]/50 rounded-xl space-y-3">
                <div className="text-xs font-mono font-bold text-[#6F95D6] uppercase">
                  THE FORECASTER (TEMPORAL WORLD MODEL)
                </div>
                <div className="text-sm font-semibold text-[#E8EDF3]">
                  Forecasts the next probable attack steps
                </div>
                <p className="text-xs text-[#9AA6B2] leading-relaxed">
                  Learns latent network state transitions, predicts target hosts and techniques, and provides calibrated early warning lead times.
                </p>
              </div>
            </div>
          </div>

          {/* 4. OPERATIONAL SYSTEM ARCHITECTURE (HOW IT WORKS) */}
          <div className="space-y-6 pt-4 border-t border-[#27303A]">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F95D6] mb-1">
                SYSTEM ARCHITECTURE
              </div>
              <h2 className="text-xl font-bold text-[#E8EDF3]">
                End-to-end temporal intelligence pipeline
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 bg-[#11161D] border border-[#27303A] rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#6F95D6]">
                  <span>01 · TELEMETRY INGEST</span>
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#E8EDF3]">Temporal State S_t</h3>
                <p className="text-xs text-[#9AA6B2] leading-relaxed">
                  Aggregates network flow records into 10-second temporal windows, extracting volume, node degrees, and dynamic communication topology.
                </p>
              </div>

              <div className="p-5 bg-[#11161D] border border-[#27303A] rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#6F95D6]">
                  <span>02 · TRAJECTORY ROLLOUT</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#E8EDF3]">Temporal World Model</h3>
                <p className="text-xs text-[#9AA6B2] leading-relaxed">
                  Projects multi-horizon future states (z_t → z_t+K), predicting subsequent ATT&CK techniques, destination subnets, and target assets.
                </p>
              </div>

              <div className="p-5 bg-[#11161D] border border-[#27303A] rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#6F95D6]">
                  <span>03 · DECISION SUPPORT</span>
                  <GitFork className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#E8EDF3]">What-If Counterfactuals</h3>
                <p className="text-xs text-[#9AA6B2] leading-relaxed">
                  Evaluates defensive interventions (host isolation, path blocks) to simulate how counterfactual actions alter the projected attack trajectory.
                </p>
              </div>
            </div>
          </div>

          {/* 5. FINAL CALL TO ACTION */}
          <div className="p-8 bg-[#11161D] border border-[#27303A] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-[#E8EDF3]">
                Start with your network flow telemetry
              </h3>
              <p className="text-sm text-[#9AA6B2]">
                Upload a standard flow CSV or select from preloaded benchmark attack scenarios.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/scenarios?upload=true"
                className="px-6 py-3 rounded-lg bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14] font-bold text-xs transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>UPLOAD CSV DATA</span>
              </Link>

              <Link
                href="/scenarios"
                className="px-5 py-3 rounded-lg bg-[#151B23] hover:bg-[#19202A] border border-[#27303A] text-[#E8EDF3] font-semibold text-xs transition-colors"
              >
                VIEW SCENARIOS
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
