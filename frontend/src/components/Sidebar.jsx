"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home,
  Layers, 
  Radar, 
  Network, 
  TrendingUp, 
  GitFork, 
  FileText
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const NAV_ITEMS = [
  { href: "/", label: "HOME", icon: Home },
  { href: "/scenarios", label: "SCENARIOS", icon: Layers },
  { href: "/command-center", label: "COMMAND CENTER", icon: Radar },
  { href: "/network", label: "NETWORK STATE", icon: Network },
  { href: "/forecast", label: "FORECAST", icon: TrendingUp },
  { href: "/what-if", label: "WHAT-IF", icon: GitFork },
  { href: "/reports", label: "THREAT REPORT", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#11161D] border-r border-[#27303A] flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header - Typographic Identity (clickable, routes to Home) */}
      <Link
        href="/"
        aria-label="Go to The Forecaster home"
        className="block p-4 border-b border-[#27303A] hover:bg-[#151B23] transition-colors"
      >
        <div className="text-[13px] font-bold tracking-wider text-[#E8EDF3] uppercase">
          THE FORECASTER
        </div>
        <div className="text-[10px] font-mono text-[#6F95D6] tracking-tight leading-tight mt-0.5 font-semibold">
          TEMPORAL NETWORK INTELLIGENCE
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase text-[#6C7987] tracking-widest">
          NAVIGATION
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#19202A] text-[#6F95D6] font-semibold border-l-2 border-[#6F95D6]"
                  : "text-[#9AA6B2] hover:text-[#E8EDF3] hover:bg-[#151B23]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#6F95D6]" : "text-[#6C7987]"}`} />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-3.5 border-t border-[#27303A] font-mono text-[10px] text-[#9AA6B2] flex items-center justify-between">
        <span className="text-[#6C7987]">SIH 26153</span>
        <StatusBadge status="ONLINE" size="sm" />
      </div>
    </aside>
  );
}
