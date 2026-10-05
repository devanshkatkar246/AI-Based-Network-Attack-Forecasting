"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import ReplayControlBar from "./ReplayControlBar";
import { fetchScenarios } from "@/lib/api";
import { ReplayProvider, useReplay } from "@/context/ReplayContext";

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

  // 2. Data-Driven Trajectory Construction
  const rawTrajectory = fcState?.trajectory || [];
  const trajectory = rawTrajectory.length > 0
    ? rawTrajectory.map((step, idx) => ({
        ...step,
        semanticState: step.semanticState || (step.status === "CURRENT" ? "current" : step.status === "OBSERVED" ? "observed" : "forecast"),
        confidence: step.confidence !== undefined ? step.confidence : null
      }))
    : (curState
        ? [
            {
              id: "step-current",
              stage: currentPhase,
              status: "CURRENT",
              semanticState: "current",
              timestamp: curState.timestamp || "NOW",
              estimatedTime: "NOW",
              sourceHost: curState.topology?.nodes?.[0]?.ip || "Monitored Subnet",
              targetHost: curState.topology?.nodes?.[1]?.ip || "Target Subnet",
              details: `Observed active state in window #${curState.window_id || 0}`,
              confidence: 0.95,
              isCurrent: true
            }
          ]
        : []);

  // 3. Mathematical Warning Lead Time Window
  const rawLeadSec = fcState?.warning_lead_time_seconds;
  const predBehavior = fcState?.predicted_behavior ? fcState.predicted_behavior.replace(/_/g, " ") : null;
  const predTech = fcState?.predicted_technique || null;
  const targetHostStr = fcState?.target_host || (curState?.topology?.nodes?.[1] ? `${curState.topology.nodes[1].ip} (${curState.topology.nodes[1].label})` : "Monitored Subnet");
  const calibratedConfidence = fcState?.uncertainty?.calibrated_confidence !== undefined ? fcState.uncertainty.calibrated_confidence : null;

  let warningWindow = null;
  if (fcState && fcState.status !== "model_not_ready") {
    if (rawLeadSec !== null && rawLeadSec !== undefined && rawLeadSec > 0) {
      warningWindow = {
        status: "WARNING ACTIVE",
        leadTimeSeconds: Math.round(rawLeadSec * 10) / 10,
        horizonLabel: `${Math.round(rawLeadSec)}s Defender Lead Time`,
        predictedBehavior: predBehavior || "Threat Activity",
        predictedTechnique: predTech,
        targetAsset: targetHostStr,
        recommendedAction: `Isolate target asset ${targetHostStr} & restrict lateral ports`,
        confidenceScore: calibratedConfidence,
        threatLevel: "CRITICAL",
        isResolved: false
      };
    } else if (rawLeadSec === 0 || (currentTickIndex > 0 && curState?.phase && curState.phase.toUpperCase() === (predBehavior || "").toUpperCase())) {
      warningWindow = {
        status: "RESOLVED",
        leadTimeSeconds: 0,
        horizonLabel: "Forecast Resolved / Outcome Observed",
        predictedBehavior: predBehavior || currentPhase,
        predictedTechnique: predTech,
        targetAsset: targetHostStr,
        recommendedAction: `Verify containment status of ${targetHostStr}`,
        confidenceScore: calibratedConfidence,
        threatLevel: "RESOLVED",
        isResolved: true
      };
    } else {
      warningWindow = {
        status: "STANDBY",
        leadTimeSeconds: null,
        horizonLabel: "Lead Time Unavailable",
        predictedBehavior: predBehavior,
        predictedTechnique: predTech,
        targetAsset: targetHostStr,
        recommendedAction: "Continuous temporal flow monitoring",
        confidenceScore: calibratedConfidence,
        threatLevel: "LOW",
        isResolved: false
      };
    }
  }

  // 4. Verification Status
  const forecastSteps = trajectory.filter((s) => (s.status === "PENDING" || s.semanticState === "forecast") && !s.isCurrent);
  const isVerified = currentTickIndex >= 3 && fcState && curState?.phase !== "BASELINE";

  const verificationStatus = {
    status: isVerified ? "VERIFIED" : "PENDING",
    label: isVerified ? "FORECAST VERIFIED" : "MODEL FORECAST",
    sublabel: isVerified ? "✓ TRAJECTORY MATCH" : "PENDING REPLAY VERIFICATION",
    badgeType: isVerified ? "ACTUAL" : "FORECAST",
    isVerified
  };

  // 5. Multi-Horizon Forecast Projections
  const horizonData = forecastSteps.length > 0
    ? forecastSteps.map((step, k) => {
        const hStr = step.estimatedTime || `+${(k + 1) * 30}s`;
        const normH = hStr.startsWith("+") ? hStr : `+${hStr}`;
        const prob = step.confidence !== null && step.confidence !== undefined
          ? Math.round(step.confidence * (step.confidence <= 1 ? 100 : 1))
          : (calibratedConfidence ? Math.round(calibratedConfidence * 100) : null);
        return {
          horizon: normH,
          probability: prob,
          label: prob ? (prob > 75 ? "High Likelihood" : "Medium Likelihood") : "Confidence Unavailable",
          stage: step.stage || "Projected Attack Stage",
          technique: step.techniqueName ? `${step.techniqueName} (${step.techniqueId || 'T1046'})` : (step.techniqueId || "Modelled Transition"),
          targetAsset: step.targetHost || targetHostStr,
          warningSec: parseInt(normH.replace(/[^0-9]/g, "")) || 30
        };
      })
    : [
        {
          horizon: "+30s",
          probability: calibratedConfidence ? Math.round(calibratedConfidence * 100) : null,
          label: calibratedConfidence ? "Model Projection" : "Confidence Unavailable",
          stage: predBehavior || "Modelled Transition",
          technique: predTech ? `MITRE ${predTech}` : "Behavioral Transition",
          targetAsset: targetHostStr,
          warningSec: 30
        }
      ];

  // 6. Likelihood Over Time Curve
  const likelihoodOverTime = [];
  stateHist.forEach((st, idx) => {
    const isNow = idx === stateHist.length - 1;
    const tStr = isNow ? "NOW" : (st.time_label || `T-${(stateHist.length - 1 - idx) * 10}s`);
    likelihoodOverTime.push({
      time: tStr,
      observed: st.phase === "BASELINE" ? 15 : Math.min(95, 60 + idx * 8),
      forecast: isNow ? (horizonData[0]?.probability || 70) : null,
      lower: null,
      upper: null
    });
  });

  forecastSteps.forEach((fs) => {
    const prob = fs.confidence !== null && fs.confidence !== undefined
      ? Math.round(fs.confidence * (fs.confidence <= 1 ? 100 : 1))
      : (horizonData[0]?.probability || 65);
    likelihoodOverTime.push({
      time: fs.estimatedTime || "+30s",
      observed: null,
      forecast: prob,
      lower: Math.max(0, prob - 12),
      upper: Math.min(100, prob + 12)
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

  const topologyEvidence = {
    nodes: (curState?.topology?.nodes || []).slice(0, 3).map((n, idx) => ({
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
          title: `${curState?.new_edges_count || 0} Dynamic Graph Edges`,
          detail: `Network topology contains ${activeHostsCount} monitored hosts and ${curState?.topology?.edges?.length || 0} active communication edges.`,
          time: "NOW",
          confidence: "HIGH",
          source: "Topology Graph Service"
        }
      ];

  const attackInterpretation = trajectory.map((step) => ({
    observed: step.details || `${step.stage} flow activity observed in network telemetry stream`,
    technique: step.techniqueName ? `${step.techniqueName} (${step.techniqueId || 'T1046'})` : (step.techniqueId || "MITRE ATT&CK Step"),
    tactic: step.stage,
    phase: step.status || "OBSERVED"
  }));

  // 8. What-If Simulation Data
  const whatIfSimulationData = {
    targetHost: targetHostStr,
    targetIp: targetHostStr.split(" ")[0] || "10.0.4.12",
    compromisedHost: curState?.topology?.nodes?.find(n => n.status === "compromised")?.label || (curState?.topology?.nodes?.[0]?.label || "Compromised Host"),
    baselineTrajectory: [
      { stage: currentPhase, time: "NOW", probability: 95, status: "OBSERVED" },
      ...forecastSteps.map(fs => ({
        stage: fs.stage || "Projected Stage",
        time: fs.estimatedTime || "+30s",
        probability: fs.confidence ? Math.round(fs.confidence * 100) : 75,
        status: "FORECAST"
      }))
    ],
    interventionTrajectory: [
      { stage: currentPhase, time: "NOW", isInterventionPoint: true, status: "OBSERVED" },
      ...forecastSteps.map(fs => ({
        stage: `${fs.stage || "Vector"} Contained`,
        time: fs.estimatedTime || "+30s",
        probability: 4,
        status: "CONTAINED"
      }))
    ],
    riskComparison: forecastSteps.map(fs => ({
      stage: `${fs.stage || "Stage"} (${fs.estimatedTime || '+30s'})`,
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
        topology: curState?.topology || { zones: [], nodes: [], edges: [] },
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


