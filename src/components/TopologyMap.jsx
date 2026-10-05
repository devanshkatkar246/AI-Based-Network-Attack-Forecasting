"use client";

import React, { useState, useMemo } from "react";
import { Server, Shield, Database, Radio, Globe, Activity, RefreshCw, Info, Target, AlertTriangle } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function TopologyMap({ topology, onSelectHost }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const nodeIconMap = {
    gateway: Globe,
    dc: Shield,
    host: Server,
    server: Server,
    db: Database,
    external: Radio
  };

  // Helper to flexibly match node by id, ip, or label
  const findNode = (rawId) => {
    if (!rawId || !topology?.nodes) return null;
    const targetStr = rawId.toString().trim();
    const cleanIp = targetStr.replace(/^node-/, "").replace(/_/g, ".");
    return topology.nodes.find((n) => {
      if (!n) return false;
      if (n.id === targetStr || n.ip === targetStr || n.label === targetStr) return true;
      if (n.ip === cleanIp) return true;
      if (n.id && n.id.replace(/^node-/, "").replace(/_/g, ".") === cleanIp) return true;
      return false;
    });
  };

  // Deterministic DAG / Hierarchical Layout Engine
  const canvasWidth = 960;
  const canvasHeight = 480;

  const positionedNodes = useMemo(() => {
    if (!topology || !topology.nodes || !Array.isArray(topology.nodes) || topology.nodes.length === 0) {
      return [];
    }

    // 1. Group nodes into functional network tiers
    const tiers = {
      0: [], // Ingress / Gateway / Perimeter
      1: [], // Workstations / Internal Monitored Hosts
      2: [], // Internal Servers / DC / Targets
      3: []  // Egress / External Targets
    };

    topology.nodes.forEach((node) => {
      const type = (node.type || "host").toLowerCase();
      const status = (node.status || "clean").toLowerCase();

      if (type === "gateway" || type === "router") {
        tiers[0].push(node);
      } else if (status === "compromised" || type === "host" || type === "workstation") {
        tiers[1].push(node);
      } else if (status.includes("target") || type === "dc" || type === "server" || type === "db") {
        tiers[2].push(node);
      } else {
        tiers[3].push(node);
      }
    });

    // Fallback if a tier is empty: balance nodes across tiers
    const tierKeys = [0, 1, 2, 3];
    const xPositions = [120, 350, 600, 830];

    const result = [];
    tierKeys.forEach((tIdx) => {
      const nodeList = tiers[tIdx];
      const count = nodeList.length;
      if (count === 0) return;

      const x = xPositions[tIdx];
      const startY = 80;
      const availableHeight = canvasHeight - 140;
      const stepY = count > 1 ? availableHeight / (count - 1) : 0;

      nodeList.forEach((node, nIdx) => {
        const y = count === 1 ? canvasHeight / 2 : startY + nIdx * stepY;
        result.push({
          ...node,
          x,
          y,
          tier: tIdx
        });
      });
    });

    return result;
  }, [topology?.nodes]);

  const positionedNodeMap = useMemo(() => {
    const map = new Map();
    positionedNodes.forEach((n) => {
      map.set(n.id, n);
      if (n.ip) map.set(n.ip, n);
      if (n.label) map.set(n.label, n);
    });
    return map;
  }, [positionedNodes]);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return positionedNodes[0];
    return positionedNodes.find((n) => n.id === selectedNodeId) || positionedNodes[0];
  }, [selectedNodeId, positionedNodes]);

  const handleNodeClick = (node) => {
    setSelectedNodeId(node.id);
    if (onSelectHost) {
      onSelectHost(node);
    }
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setSelectedNodeId(null);
  };

  if (!topology || !topology.nodes || topology.nodes.length === 0) {
    return (
      <div className="w-full bg-[#151B23] border border-[#27303A] rounded-xl p-6 text-center text-xs text-[#9AA6B2]">
        No topology network data available for the active scenario.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#151B23] border border-[#27303A] rounded-xl p-5 shadow-card select-none flex flex-col justify-between" style={{ minHeight: "560px" }}>
      {/* 1. Header Bar & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3.5 border-b border-[#27303A] mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
              ATTACK MOVEMENT TOPOLOGY
            </h2>
            <StatusBadge status="NETWORK TOPOLOGY" size="sm" customLabel="NETWORK PATH" />
          </div>
          <p className="text-[11px] text-[#9BA4B0] mt-0.5">
            Physical Hosts & Communication Edges • Observed, Current, & Forecast Vectors
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono flex-wrap bg-[#0D1015] px-3 py-1.5 rounded-md border border-[#2A323C]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF5350]" />
            <span className="text-[#EF5350] font-bold">COMPROMISED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6F8FBE]" />
            <span className="text-[#6F8FBE] font-bold">TARGETED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#718CB8] bg-transparent" />
            <span className="text-[#718CB8]">FORECAST PATH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
            <span className="text-[#4CAF50]">CLEAN ASSET</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Canvas Bar */}
      <div className="flex items-center justify-between bg-[#0D1015] border border-[#2A323C] rounded-lg px-4 py-2 mb-3 text-xs">
        <div className="flex items-center gap-2 text-[#9BA4B0]">
          <Activity className="w-3.5 h-3.5 text-[#6F8FBE]" />
          <span>
            MONITORED HOSTS: <strong className="text-[#E7EAF0]">{topology.nodes.length}</strong>
          </span>
          <span className="text-[#2A323C]">|</span>
          <span>
            COMMUNICATION EDGES: <strong className="text-[#E7EAF0]">{topology.edges?.length || 0}</strong>
          </span>
        </div>

        <button
          onClick={handleResetView}
          className="px-2.5 py-1 rounded bg-[#191F27] hover:bg-[#2A323C] text-[#9BA4B0] hover:text-[#E7EAF0] text-[11px] transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>FIT VIEW</span>
        </button>
      </div>

      {/* 3. Full-Width Interactive SVG Network Canvas */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#0D1015] border border-[#2A323C] p-2">
        {(!topology.edges || topology.edges.length === 0) && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-[#191F27] border border-[#2A323C] rounded text-[11px] text-[#9BA4B0]">
            No communication edges observed in the current analysis window.
          </div>
        )}

        <svg
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="w-full h-auto min-h-[420px] max-h-[520px] transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            <marker id="topo-arrow-observed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6F7885" />
            </marker>
            <marker id="topo-arrow-current" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6F8FBE" />
            </marker>
            <marker id="topo-arrow-forecast" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#718CB8" />
            </marker>
            <marker id="topo-arrow-actual" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4CAF50" />
            </marker>
            <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Network Subnet Zone Guides */}
          <g opacity="0.4">
            <rect x="30" y="20" width="180" height={canvasHeight - 40} rx="8" fill="#151A21" stroke="#2A323C" strokeDasharray="3,3" />
            <text x="40" y="38" fill="#9BA4B0" fontSize="9" fontWeight="bold" fontFamily="monospace">PERIMETER / GATEWAY</text>

            <rect x="240" y="20" width="220" height={canvasHeight - 40} rx="8" fill="#151A21" stroke="#2A323C" strokeDasharray="3,3" />
            <text x="250" y="38" fill="#9BA4B0" fontSize="9" fontWeight="bold" fontFamily="monospace">INTERNAL WORKSTATIONS</text>

            <rect x="490" y="20" width="220" height={canvasHeight - 40} rx="8" fill="#151A21" stroke="#2A323C" strokeDasharray="3,3" />
            <text x="500" y="38" fill="#9BA4B0" fontSize="9" fontWeight="bold" fontFamily="monospace">PRODUCTION SERVERS & DC</text>

            <rect x="730" y="20" width="200" height={canvasHeight - 40} rx="8" fill="#151A21" stroke="#2A323C" strokeDasharray="3,3" />
            <text x="740" y="38" fill="#9BA4B0" fontSize="9" fontWeight="bold" fontFamily="monospace">PROJECTED TARGET / EGRESS</text>
          </g>

          {/* SVG Communication Edges (Cubic Bezier Curves) */}
          {topology.edges && topology.edges.map((edge, idx) => {
            const sNode = positionedNodeMap.get(edge.source) || findNode(edge.source);
            const tNode = positionedNodeMap.get(edge.target) || findNode(edge.target);
            if (!sNode || !tNode) return null;

            const isForecast = edge.status === "FORECAST" || edge.type === "forecast";
            const isActual = edge.status === "ACTUAL";
            const isCurrent = edge.status === "CURRENT" || edge.type === "suspicious";

            let strokeColor = "#6F7885";
            let strokeDash = "none";
            let strokeWidth = 2;
            let marker = "url(#topo-arrow-observed)";

            if (isActual) {
              strokeColor = "#4CAF50";
              marker = "url(#topo-arrow-actual)";
              strokeWidth = 2.5;
            } else if (isForecast) {
              strokeColor = "#718CB8";
              strokeDash = "6,4";
              marker = "url(#topo-arrow-forecast)";
              strokeWidth = 2;
            } else if (isCurrent) {
              strokeColor = "#6F8FBE";
              marker = "url(#topo-arrow-current)";
              strokeWidth = 2.5;
            }

            const dx = tNode.x - sNode.x;
            const controlX1 = sNode.x + dx * 0.5;
            const controlY1 = sNode.y;
            const controlX2 = sNode.x + dx * 0.5;
            const controlY2 = tNode.y;

            const pathData = `M ${sNode.x + 85} ${sNode.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${tNode.x - 85} ${tNode.y}`;

            return (
              <g key={`topo-edge-${idx}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  markerEnd={marker}
                  opacity="0.85"
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Node SVG Cards */}
          {positionedNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const nodeWidth = 180;
            const nodeHeight = 74;
            const nodeX = node.x - nodeWidth / 2;
            const nodeY = node.y - nodeHeight / 2;

            const type = (node.type || "host").toLowerCase();
            const status = (node.status || "clean").toLowerCase();

            let bgColor = "#151A21";
            let borderColor = "#2A323C";
            let textColor = "#E7EAF0";
            let badgeBg = "#191F27";
            let badgeText = "#9BA4B0";
            let strokeDash = "none";
            let isGlowing = false;

            if (status === "compromised") {
              bgColor = "#231818";
              borderColor = "#EF5350";
              textColor = "#EF5350";
              badgeBg = "#2E1B1B";
              badgeText = "#EF5350";
              isGlowing = true;
            } else if (status.includes("target") || status === "targeted" || status === "forecasted-target") {
              bgColor = "#151D2A";
              borderColor = "#6F8FBE";
              textColor = "#6F8FBE";
              badgeBg = "#1D283A";
              badgeText = "#6F8FBE";
              if (status.includes("forecast")) strokeDash = "5,4";
              isGlowing = true;
            } else if (type === "external") {
              bgColor = "#251818";
              borderColor = "#A85D59";
              textColor = "#A85D59";
              badgeBg = "#2D1B1B";
              badgeText = "#A85D59";
            }

            return (
              <g
                key={node.id}
                transform={`translate(${nodeX}, ${nodeY})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
                filter={isGlowing || isSelected ? "url(#nodeGlow)" : undefined}
              >
                {/* Outer Rect Border */}
                <rect
                  x="0"
                  y="0"
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="8"
                  fill={bgColor}
                  stroke={isSelected ? "#E7EAF0" : borderColor}
                  strokeWidth={isSelected || isGlowing ? 2 : 1.5}
                  strokeDasharray={strokeDash}
                  className="transition-all duration-200 group-hover:stroke-[#6F8FBE]"
                />

                {/* Host Label Header */}
                <text x="12" y="20" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {node.label || node.id}
                </text>

                {/* IP Address */}
                <text x="12" y="36" fill="#6F8FBE" fontSize="9.5" fontFamily="monospace">
                  {node.ip || "10.0.0.1"}
                </text>

                {/* Node Status Badge */}
                <rect x="10" y="45" width={nodeWidth - 20} height="18" rx="4" fill={badgeBg} />
                <text x="16" y="57" fill={badgeText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                  {status.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 4. Selected Host Detail Panel */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-[#0D1015] border border-[#2A323C] rounded-lg text-xs font-mono text-[#E7EAF0] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#E7EAF0]">{selectedNode.label}</span>
              <span className="text-[#6F8FBE] font-bold">({selectedNode.ip})</span>
              <StatusBadge status={selectedNode.status?.toUpperCase() || "CLEAN"} size="sm" />
            </div>
            <div className="text-[11px] text-[#9BA4B0] mt-1 flex items-center gap-3">
              <span>Zone: <strong className="text-[#E7EAF0]">{selectedNode.zone || "INTERNAL"}</strong></span>
              <span>Active Connections: <strong className="text-[#E7EAF0]">{selectedNode.connections || 12}</strong></span>
              <span>New Flow Edges: <strong className="text-[#6F8FBE]">{selectedNode.newEdges || 2}</strong></span>
            </div>
          </div>

          <button
            onClick={() => handleNodeClick(selectedNode)}
            className="px-3.5 py-2 rounded bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] font-bold text-xs transition-colors shrink-0"
          >
            SIMULATE INTERVENTION
          </button>
        </div>
      )}
    </div>
  );
}
