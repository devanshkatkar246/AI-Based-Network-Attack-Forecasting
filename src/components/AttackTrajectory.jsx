"use client";

import React, { useState, useMemo } from "react";
import StatusBadge from "./StatusBadge";
import { useReplay, REPLAY_STATES } from "@/context/ReplayContext";
import { formatRelativeTimestamp } from "@/lib/temporalUtils";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  RefreshCw,
  Info,
  X,
  Target,
  Shield,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function AttackTrajectory({ trajectory, forecast, trajectoryGraph }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);

  const {
    currentTickIndex,
    CURRENT_FREEZE_INDEX,
    totalTicks,
    replayState,
    play,
    pause,
    reset,
    stepForward,
    stepBack
  } = useReplay();

  // 1. Build Data-Driven Graph Model (Nodes & Edges) from Scenario Trajectory / Forecast Engine
  const graphModel = useMemo(() => {
    let rawNodes = [];
    let rawEdges = [];

    if (trajectoryGraph && trajectoryGraph.nodes && trajectoryGraph.edges) {
      rawNodes = trajectoryGraph.nodes;
      rawEdges = trajectoryGraph.edges;
    } else if (Array.isArray(trajectory) && trajectory.length > 0) {
      // Build main temporal node sequence
      rawNodes = trajectory.map((item, idx) => {
        const rawTime = item.estimatedTime || item.timestamp;
        const relativeTime = idx === CURRENT_FREEZE_INDEX
          ? "NOW"
          : formatRelativeTimestamp(rawTime, idx, CURRENT_FREEZE_INDEX);

        return {
          id: item.id || `node-${idx}`,
          index: idx,
          timestamp: item.timestamp || rawTime,
          relativeTime: relativeTime,
          behavior: item.stage || item.behavior || "Attack Step",
          rawLabel: item.techniqueName || item.stage || "Activity",
          techniqueId: item.techniqueId || null,
          techniqueName: item.techniqueName || null,
          tactic: item.stage || item.tactic || "Telemetry Step",
          sourceHost: item.sourceHost || null,
          targetHost: item.targetHost || item.target || null,
          details: item.details || "Observed telemetry stream event.",
          confidence: item.confidence ? Math.round(item.confidence * 100) : (idx <= CURRENT_FREEZE_INDEX ? 98 : 78),
          baseStatus: item.status || (idx === CURRENT_FREEZE_INDEX ? "CURRENT" : idx < CURRENT_FREEZE_INDEX ? "OBSERVED" : "FORECAST"),
          isBranch: false,
          branchYOffset: 0
        };
      });

      // Sequential edges
      for (let i = 0; i < rawNodes.length - 1; i++) {
        rawEdges.push({
          id: `edge-${rawNodes[i].id}-${rawNodes[i + 1].id}`,
          source: rawNodes[i].id,
          target: rawNodes[i + 1].id,
          horizon: rawNodes[i + 1].relativeTime,
          probability: rawNodes[i + 1].confidence
        });
      }

      // Add Model Branch Futures if scenario provides alternative forecast paths
      const currentFreezeNode = rawNodes[CURRENT_FREEZE_INDEX] || rawNodes[0];

      if (forecast && forecast.alternativeBranches && forecast.alternativeBranches.length > 0) {
        forecast.alternativeBranches.forEach((branch, bIdx) => {
          const branchId = `branch-node-${bIdx}`;
          const branchOffset = (bIdx % 2 === 0 ? -1 : 1) * (110 * Math.ceil((bIdx + 1) / 2));
          
          rawNodes.push({
            id: branchId,
            index: CURRENT_FREEZE_INDEX + 1,
            timestamp: "Forecast Window",
            relativeTime: branch.horizon || "+30s",
            behavior: branch.tactic || "Alternative Future",
            rawLabel: branch.techniqueName || "Secondary Vector",
            techniqueId: branch.techniqueId || "T1021",
            techniqueName: branch.techniqueName || "Alternative Movement Vector",
            tactic: branch.tactic || "Lateral Movement",
            sourceHost: currentFreezeNode.targetHost || "Pivot Host",
            targetHost: branch.targetHost || "Subnet Asset",
            details: branch.details || "Parallel model forecast trajectory branch.",
            confidence: branch.probability || 34,
            baseStatus: "FORECAST",
            isBranch: true,
            branchYOffset: branchOffset
          });

          rawEdges.push({
            id: `edge-${currentFreezeNode.id}-${branchId}`,
            source: currentFreezeNode.id,
            target: branchId,
            horizon: branch.horizon || "+30s",
            probability: branch.probability || 34
          });
        });
      }
    }

    return { nodes: rawNodes, edges: rawEdges };
  }, [trajectory, forecast, trajectoryGraph, CURRENT_FREEZE_INDEX]);

  // 2. Evaluate Dynamic Epistemic State per node relative to current replay index
  const evaluatedNodes = useMemo(() => {
    return graphModel.nodes.map((node) => {
      const idx = node.index;
      let state = "observed";
      let source = idx <= CURRENT_FREEZE_INDEX ? "telemetry" : "model";

      if (node.isBranch) {
        state = currentTickIndex > CURRENT_FREEZE_INDEX ? "missed" : "forecast";
      } else if (idx < currentTickIndex) {
        if (idx <= CURRENT_FREEZE_INDEX) {
          state = "observed";
        } else {
          // Replay has advanced past freeze index into forecasted future: forecast confirmed by telemetry
          state = "actual";
        }
      } else if (idx === currentTickIndex) {
        state = "current";
      } else {
        // Future relative to current replay position
        state = "forecast";
      }

      return {
        ...node,
        state,
        source
      };
    });
  }, [graphModel.nodes, currentTickIndex, CURRENT_FREEZE_INDEX]);

  // Map of evaluated nodes by ID for fast lookup
  const nodeMap = useMemo(() => {
    const map = new Map();
    evaluatedNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [evaluatedNodes]);

  // 3. Compute Canvas Layout Coordinates (Left-to-Right Temporal Axis)
  const canvasWidth = 1000;
  const canvasHeight = 440;
  const paddingX = 90;
  const centerY = 220;

  // Timeline Ticks List (Distinct relative time steps)
  const timelineSteps = useMemo(() => {
    const mainNodes = evaluatedNodes.filter((n) => !n.isBranch);
    return mainNodes.map((n, i) => ({
      index: i,
      label: n.relativeTime,
      x: paddingX + (i * (canvasWidth - 2 * paddingX)) / Math.max(1, mainNodes.length - 1)
    }));
  }, [evaluatedNodes, paddingX, canvasWidth]);

  // Assign X & Y coordinates to each node
  const positionedNodes = useMemo(() => {
    const mainNodes = evaluatedNodes.filter((n) => !n.isBranch);
    const totalMain = mainNodes.length;

    return evaluatedNodes.map((node) => {
      let x = canvasWidth / 2;
      let y = centerY;

      if (!node.isBranch) {
        const stepIdx = node.index;
        x = paddingX + (stepIdx * (canvasWidth - 2 * paddingX)) / Math.max(1, totalMain - 1);
        y = centerY;
      } else {
        // Branch node positions horizontally after anchor
        const anchorIdx = CURRENT_FREEZE_INDEX;
        x = paddingX + ((anchorIdx + 1) * (canvasWidth - 2 * paddingX)) / Math.max(1, totalMain - 1);
        y = centerY + (node.branchYOffset || -100);
      }

      return {
        ...node,
        x,
        y
      };
    });
  }, [evaluatedNodes, paddingX, canvasWidth, centerY, CURRENT_FREEZE_INDEX]);

  const positionedNodeMap = useMemo(() => {
    const map = new Map();
    positionedNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [positionedNodes]);

  const handleResetView = () => {
    setZoomLevel(1);
    setPanX(0);
  };

  if (!trajectory || trajectory.length === 0) return null;

  const isPlaying = replayState === REPLAY_STATES.PLAYING;

  return (
    <div className="w-full bg-[#151A21] border border-[#2A323C] rounded-xl p-5 shadow-card select-none font-mono flex flex-col justify-between" style={{ minHeight: "560px" }}>
      {/* 1. Header & Epistemic Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3.5 border-b border-[#2A323C] mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#E7EAF0] uppercase tracking-wider">
              TEMPORAL ATTACK TRAJECTORY
            </h2>
            <StatusBadge status="MODEL FORECAST" size="sm" customLabel="HERO GRAPH" />
          </div>
          <p className="text-[11px] text-[#9BA4B0] mt-0.5">
            Observed Past → Current State (NOW) → Model Forecast → Projected Outcomes
          </p>
        </div>

        {/* Epistemic State Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono flex-wrap bg-[#0D1015] px-3 py-1.5 rounded-md border border-[#2A323C]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6F7885]" />
            <span className="text-[#9BA4B0]">OBSERVED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6F8FBE] shadow-[0_0_8px_rgba(111,143,190,0.8)]" />
            <span className="text-[#6F8FBE] font-bold">CURRENT (NOW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-[#718CB8] bg-transparent" />
            <span className="text-[#718CB8]">FORECAST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
            <span className="text-[#4CAF50] font-bold">ACTUAL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF5350]" />
            <span className="text-[#EF5350]">MISSED</span>
          </div>
        </div>
      </div>

      {/* 2. Replay Playback & Graph Control Bar */}
      <div className="flex items-center justify-between bg-[#0D1015] border border-[#2A323C] rounded-lg px-4 py-2 mb-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            title="Reset Replay to T-90s"
            className="p-1.5 rounded bg-[#191F27] hover:bg-[#2A323C] text-[#9BA4B0] hover:text-[#E7EAF0] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepBack}
            title="Step Backward"
            className="p-1.5 rounded bg-[#191F27] hover:bg-[#2A323C] text-[#9BA4B0] hover:text-[#E7EAF0] transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={isPlaying ? pause : play}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors inline-flex items-center gap-1.5 ${
              isPlaying
                ? "bg-[#D97706] hover:bg-[#B45309] text-white"
                : "bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015]"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "PAUSE" : "PLAY REPLAY"}</span>
          </button>
          <button
            onClick={stepForward}
            title="Step Forward (Reveal Next)"
            className="p-1.5 rounded bg-[#191F27] hover:bg-[#2A323C] text-[#9BA4B0] hover:text-[#E7EAF0] transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Replay State Info */}
        <div className="text-xs font-mono text-[#9BA4B0] hidden sm:flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#6F8FBE] animate-pulse" />
          <span>
            REPLAY TICK <strong className="text-[#E7EAF0]">{currentTickIndex + 1}</strong> OF <strong className="text-[#E7EAF0]">{totalTicks}</strong>
          </span>
          <span className="text-[#2A323C]">|</span>
          <span>POSITION: <strong className="text-[#6F8FBE]">{positionedNodes.find(n => n.state === 'current')?.relativeTime || "NOW"}</strong></span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetView}
            className="px-2.5 py-1 rounded bg-[#191F27] hover:bg-[#2A323C] text-[#9BA4B0] hover:text-[#E7EAF0] text-[11px] transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>FIT VIEW</span>
          </button>
        </div>
      </div>

      {/* 3. Hero Interactive SVG DAG Trajectory Graph */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#0D1015] border border-[#2A323C] p-2">
        <svg
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="w-full h-auto min-h-[400px] max-h-[500px] transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel}) translateX(${panX}px)` }}
        >
          {/* Background Grid Patterns & Guidelines */}
          <defs>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6F8FBE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#718CB8" stopOpacity="0.2" />
            </linearGradient>
            <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Edge Arrowhead Markers */}
            <marker id="arrow-observed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6F7885" />
            </marker>
            <marker id="arrow-current" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6F8FBE" />
            </marker>
            <marker id="arrow-forecast" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#718CB8" />
            </marker>
            <marker id="arrow-actual" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4CAF50" />
            </marker>
            <marker id="arrow-missed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF5350" />
            </marker>
          </defs>

          {/* Timeline Axis Guidelines (Top Labels & Dashed Lines) */}
          {timelineSteps.map((step) => {
            const isNowStep = step.label === "NOW";
            return (
              <g key={`timeline-${step.index}`}>
                <line
                  x1={step.x}
                  y1={40}
                  x2={step.x}
                  y2={canvasHeight - 20}
                  stroke={isNowStep ? "#6F8FBE" : "#2A323C"}
                  strokeWidth={isNowStep ? 1.5 : 1}
                  strokeDasharray={isNowStep ? "none" : "3,4"}
                  opacity={isNowStep ? 0.6 : 0.4}
                />
                <rect
                  x={step.x - 30}
                  y={10}
                  width={60}
                  height={22}
                  rx={4}
                  fill={isNowStep ? "#1F2D3D" : "#151A21"}
                  stroke={isNowStep ? "#6F8FBE" : "#2A323C"}
                  strokeWidth={1}
                />
                <text
                  x={step.x}
                  y={25}
                  textAnchor="middle"
                  fill={isNowStep ? "#6F8FBE" : "#9BA4B0"}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {step.label}
                </text>
              </g>
            );
          })}

          {/* Graph Edges (Cubic Bezier Curves) */}
          {graphModel.edges.map((edge) => {
            const sourceNode = positionedNodeMap.get(edge.source);
            const targetNode = positionedNodeMap.get(edge.target);
            if (!sourceNode || !targetNode) return null;

            const tState = targetNode.state;

            let strokeColor = "#6F7885";
            let strokeDash = "none";
            let markerEnd = "url(#arrow-observed)";
            let strokeWidth = 2;

            if (tState === "current") {
              strokeColor = "#6F8FBE";
              markerEnd = "url(#arrow-current)";
              strokeWidth = 2.5;
            } else if (tState === "forecast") {
              strokeColor = "#718CB8";
              strokeDash = "6,4";
              markerEnd = "url(#arrow-forecast)";
              strokeWidth = 2;
            } else if (tState === "actual") {
              strokeColor = "#4CAF50";
              markerEnd = "url(#arrow-actual)";
              strokeWidth = 2.5;
            } else if (tState === "missed") {
              strokeColor = "#EF5350";
              strokeDash = "4,4";
              markerEnd = "url(#arrow-missed)";
              strokeWidth = 1.5;
            }

            // Curve calculation
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const controlX1 = sourceNode.x + dx * 0.45;
            const controlY1 = sourceNode.y;
            const controlX2 = sourceNode.x + dx * 0.55;
            const controlY2 = targetNode.y;

            const pathData = `M ${sourceNode.x + 75} ${sourceNode.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetNode.x - 75} ${targetNode.y}`;
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            return (
              <g key={edge.id}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  markerEnd={markerEnd}
                  className="transition-all duration-300"
                />
                {edge.probability && tState === "forecast" && (
                  <g transform={`translate(${midX - 18}, ${midY - 10})`}>
                    <rect x="0" y="0" width="36" height="18" rx="4" fill="#0D1015" stroke="#718CB8" strokeWidth="1" />
                    <text x="18" y="13" textAnchor="middle" fill="#718CB8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      {edge.probability}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Graph Nodes (Information-Rich Interactive Cards) */}
          {positionedNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const nodeWidth = 160;
            const nodeHeight = 72;
            const nodeX = node.x - nodeWidth / 2;
            const nodeY = node.y - nodeHeight / 2;

            let bgColor = "#151A21";
            let borderColor = "#2A323C";
            let textColor = "#E7EAF0";
            let badgeBg = "#191F27";
            let badgeText = "#9BA4B0";
            let strokeDash = "none";
            let isGlowing = false;

            if (node.state === "current") {
              bgColor = "#1D242D";
              borderColor = "#6F8FBE";
              textColor = "#6F8FBE";
              badgeBg = "#232D3F";
              badgeText = "#6F8FBE";
              isGlowing = true;
            } else if (node.state === "actual") {
              bgColor = "#19241E";
              borderColor = "#4CAF50";
              textColor = "#4CAF50";
              badgeBg = "#1F2D24";
              badgeText = "#4CAF50";
            } else if (node.state === "forecast") {
              bgColor = "#151D2A";
              borderColor = "#718CB8";
              textColor = "#718CB8";
              badgeBg = "#1B2433";
              badgeText = "#718CB8";
              strokeDash = "5,4";
            } else if (node.state === "missed") {
              bgColor = "#251818";
              borderColor = "#EF5350";
              textColor = "#EF5350";
              badgeBg = "#2D1B1B";
              badgeText = "#EF5350";
              strokeDash = "4,4";
            }

            return (
              <g
                key={node.id}
                transform={`translate(${nodeX}, ${nodeY})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
                filter={isGlowing || isSelected ? "url(#shadowGlow)" : undefined}
              >
                {/* Card Outer Border & Shadow */}
                <rect
                  x="0"
                  y="0"
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="8"
                  fill={bgColor}
                  stroke={isSelected ? "#E7EAF0" : borderColor}
                  strokeWidth={node.state === "current" || isSelected ? 2.5 : 1.5}
                  strokeDasharray={strokeDash}
                  className="transition-all duration-200 group-hover:stroke-[#6F8FBE]"
                />

                {/* Top Tactic Header */}
                <text x="10" y="16" fill="#6F7885" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                  {(node.behavior || "ATTACK STEP").toUpperCase()}
                </text>

                {/* Technique Name / Label */}
                <text x="10" y="32" fill={textColor} fontSize="10.5" fontWeight="bold" fontFamily="monospace">
                  {node.techniqueName
                    ? (node.techniqueName.length > 20 ? `${node.techniqueName.slice(0, 18)}...` : node.techniqueName)
                    : node.rawLabel}
                </text>

                {/* MITRE Technique ID */}
                <text x="10" y="47" fill="#9BA4B0" fontSize="9" fontFamily="monospace">
                  {node.techniqueId || "ATT&CK Event"}
                </text>

                {/* Bottom Status & Relative Time Badge */}
                <rect x="8" y="52" width={nodeWidth - 16} height="15" rx="3" fill={badgeBg} />
                <text x="12" y="63" fill={badgeText} fontSize="8" fontWeight="bold" fontFamily="monospace">
                  {node.state.toUpperCase()}
                </text>
                <text x={nodeWidth - 12} y="63" textAnchor="end" fill={textColor} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                  {node.relativeTime}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 4. Interactive Node Detail Drawer / Inspection Modal */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-[#0D1015] border border-[#6F8FBE]/60 rounded-lg text-xs font-mono text-[#E7EAF0] space-y-3 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between border-b border-[#2A323C] pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6F8FBE]" />
              <span className="font-bold text-sm">
                {selectedNode.techniqueId ? `[${selectedNode.techniqueId}] ` : ""}
                {selectedNode.techniqueName || selectedNode.behavior}
              </span>
              <StatusBadge
                status={
                  selectedNode.state === "current"
                    ? "CURRENT"
                    : selectedNode.state === "actual"
                    ? "ACTUAL"
                    : selectedNode.state === "forecast"
                    ? "FORECAST"
                    : selectedNode.state === "missed"
                    ? "MISSED"
                    : "OBSERVED"
                }
                size="sm"
              />
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[#9BA4B0] hover:text-[#E7EAF0] p-1 rounded hover:bg-[#191F27]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-[#6F7885] block uppercase font-bold">Temporal Position</span>
              <span className="text-[#6F8FBE] font-bold">{selectedNode.relativeTime}</span> ({selectedNode.timestamp})
            </div>
            <div>
              <span className="text-[#6F7885] block uppercase font-bold">Source / Target</span>
              <span>{selectedNode.sourceHost || "Telemetry Stream"} → {selectedNode.targetHost || "Target Subnet"}</span>
            </div>
            <div>
              <span className="text-[#6F7885] block uppercase font-bold">Epistemic Source</span>
              <span className="capitalize">{selectedNode.source} ({selectedNode.confidence}% Confidence)</span>
            </div>
            <div>
              <span className="text-[#6F7885] block uppercase font-bold">MITRE Tactic</span>
              <span>{selectedNode.tactic}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#2A323C] text-[11px] text-[#9BA4B0]">
            <strong className="text-[#E7EAF0]">Analytical Telemetry Context:</strong> {selectedNode.details}
          </div>
        </div>
      )}
    </div>
  );
}
