# TECHNICAL AUDIT — AI-Based Network Attack Forecasting Frontend MVP
**SIH 2026 Problem Statement #26153**

---

## 1. Executive Summary

This document provides a comprehensive technical audit of the existing Next.js / Tailwind CSS frontend MVP for the **AI-Based Network Attack Forecasting System**.

### Core Architecture Concept
$$\text{Network Telemetry} \longrightarrow S_t \text{ (Current State)} \longrightarrow \text{Future Attack Trajectory} \longrightarrow \text{Warning Window} \longrightarrow \text{Evidence / WHY} \longrightarrow \text{ATT\&CK Interpretation} \longrightarrow \text{What-If Simulation}$$

The central UI flow is built around:
$$\mathbf{OBSERVED\ PAST} \longrightarrow \mathbf{CURRENT\ NETWORK\ STATE} \longrightarrow \mathbf{FORECAST\ FUTURE} \longrightarrow \mathbf{ACTUAL\ FUTURE\ REVEAL}$$

---

## 2. Route Inventory & Responsibilities

| Route | File Path | Responsibilities & Active Components |
|---|---|---|
| `/` | `frontend/src/app/page.jsx` | **Command Center Dashboard**: Top-level overview combining `TelemetryStrip`, `AttackTrajectory` (hero), `WarningWindowCard`, `LikelihoodChart`, `TopologyMap`, and Defender Intervention CTA. |
| `/forecast` | `frontend/src/app/forecast/page.jsx` | **Attack Forecast Deep-Dive**: Detailed forecast analysis featuring `ForecastHeader`, `ForecastTrajectoryHero`, `ForecastProbabilityChart`, `NextBehaviourCard`, `ForecastEvidenceSection`, and `AttackInterpretationFlow`. |
| `/network` | `frontend/src/app/network/page.jsx` | **Network State & Topology**: Interactive graph visualization of monitored hosts and communication edges with zone labels, host detail panel, and network communication timeline. |
| `/what-if` | `frontend/src/app/what-if/page.jsx` | **What-If Intervention Evaluator**: Counterfactual simulator comparing baseline trajectory vs. intervention-conditioned trajectory, topology changes, and probability divergence. |
| `/scenarios` | `frontend/src/app/scenarios/page.jsx` | **Threat Scenarios Library**: Scenario switcher & catalog listing modeled attack trajectories (Enterprise Lateral Movement & Cloud Exfiltration). |
| `/reports` | `frontend/src/app/reports/page.jsx` | **Executive Threat Summary**: Printable/exportable executive threat intelligence report. |

---

## 3. Component Architecture & Reuse Inventory

### Reusable Without Modification
- `frontend/src/components/Sidebar.jsx`: Navigation menu and system status display.
- `frontend/src/components/StatusBadge.jsx`: Color-coded badges for states (`OBSERVED`, `CURRENT`, `FORECAST`, `WARNING WINDOW`, `ELEVATED`, `CRITICAL`).
- `frontend/src/components/TelemetryStrip.jsx`: Metric strip for active hosts, flows, throughput, and network state.
- `frontend/src/components/forecast/ForecastEvidenceSection.jsx`: Evidence breakdown (feature weights, temporal timeline, topology edge).
- `frontend/src/components/forecast/AttackInterpretationFlow.jsx`: 3-step MITRE ATT&CK mapping flow.

### Displaying Simulated / Mock Forecast Values
- `frontend/src/data/mockData.js`: Authoritative source for mock scenarios (`SCENARIOS[0]` = Enterprise Lateral Movement, `SCENARIOS[1]` = Cloud Exfiltration).
- `frontend/src/components/WarningWindowCard.jsx`: Displays countdown timer and 81% trajectory risk.
- `frontend/src/components/LikelihoodChart.jsx` & `frontend/src/components/forecast/ForecastProbabilityChart.jsx`: Recharts area/line charts bound to `scenario.likelihoodOverTime`.
- `frontend/src/components/forecast/NextBehaviourCard.jsx`: Horizon intensity bars and next likely behaviour metrics.
- `frontend/src/components/WhatIfSimulator.jsx` & `frontend/src/app/what-if/page.jsx`: Simulation trigger & baseline vs. intervention trajectory comparison.

---

## 4. Entry Point of Demo Data

- **State Owner**: `frontend/src/components/AppShell.jsx` maintains `activeScenarioId` using `useState(SCENARIOS[0].id)`.
- **Data Flow**: `AppShell` passes `activeScenario` down to each page component via render props: `children({ activeScenario, setActiveScenarioId })`.
- **Scenario Selection**: Header controls in `frontend/src/components/TopHeader.jsx` and `frontend/src/components/ScenarioSelector.jsx` trigger `setActiveScenarioId`.

---

## 5. Audit Findings & Layout Observations

1. **Static Trajectory Snapshot**: The current trajectory in `mockData.js` is static, with step-3 (Privilege Access) fixed as `isCurrent: true`.
2. **Decoupled Warning Window Timer**: `WarningWindowCard.jsx` runs an isolated `setInterval` countdown from 52s down to 0, which is not synchronized with a global timeline or replay state.
3. **Data Honesty Compliance**: Mock probability values (64%, 81%, 58%) are clearly tagged as `DEMO SCENARIO` / `SIMULATION MODE`, adhering to the data honesty rule (no fabricated metrics presented as live model predictions).
4. **Build & Code Health**: Verified with `npm run build` in `frontend/` — compiled cleanly into 9 static routes without TypeScript or syntax errors.

---

## 6. Target Files for Next Implementation Steps (Replay System)

When implementing the replay sequence in subsequent steps:

1. **State Management**:
   - `frontend/src/context/ReplayContext.jsx` (or custom hook): Manage timeline step indexing, play/pause/step state, and state transitions (`OBSERVED` -> `CURRENT` -> `FORECAST` -> `ACTUAL`).
2. **Controls**:
   - `frontend/src/components/ReplayControlBar.jsx` or `TopHeader.jsx`: Play/Pause, Speed, Step Forward/Back, Reset buttons.
3. **Visualization Components**:
   - `frontend/src/components/AttackTrajectory.jsx` & `frontend/src/components/forecast/ForecastTrajectoryHero.jsx`: Update node status dynamically based on active replay step, revealing the **ACTUAL** future event upon timeline completion.
   - `frontend/src/components/WarningWindowCard.jsx`: Synchronize remaining warning window duration with current replay step.
   - `frontend/src/components/TopologyMap.jsx`: Highlight edges and compromised/target nodes dynamically as replay steps advance.

---

## 7. Verification Status

- `npm run build`: **PASSED** (9 static pages generated successfully)
- Application state: **STABLE & RUNNABLE**
