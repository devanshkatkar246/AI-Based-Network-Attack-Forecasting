# Temporal Network World Model

> **AI-Based Network Attack Forecasting from Network Traffic Data**  
> **Smart India Hackathon (SIH) 2026 — Problem Statement #26153**

---

## 🛡️ Project Overview

Traditional Network Security Operations Centers (SOCs) focus almost exclusively on **current or past event detection** (detecting what is happening *now* or what has *already occurred*). This reactive paradigm leaves defenders with zero reaction time before high-impact attack stages (e.g., Domain Admin escalation, data exfiltration, ransomware encryption).

The **Temporal Network World Model** shifts cybersecurity from reactive detection to **predictive attack forecasting**. By treating cyber attacks as evolving **temporal trajectories** rather than isolated alerts, the system models the network state over time and projects future attack vectors ahead of time, granting defenders a critical **Warning Window** (~60–90 seconds) to intervene before high-impact breach execution.

$$\text{Network Telemetry} \rightarrow \text{Network State} \rightarrow \text{Temporal Dynamics} \rightarrow \text{Future Attack Trajectory} \rightarrow \text{Warning Window} \rightarrow \text{Evidence} \rightarrow \text{What-If Intervention}$$

---

## ✨ Core Features & Pages

- 🎯 **Command Center (`/`)**: Executive intelligence dashboard featuring the **Hero Attack Trajectory Timeline**, **Operational Warning Window (~60–90s)**, Likelihood Curve, and Topology Map.
- 🔮 **Forecast Deep-Dive (`/forecast`)**: Analytical investigation suite answering **WHAT**, **WHEN**, **HOW LIKELY**, and **WHY** (Feature Signals + Temporal Forensic Timeline + Topology Edge Evidence + MITRE ATT&CK flow).
- 🌐 **Network State (`/network`)**: Interactive 8–15 node communication topology graph with network zone boundaries (`INTERNAL`, `SERVERS`, `DATABASE`, `EXTERNAL`), host detail drawer, and seamless **"Simulate Impact"** navigation.
- ⚡ **What-If Intervention Simulation (`/what-if`)**: Counterfactual defender intervention evaluator comparing **BASELINE TRAJECTORY** vs. **INTERVENTION-CONDITIONED TRAJECTORY** with animated trajectory divergence transitions.
- 📚 **Threat Scenarios Library (`/scenarios`)**: Scenario entry point and step flow browser.
- 📄 **Executive Threat Report (`/reports`)**: Printable executive intelligence summary document.

---

## 🎨 Visual Philosophy & Light Theme

- **Observed Events**: Solid borders, solid connector arrows (`───▶`), solid dark slate badges.
- **Current Active State**: Strong blue highlight border (`border-accent`), light blue tint background, `CURRENT` badge.
- **Forecast Events**: Dashed borders (`border-dashed border-forecast-border`), dashed connector arrows (`┈ ┈▶`), violet/indigo background tint, `FORECAST` horizon badge.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Data Visualization**: Recharts v2
- **Animations**: Framer Motion & CSS Keyframes

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/devanshkatkar246/AI-Based-Network-Attack-Forecasting.git
cd AI-Based-Network-Attack-Forecasting
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License & Disclaimers

*This project is built for the Smart India Hackathon (SIH) 2026 Problem Statement #26153 MVP. What-If simulations represent modelled counterfactual predictions for UI demonstration purposes.*
