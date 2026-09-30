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
    <aside className="w-60 bg-surface dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded bg-navy-800 dark:bg-slate-800 text-white flex items-center justify-center border border-transparent dark:border-slate-700">
          <Shield className="w-4 h-4 text-accent" />
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
            TEMPORAL
          </div>
          <div className="text-xs font-bold tracking-tight text-navy-800 dark:text-slate-100 leading-tight">
            WORLD MODEL
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[9px] font-mono font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          Console
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                isActive
                  ? "bg-slate-100 dark:bg-slate-800 text-navy-800 dark:text-slate-100 font-semibold border-l-2 border-accent"
                  : "text-slate-500 dark:text-slate-400 hover:text-navy-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-slate-400 dark:text-slate-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 font-mono text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>SIH 26153 MVP</span>
        <StatusBadge status="OFFLINE" size="sm" />
      </div>
    </aside>
  );
}

