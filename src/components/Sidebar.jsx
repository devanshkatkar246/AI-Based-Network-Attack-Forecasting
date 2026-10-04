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
    <aside className="w-60 bg-[#11151B] border-r border-[#2A323C] flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header - Typographic Identity */}
      <div className="p-4 border-b border-[#2A323C]">
        <div className="text-[12px] font-mono font-bold tracking-widest text-[#E7EAF0] uppercase">
          TECH πRATES
        </div>
        <div className="text-[10px] font-mono text-[#9BA4B0] tracking-tight leading-tight mt-1">
          TEMPORAL NETWORK INTELLIGENCE
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase text-[#6F7885] tracking-widest">
          NAVIGATION
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-mono font-semibold transition-colors ${
                isActive
                  ? "bg-[#1D242D] text-[#6F8FBE] border-l-2 border-[#6F8FBE]"
                  : "text-[#9BA4B0] hover:text-[#E7EAF0] hover:bg-[#191F27]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#6F8FBE]" : "text-[#6F7885]"}`} />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-3.5 border-t border-[#2A323C] font-mono text-[10px] text-[#9BA4B0] flex items-center justify-between">
        <span>SIH 26153</span>
        <StatusBadge status="ONLINE" size="sm" />
      </div>
    </aside>
  );
}
