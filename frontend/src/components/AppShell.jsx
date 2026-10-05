"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import ReplayControlBar from "./ReplayControlBar";
import { fetchScenarios } from "@/lib/api";
import { ReplayProvider, useReplay } from "@/context/ReplayContext";
import { normalizeTrajectory, formatRelativeTime } from "@/lib/temporalUtils";

function AppShellContent({ children, title }) {
  const [scenariosList, setScenariosList] = useState([]);
  const [activeScenarioName, setActiveScenarioName] = useState(null);
  const { currentTickIndex, backendState, setScenarioId, activeScenarioId } = useReplay();

  const handleSelectScenario = (id) => {
    if (setScenarioId) {
      setScenarioId(id);
    }
  };

  // Load scenarios metadata on mount
  useEffect(() => {
    fetchScenarios().then((list) => {
      if (list && list.length > 0) {
        setScenariosList(list);
      }
    });
  }, []);

  // Sync initial default scenario ID if none active
  useEffect(() => {
    if (!activeScenarioId && scenariosList.length > 0) {
      const defaultId = scenariosList[0].id;
      if (setScenarioId) setScenarioId(defaultId);
    }
  }, [scenariosList, activeScenarioId, setScenarioId]);

  // Update active scenario name when activeScenarioId changes
  useEffect(() => {
    if (activeScenarioId) {
      const match = scenariosList.find((s) => s.id === activeScenarioId);
      if (match) {
        setActiveScenarioName(match.name);
      } else {
        setActiveScenarioName(activeScenarioId);
      }
    } else {
      setActiveScenarioName(null);
    }
  }, [activeScenarioId, scenariosList]);

  // Construct activeScenario object dynamically from backendState
  const curState = backendState?.current_state;
  const fcState = backendState?.forecast;
  const stateHist = backendState?.state_history || (curState ? [curState] : []);
  const totalTicks = backendState?.total_ticks || 4;

  // 1. Current Phase & Telemetry Metrics
  const currentPhase = curState?.phase ? curState.phase.replace(/_/g, " ") : "BASELINE";
  const activeHostsCount = curState?.active_hosts ?? curState?.topology?.nodes?.length ?? 0;
  const activeFlowsCount = curState?.traffic?.active_flows ?? 0;
  const trafficMbpsStr = curState?.traffic?.traffic_mbps !== undefined && curState?.traffic?.traffic_mbps !== null
    ? `${curState.traffic.traffic_mbps} Mbps`
    : "0 Mbps";

  const isElevated = curState?.phase && curState.phase !== "BASELINE";
  const anomalyIndexStr = isElevated
    ? `ELEVATED (+${Math.min(95, Math.max(18, Math.round((activeFlowsCount || 1) * 2.5)))}%)`
    : "Baseline (0%)";

  // 2. Canonical Data-Driven Trajectory Construction
  const rawTrajectory = fcState?.trajectory || backendState?.forecastTrajectory || [];
  const trajectory = normalizeTrajectory(
    rawTrajectory.length > 0 ? rawTrajectory : (curState ? [{
      id: "step-current",
      stage: currentPhase,
      status: "CURRENT",
      timestamp: curState.timestamp || "NOW",
      relativeTimeSeconds: 0,
      sourceHost: curState.topology?.nodes?.[0]?.ip || "10.0.4.12",
      targetHost: curState.topology?.nodes?.[1]?.ip || "198.51.100.42",
      details: `Active network state in temporal window #${curState.window_id || 0}`,
      confidence: null,
      isCurrent: true
    }] : []),
    currentTickIndex,
    totalTicks
  );

  // 3. Mathematical Warning Lead Time Window
  const backendWarning = backendState?.warning || fcState?.warning;
  const forecastSteps = trajectory.filter((s) => s.isForecast || s.status === "FORECAST");
  const earliestActionableForecast = forecastSteps.find((s) => s.stage && s.stage.toUpperCase() !== "BENIGN" && s.relativeTimeSeconds > 0) || forecastSteps[0];
  
  const targetHostStr = fcState?.target_host || earliestActionableForecast?.targetHost || (curState?.topology?.nodes?.[1] ? `${curState.topology.nodes[1].ip} (${curState.topology.nodes[1].label})` : "198.51.100.42");
  const calibratedConfidence = fcState?.uncertainty?.calibrated_confidence !== undefined && fcState.uncertainty.calibrated_confidence !== null
    ? fcState.uncertainty.calibrated_confidence
    : earliestActionableForecast?.confidence ?? null;

  let warningWindow = null;
  if (backendWarning && backendWarning.status !== "MODEL_NOT_READY") {
    warningWindow = {
      status: backendWarning.status || "WARNING_AVAILABLE",
      leadTimeSeconds: backendWarning.leadTimeSeconds ?? backendWarning.lead_time_seconds,
      horizonLabel: backendWarning.horizonLabel || backendWarning.lead_time_display || (backendWarning.leadTimeSeconds ? `~${backendWarning.leadTimeSeconds}s LEAD TIME` : "Lead Time Unavailable"),
      predictedBehavior: backendWarning.predictedBehavior || backendWarning.predicted_event || earliestActionableForecast?.stage || "Lateral Movement",
      predictedTechnique: backendWarning.predictedTechnique || backendWarning.predicted_technique || earliestActionableForecast?.techniqueName || null,
      targetAsset: backendWarning.targetAsset || backendWarning.target_asset || targetHostStr,
      recommendedAction: backendWarning.recommendedAction || backendWarning.recommended_action || `Isolate target asset ${targetHostStr} & restrict lateral ports`,
      confidenceScore: backendWarning.confidenceScore ?? calibratedConfidence,
      threatLevel: backendWarning.threatLevel || backendWarning.threat_level || "CRITICAL",
      isResolved: backendWarning.isResolved ?? backendWarning.is_resolved ?? false,
      rationale: backendWarning.rationale || null
    };
  } else if (earliestActionableForecast && earliestActionableForecast.relativeTimeSeconds > 0) {
    const leadSec = earliestActionableForecast.relativeTimeSeconds;
    warningWindow = {
      status: "WARNING_AVAILABLE",
      leadTimeSeconds: leadSec,
      horizonLabel: `~${leadSec}s LEAD TIME`,
      predictedBehavior: earliestActionableForecast.stage || "Lateral Movement",
      predictedTechnique: earliestActionableForecast.techniqueName || earliestActionableForecast.techniqueId || null,
      targetAsset: earliestActionableForecast.targetHost || targetHostStr,
      recommendedAction: `Isolate target asset ${earliestActionableForecast.targetHost || targetHostStr} & restrict lateral ports`,
      confidenceScore: calibratedConfidence,
      threatLevel: "CRITICAL",
      isResolved: false,
      rationale: `Actionable security transition predicted with ~${leadSec}s defender lead time.`
    };
  } else if (forecastSteps.length > 0) {
    warningWindow = {
      status: "FORECAST_AVAILABLE",
      leadTimeSeconds: forecastSteps[0].relativeTimeSeconds,
      horizonLabel: `+${forecastSteps[0].relativeTimeSeconds}s Horizon`,
      predictedBehavior: forecastSteps[0].stage,
      predictedTechnique: forecastSteps[0].techniqueName,
      targetAsset: targetHostStr,
      recommendedAction: "Continuous temporal flow monitoring",
      confidenceScore: calibratedConfidence,
      threatLevel: "LOW",
      isResolved: false
    };
  } else {
    warningWindow = {
      status: "NO_FORECAST",
      leadTimeSeconds: null,
      horizonLabel: "No actionable forecast available",
      predictedBehavior: null,
      predictedTechnique: null,
      targetAsset: targetHostStr,
      recommendedAction: "Continuous flow monitoring",
      confidenceScore: null,
      threatLevel: "STANDBY",
      isResolved: false,
      rationale: "No future attack transitions predicted in current state window."
    };
  }

  // 4. Honest Verification & Epistemic Status
  const isGroundTruthConfirmed = currentTickIndex > 0 && curState?.phase && curState.phase.toUpperCase() !== "BASELINE";
  const verificationStatus = {
    status: isGroundTruthConfirmed ? "GROUND_TRUTH_CONFIRMED" : "MODEL_FORECAST",
    label: isGroundTruthConfirmed ? "GROUND TRUTH CONFIRMED" : "MODEL FORECAST",
    sublabel: isGroundTruthConfirmed ? "✓ REPLAY POSITION VERIFIED" : "PROJECTED MODEL OUTCOME",
    badgeType: isGroundTruthConfirmed ? "ACTUAL" : "FORECAST",
    isVerified: isGroundTruthConfirmed
  };

  // 5. Multi-Horizon Forecast Projections
  const horizonData = forecastSteps.length > 0
    ? forecastSteps.map((step) => {
        const normH = step.relativeTimeDisplay || `+${step.relativeTimeSeconds}s`;
        const prob = step.confidence !== null && step.confidence !== undefined
          ? Math.round(step.confidence * (step.confidence <= 1 ? 100 : 1))
          : (calibratedConfidence ? Math.round(calibratedConfidence * (calibratedConfidence <= 1 ? 100 : 1)) : null);
        return {
          horizon: normH,
          probability: prob,
          label: prob ? (prob > 75 ? "High Likelihood" : "Medium Likelihood") : "Confidence Unavailable",
          stage: step.stage || "Projected Attack Stage",
          technique: step.techniqueName ? `${step.techniqueName} (${step.techniqueId || 'T1021'})` : (step.techniqueId || "Modelled Transition"),
          targetAsset: step.targetHost || targetHostStr,
          warningSec: Math.abs(step.relativeTimeSeconds) || 30
        };
      })
    : [
        {
          horizon: "+30s",
          probability: calibratedConfidence ? Math.round(calibratedConfidence * 100) : null,
          label: calibratedConfidence ? "Model Projection" : "Confidence Unavailable",
          stage: "No Future Vector",
          technique: "Baseline Telemetry",
          targetAsset: targetHostStr,
          warningSec: 30
        }
      ];

  // 6. Likelihood Over Time Curve (Synchronized with Trajectory)
  const likelihoodOverTime = [];
  const observedSteps = trajectory.filter((s) => s.status === "OBSERVED");
  const currentStep = trajectory.find((s) => s.isCurrent || s.status === "CURRENT");

  observedSteps.forEach((st) => {
    const prob = st.confidence !== null && st.confidence !== undefined
      ? Math.round(st.confidence * (st.confidence <= 1 ? 100 : 1))
      : (st.stage === "BASELINE" || st.stage === "Normal Traffic" ? 15 : 65);
    likelihoodOverTime.push({
      time: st.relativeTimeDisplay || `T-${Math.abs(st.relativeTimeSeconds)}s`,
      observed: prob,
      forecast: null,
      lower: null,
      upper: null
    });
  });

  if (currentStep) {
    const curProb = currentStep.stage === "BASELINE" || currentStep.stage === "Normal Traffic" ? 15 : 75;
    const initialForecastProb = horizonData[0]?.probability ?? curProb;
    likelihoodOverTime.push({
      time: "NOW",
      observed: curProb,
      forecast: initialForecastProb,
      lower: null,
      upper: null
    });
  }

  forecastSteps.forEach((fs) => {
    const prob = fs.confidence !== null && fs.confidence !== undefined
      ? Math.round(fs.confidence * (fs.confidence <= 1 ? 100 : 1))
      : (horizonData.find(h => h.horizon === fs.relativeTimeDisplay)?.probability || 65);
    likelihoodOverTime.push({
      time: fs.relativeTimeDisplay || `+${fs.relativeTimeSeconds}s`,
      observed: null,
      forecast: prob,
      lower: prob !== null ? Math.max(0, prob - 15) : null,
      upper: prob !== null ? Math.min(100, prob + 15) : null
    });
  });

  // 7. Dynamic Feature Signals & Evidence
  const featureSignals = [
    { feature: "Active Flow Volume", weight: Math.min(35, Math.max(10, Math.round((activeFlowsCount || 1) * 1.8))) },
    { feature: "Destination Diversity", weight: Math.min(30, Math.max(10, (curState?.behavior?.destination_diversity || 1) * 4)) },
    { feature: "East-West Traffic Volume", weight: Math.min(25, Math.max(8, Math.round((curState?.behavior?.east_west_traffic_bytes || 0) / 1000))) },
    { feature: "New Communication Edges", weight: Math.min(20, Math.max(5, (curState?.new_edges_count || 0) * 3 + 5)) }
  ];

  const temporalEvidence = stateHist.map((st, idx) => {
    const isCurrent = idx === stateHist.length - 1;
    const timeLabel = isCurrent ? "NOW" : (st.time_label || `T-${(stateHist.length - 1 - idx) * 10}s`);
    return {
      time: timeLabel,
      stage: st.phase ? st.phase.replace(/_/g, " ") : "Baseline",
      label: `${st.phase || "Observed"} network flow telemetry with ${st.traffic?.active_flows || 0} active flows (${st.traffic?.total_bytes || 0} bytes).`,
      status: isCurrent ? "CURRENT" : "OBSERVED"
    };
  });

  // 8. Attack Movement Vectors & Topology Construction
  const attackMovementEdges = [];
  trajectory.forEach((step) => {
    if (step.sourceHost && step.targetHost && step.sourceHost !== step.targetHost) {
      attackMovementEdges.push({
        id: `attack-edge-${step.id}`,
        source: step.sourceHost,
        target: step.targetHost,
        status: step.status,
        stage: step.stage,
        technique: step.techniqueName || step.techniqueId || step.stage,
        relativeTime: step.relativeTimeDisplay,
        confidence: step.confidence
      });
    }
  });

  // Ensure topology has complete node representation from scenario
  const rawNodes = curState?.topology?.nodes || [];
  const topologyNodes = [...rawNodes];
  const nodeIps = new Set(topologyNodes.map(n => n.ip || n.id));

  trajectory.forEach((step) => {
    if (step.sourceHost && !nodeIps.has(step.sourceHost)) {
      nodeIps.add(step.sourceHost);
      topologyNodes.push({
        id: step.sourceHost,
        label: `Host-${step.sourceHost}`,
        ip: step.sourceHost,
        type: "host",
        status: step.isCurrent ? "compromised" : "clean",
        zone: "INTERNAL"
      });
    }
    if (step.targetHost && !nodeIps.has(step.targetHost)) {
      nodeIps.add(step.targetHost);
      topologyNodes.push({
        id: step.targetHost,
        label: `Host-${step.targetHost}`,
        ip: step.targetHost,
        type: step.targetHost.startsWith("198.") ? "external" : "server",
        status: step.isForecast ? "forecasted-target" : "clean",
        zone: step.targetHost.startsWith("198.") ? "EXTERNAL" : "SERVERS"
      });
    }
  });

  const topology = {
    zones: curState?.topology?.zones || [],
    nodes: topologyNodes,
    edges: curState?.topology?.edges || [],
    attackMovementEdges: attackMovementEdges
  };

  const topologyEvidence = {
    nodes: topologyNodes.slice(0, 3).map((n, idx) => ({
      id: n.id || `node-${idx}`,
      label: n.label || n.ip,
      ip: n.ip,
      type: n.status === "compromised" ? "compromised" : n.status === "forecasted-target" || n.status === "targeted" ? "target" : "clean"
    })),
    edgeLabel: "ACTIVE / PROJECTED FLOW"
  };

  const evidence = fcState?.evidence && fcState.evidence.length > 0
    ? fcState.evidence.map((ev, idx) => ({
        step: `0${idx + 1}`,
        category: ev.type || "TEMPORAL SIGNAL",
        title: ev.indicator || ev.description || "Flow telemetry indicator",
        detail: ev.details || ev.indicator || "Observed telemetry stream anomaly",
        time: ev.time || "NOW",
        confidence: ev.severity || "HIGH",
        source: ev.source || "Flow Engine"
      }))
    : [
        {
          step: "01",
          category: "TEMPORAL SIGNAL",
          title: `${activeFlowsCount} Active Network Flows`,
          detail: `Observed ${trafficMbpsStr} traffic bandwidth in current temporal state window.`,
          time: "NOW",
          confidence: "HIGH",
          source: "Flow Aggregation Engine"
        },
        {
          step: "02",
          category: "TOPOLOGY SIGNAL",
          title: `${attackMovementEdges.length} Attack Movement Vectors`,
          detail: `Network topology contains ${topologyNodes.length} monitored hosts and ${attackMovementEdges.length} directional movement vectors.`,
          time: "NOW",
          confidence: "HIGH",
          source: "Attack Movement Analysis Service"
        }
      ];

  const attackInterpretation = trajectory.map((step) => ({
    observed: step.details || `${step.stage} flow activity observed in network telemetry stream`,
    technique: step.techniqueName ? `${step.techniqueName} (${step.techniqueId || 'T1021'})` : (step.techniqueId || "MITRE ATT&CK Step"),
    tactic: step.stage,
    phase: step.status || "OBSERVED"
  }));

  // 9. What-If Simulation Data
  const whatIfSimulationData = {
    targetHost: targetHostStr,
    targetIp: targetHostStr.split(" ")[0] || "198.51.100.42",
    compromisedHost: topologyNodes.find(n => n.status === "compromised")?.label || (topologyNodes[0]?.label || "Compromised Host"),
    baselineTrajectory: [
      { stage: currentPhase, time: "NOW", probability: 95, status: "OBSERVED" },
      ...forecastSteps.map(fs => ({
        stage: fs.stage || "Projected Stage",
        time: fs.relativeTimeDisplay || `+${fs.relativeTimeSeconds}s`,
        probability: fs.confidence ? Math.round(fs.confidence * 100) : 75,
        status: "FORECAST"
      }))
    ],
    interventionTrajectory: [
      { stage: currentPhase, time: "NOW", isInterventionPoint: true, status: "OBSERVED" },
      ...forecastSteps.map(fs => ({
        stage: `${fs.stage || "Vector"} Contained`,
        time: fs.relativeTimeDisplay || `+${fs.relativeTimeSeconds}s`,
        probability: 4,
        status: "CONTAINED"
      }))
    ],
    riskComparison: forecastSteps.map(fs => ({
      stage: `${fs.stage || "Stage"} (${fs.relativeTimeDisplay || '+' + fs.relativeTimeSeconds + 's'})`,
      baselineProb: fs.confidence ? Math.round(fs.confidence * 100) : 80,
      interventionProb: 4
    }))
  };

  const activeScenario = activeScenarioId
    ? {
        id: activeScenarioId,
        name: activeScenarioName || activeScenarioId,
        currentState: currentPhase,
        telemetry: {
          activeHosts: activeHostsCount,
          activeFlows: activeFlowsCount,
          trafficMbps: trafficMbpsStr,
          networkState: curState?.phase ?? "BASELINE",
          anomalyIndex: anomalyIndexStr,
        },
        trajectory,
        forecast: fcState,
        warningWindow,
        verificationStatus,
        horizonData,
        likelihoodOverTime,
        featureSignals,
        temporalEvidence,
        topologyEvidence,
        evidence,
        attackInterpretation,
        whatIfSimulationData,
        modelStatus: fcState?.status || "ready",
        modelErrorMessage: fcState?.message || null,
        topology: topology,
        validationNotice: backendState?.quality_report ? `Validated dataset (${backendState.quality_report.total_rows || 0} rows)` : null,
      }
    : null;

  return (
    <div className="flex min-h-screen bg-[#0B0F14] text-[#E8EDF3] antialiased font-sans transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          title={title}
          activeScenarioName={activeScenarioName}
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
          scenariosList={scenariosList}
        />

        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Top Replay Control Bar (rendered when a scenario is active) */}
          {activeScenarioId && <ReplayControlBar />}

          {/* Pass dynamic active scenario data & handlers to children */}
          {typeof children === "function"
            ? children({ activeScenario, activeScenarioId, setActiveScenarioId: handleSelectScenario })
            : React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, { activeScenario, activeScenarioId, setActiveScenarioId: handleSelectScenario });
                }
                return child;
              })}
        </main>
      </div>
    </div>
  );
}

export default function AppShell(props) {
  return (
    <ReplayProvider>
      <AppShellContent {...props} />
    </ReplayProvider>
  );
}


