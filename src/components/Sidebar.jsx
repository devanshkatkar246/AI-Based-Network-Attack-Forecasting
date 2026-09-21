"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Radar, 
  Layers, 
  Network, 
  TrendingUp, 
  GitFork, 
  FileText,
  Shield
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const NAV_ITEMS = [
  { href: "/", label: "Command Center", icon: Radar },
  { href: "/scenarios", label: "Scenarios", icon: Layers },
  { href: "/network", label: "Network State", icon: Network },
  { href: "/forecast", label: "Forecast", icon: TrendingUp },
  { href: "/what-if", label: "What-If", icon: GitFork },
  { href: "/reports", label: "Threat Report", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface border-r border-slate-200 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-navy-800 text-white flex items-center justify-center shadow-subtle">
          <Shield className="w-5 h-5 text-accent border-accent-border" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            TEMPORAL
          </div>
          <div className="text-sm font-bold tracking-tight text-navy-800 leading-tight">
            WORLD MODEL
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
          Intelligence Console
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? "bg-slate-100 text-navy-800 font-semibold border-l-2 border-accent shadow-subtle"
                  : "text-slate-600 hover:text-navy-800 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Telemetry Status */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Engine Status</span>
          <StatusBadge status="OFFLINE" size="sm" />
        </div>
        <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>SIH-2026 #26153</span>
          <span>v0.9.4-MVP</span>
        </div>
      </div>
    </aside>
  );
}
