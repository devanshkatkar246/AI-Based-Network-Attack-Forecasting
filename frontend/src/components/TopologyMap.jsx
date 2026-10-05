"use client";

import React, { useState, useMemo } from "react";
import { Server, Shield, Database, Radio, Globe, Activity, RefreshCw, Target, AlertTriangle } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function TopologyMap({ topology, onSelectHost }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const rawEdges = topology?.edges || [];
  const attackVectors = topology?.attackMovementEdges || [];

  // Helper to flexibly match node by id, ip, or label
  const findNode = (rawId, nodesList = []) => {
    if (!rawId || !nodesList) return null;
    const targetStr = rawId.toString().trim();
    const cleanIp = targetStr.replace(/^node-/, "").replace(/_/g, ".");
    return nodesList.find((n) => {
      if (!n) return false;
      if (n.id === targetStr || n.ip === targetStr || n.label === targetStr) return true;
      if (n.ip === cleanIp) return true;
      if (n.id && n.id.replace(/^node-/, "").replace(/_/g, ".") === cleanIp) return true;
      return false;
    });
  };

  // Canvas Dimensions
  const canvasWidth = 960;
  const canvasHeight = 440;

  const positionedNodes = useMemo(() => {
    if (!topology || !topology.nodes || !Array.isArray(topology.nodes) || topology.nodes.length === 0) {
      return [];
    }

    const nodes = topology.nodes;
    const totalCount = nodes.length;

    // Optimal layout for 2 to 3 nodes (Source -> Target horizontal flow)
    if (totalCount <= 3) {
      const stepX = (canvasWidth - 360) / Math.max(1, totalCount - 1);
      return nodes.map((node, idx) => {
        const x = totalCount === 1 ? canvasWidth / 2 : 180 + idx * stepX;
        const y = canvasHeight / 2;
        return {
          ...node,
          x,
          y,
          tier: idx
        };
      });
    }

    // Tiered DAG layout for 4+ nodes
    const tiers = {
      0: [], // Ingress / Perimeter
      1: [], // Workstations / Compromised Source
      2: [], // Internal Servers / DC / Targets
      3: []  // Egress / External
    };

    nodes.forEach((node) => {
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

    const tierKeys = [0, 1, 2, 3];
    const xPositions = [140, 370, 610, 830];

    const result = [];
    tierKeys.forEach((tIdx) => {
      const nodeList = tiers[tIdx];
      const count = nodeList.length;
      if (count === 0) return;

      const x = xPositions[tIdx];
      const startY = 90;
      const availableHeight = canvasHeight - 160;
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

  const hasEdges = rawEdges.length > 0 || attackVectors.length > 0;

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
          <p className="text-[11px] text-[#9AA6B2] mt-0.5">
            Physical Hosts & Directional Movement • Observed, Current, & Forecast Attack Vectors
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
            <span className="text-[#6F8FBE] font-bold">CURRENT TARGET</span>
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

      {/* 2. Honest Telemetry Counters Bar */}
      <div className="flex items-center justify-between bg-[#0D1015] border border-[#2A323C] rounded-lg px-4 py-2 mb-3 text-xs">
        <div className="flex items-center gap-3 text-[#9AA6B2] flex-wrap font-mono">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#6F8FBE]" />
            <span>MONITORED HOSTS: <strong className="text-[#E7EAF0]">{topology.nodes.length}</strong></span>
          </div>
          <span className="text-[#2A323C]">|</span>
          <div>
            <span>COMMUNICATION EDGES: <strong className="text-[#E7EAF0]">{rawEdges.length}</strong></span>
          </div>
          <span className="text-[#2A323C]">|</span>
          <div>
            <span>ATTACK MOVEMENT VECTORS: <strong className="text-[#6F8FBE]">{attackVectors.length}</strong></span>
          </div>
        </div>

        <button
          onClick={handleResetView}
          className="px-2.5 py-1 rounded bg-[#191F27] hover:bg-[#2A323C] text-[#9AA6B2] hover:text-[#E7EAF0] text-[11px] transition-colors flex items-center gap-1 font-mono"
        >
          <RefreshCw className="w-3 h-3" />
          <span>FIT VIEW</span>
        </button>
      </div>

      {/* 3. Interactive SVG Canvas */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#0D1015] border border-[#2A323C] p-2">
        {!hasEdges && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-[#191F27] border border-[#2A323C] rounded text-[11px] text-[#9AA6B2] font-mono">
            No communication edges or attack vectors observed in the current window.
          </div>
        )}

        <svg
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="w-full h-auto min-h-[380px] max-h-[460px] transition-transform duration-200"
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

          {/* Subnet Zone Guides */}
          <g opacity="0.35">
            <rect x="30" y="20" width="200" height={canvasHeight - 40} rx="8" fill="#151A21" stroke="#2A323C" strokeDasharray="3,3" />
            <text x="40" y="38" fill="#9BA4B0" fontSize="9" fontWeight="bold" fontFamily="monospace">SOURCE / COMPROMISED</text>

            <rect x="260" y="20" width="410" height={canvasHeight - 40} rx="8" fill="#151A21" stroke="#2A323C" strokeDasharray="3,3" />
            <text x="270" y="38" fill="#9BA4B0" fontSize="9" fontWeight="bold" fontFamily="monospace">INTERNAL LATERAL SUBNET</text>

            <rect x="700" y="20" width="230" height={canvasHeight - 40} rx="8" fill="#151A21" stroke="#2A323C" strokeDasharray="3,3" />
            <text x="710" y="38" fill="#9BA4B0" fontSize="9" fontWeight="bold" fontFamily="monospace">PROJECTED TARGET / EGRESS</text>
          </g>

          {/* Raw Observed Flow Communication Edges */}
          {rawEdges.map((edge, idx) => {
            const sNode = positionedNodeMap.get(edge.source) || findNode(edge.source, positionedNodes);
            const tNode = positionedNodeMap.get(edge.target) || findNode(edge.target, positionedNodes);
            if (!sNode || !tNode) return null;

            const dx = tNode.x - sNode.x;
            const controlX = sNode.x + dx * 0.5;
            const pathData = `M ${sNode.x + 85} ${sNode.y} C ${controlX} ${sNode.y - 30}, ${controlX} ${tNode.y - 30}, ${tNode.x - 85} ${tNode.y}`;

            return (
              <g key={`raw-edge-${idx}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke="#6F7885"
                  strokeWidth={1.5}
                  strokeDasharray="none"
                  markerEnd="url(#topo-arrow-observed)"
                  opacity="0.6"
                />
              </g>
            );
          })}

          {/* Attack Movement Vectors (Observed, Current, Forecast Directional Edges) */}
          {attackVectors.map((vec, idx) => {
            const sNode = positionedNodeMap.get(vec.source) || findNode(vec.source, positionedNodes);
            const tNode = positionedNodeMap.get(vec.target) || findNode(vec.target, positionedNodes);
            if (!sNode || !tNode) return null;

            const isForecast = vec.status === "FORECAST";
            const isActual = vec.status === "ACTUAL";
            const isCurrent = vec.status === "CURRENT";

            let strokeColor = "#6F7885";
            let strokeDash = "none";
            let strokeWidth = 2.5;
            let marker = "url(#topo-arrow-observed)";

            if (isActual) {
              strokeColor = "#4CAF50";
              marker = "url(#topo-arrow-actual)";
              strokeWidth = 3;
            } else if (isForecast) {
              strokeColor = "#718CB8";
              strokeDash = "6,4";
              marker = "url(#topo-arrow-forecast)";
              strokeWidth = 2.5;
            } else if (isCurrent) {
              strokeColor = "#6F8FBE";
              marker = "url(#topo-arrow-current)";
              strokeWidth = 3;
            }

            const dx = tNode.x - sNode.x;
            const controlX = sNode.x + dx * 0.5;
            const pathData = `M ${sNode.x + 90} ${sNode.y} C ${controlX} ${sNode.y}, ${controlX} ${tNode.y}, ${tNode.x - 90} ${tNode.y}`;

            const midX = (sNode.x + tNode.x) / 2;
            const midY = (sNode.y + tNode.y) / 2;

            return (
              <g key={`attack-vec-${idx}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  markerEnd={marker}
                  className="transition-all duration-300"
                />

                {/* Midpoint Vector Label */}
                <g transform={`translate(${midX - 55}, ${midY - 14})`}>
                  <rect
                    x="0"
                    y="0"
                    width="110"
                    height="20"
                    rx="4"
                    fill="#0D1015"
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeDasharray={strokeDash}
                  />
                  <text
                    x="55"
                    y="13"
                    textAnchor="middle"
                    fill={strokeColor}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {isForecast ? `FORECAST (${vec.relativeTime || "+10s"})` : (vec.stage || "ATTACK VECTOR")}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Node SVG Cards */}
          {positionedNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const nodeWidth = 175;
            const nodeHeight = 72;
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
                {/* Outer Rect */}
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

                {/* Host Label */}
                <text x="12" y="20" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {node.label || `Host-${node.ip || node.id}`}
                </text>

                {/* IP Address */}
                <text x="12" y="36" fill="#6F8FBE" fontSize="9.5" fontFamily="monospace">
                  {node.ip || node.id}
                </text>

                {/* Node Status Badge */}
                <rect x="10" y="44" width={nodeWidth - 20} height="18" rx="4" fill={badgeBg} />
                <text x="16" y="56" fill={badgeText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                  {status.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 4. Selected Host Inspection Panel */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-[#0D1015] border border-[#2A323C] rounded-lg text-xs font-mono text-[#E7EAF0] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#E7EAF0]">{selectedNode.label || selectedNode.id}</span>
              <span className="text-[#6F8FBE] font-bold">({selectedNode.ip || selectedNode.id})</span>
              <StatusBadge status={selectedNode.status?.toUpperCase() || "CLEAN"} size="sm" />
            </div>
            <div className="text-[11px] text-[#9BA4B0] mt-1 flex items-center gap-3">
              <span>Zone: <strong className="text-[#E7EAF0]">{selectedNode.zone || "INTERNAL"}</strong></span>
              <span>Monitored Status: <strong className="text-[#6F8FBE]">{selectedNode.status || "Active"}</strong></span>
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
