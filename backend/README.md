# Phase 1 Operational Backend — Temporal Network World Model

**Project:** TECH πRATES — Temporal Network World Model for Early Network Attack Forecasting  
**Problem Statement:** SIH 26153 — AI-Based Network Attack Forecasting from Network Traffic Data  

---

## 📌 Phase 1 Objective & Overview

Phase 1 provides a clean, lightweight, production-structured FastAPI backend operational pipeline that makes the Next.js frontend genuinely data-driven.

> **Note on Forecasting Engine:** Phase 1 uses a lightweight forecasting engine (`LightweightForecastEngine`). The Temporal Network World Model (Encoder + Latent Dynamics + K-Step Rollout) is planned for Phase 2.

---

## 🏗 Conceptual Pipeline Architecture

```
Raw CSV / Parquet / Demo Scenario
              ↓
       Data Ingestion
              ↓
        Validation
              ↓
      Normalization
              ↓
      Temporal Windowing (10s configurable windows)
              ↓
       Network State S_t
              ↓
     Temporal State History
              ↓
    Lightweight Forecast Engine (ForecastEngine Abstraction)
              ↓
       Attack Trajectory (observed | current | forecast | actual)
              ↓
 Warning Lead Time (Only calculated when ground truth timestamps exist)
              ↓
 Supporting Evidence (Network, Temporal, Topology Signals)
              ↓
   Local MITRE ATT&CK Mapping (mitre_attack_kb.json)
              ↓
          What-If API
              ↓
          FastAPI Backend (http://localhost:8000/api/v1)
              ↓
         Next.js Frontend
```

---

## 📂 Repository Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI entry point & global exception handlers
│   ├── api/
│   │   └── v1/                  # API v1 Router Endpoints
│   │       ├── health.py        # GET /api/v1/health
│   │       ├── scenarios.py     # Scenario loading & temporal replay APIs
│   │       ├── network.py       # Network state, history, topology APIs
│   │       ├── forecast.py      # Trajectory & forecasting APIs
│   │       ├── explanation.py   # Supporting evidence APIs
│   │       ├── attack.py        # MITRE ATT&CK mapping APIs
│   │       └── what_if.py       # Intervention simulation API
│   ├── services/                # Pipeline Engine Services
│   │   ├── ingestion.py         # CSV/Parquet ingestion & column normalization
│   │   ├── validation.py        # Data quality validator & quality report generator
│   │   ├── windowing.py         # Configurable temporal windowing (10s default)
│   │   ├── state_builder.py     # Aggregated Network State S_t builder
│   │   ├── topology.py          # NetworkX communication graph & new-edge detector
│   │   ├── forecasting.py       # ForecastEngine ABC & LightweightForecastEngine
│   │   ├── explanation.py       # Supporting evidence signal generator
│   │   ├── attack_mapping.py    # Local MITRE ATT&CK KB mapper
│   │   └── what_if.py           # Intervention simulator
│   ├── models/                  # Pydantic v2 Data Models
│   │   ├── schemas.py           # Core schemas (State, Telemetry, Topology, Trajectory, What-If)
│   │   └── forecast_result.py   # ForecastResult & ModelNotReadyResult schemas
│   └── pipeline/
│       └── orchestrator.py      # Pipeline orchestrator
├── data/
│   ├── attack/
│   │   └── mitre_attack_kb.json # Local offline MITRE ATT&CK Knowledge Base
│   └── demo/
│       └── enterprise_lateral_movement_01.csv # Standard benchmark demo dataset
├── tests/                       # Pytest test suite (100% passing)
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Docker deployment manifest
└── README.md                    # Documentation
```

---

## 🚀 Quick Start & Running Locally

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Backend Server
```bash
uvicorn app.main:app --reload --port 8000
```
FastAPI interactive Swagger UI will be available at: `http://localhost:8000/docs`

### 3. Run Pytest Test Suite
```bash
python -m pytest tests
```

---

## 🔌 API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health status and engine mode |
| `GET` | `/api/v1/scenarios` | List available network attack scenarios |
| `GET` | `/api/v1/scenarios/{id}` | Get scenario details and data quality report |
| `POST` | `/api/v1/scenarios/{id}/load` | Load & process scenario telemetry |
| `GET` | `/api/v1/scenarios/{id}/replay?tick=N` | Replay state history & forecast at tick `N` |
| `GET` | `/api/v1/network/state` | Current aggregated network state $S_t$ |
| `GET` | `/api/v1/network/topology` | Communication graph & new edges |
| `GET` | `/api/v1/forecast` | Attack trajectory, lead time, and forecast result |
| `GET` | `/api/v1/explanation` | Supporting empirical evidence signals |
| `GET` | `/api/v1/attack/mapping` | Local MITRE ATT&CK knowledge base mapping |
| `POST` | `/api/v1/what-if` | Simulate intervention scenario (e.g. host isolation) |

---

## 🔒 Offline Execution Requirement

The backend operates 100% locally and offline without external dependencies on cloud AI APIs, OpenAI, or remote MITRE endpoints. All ATT&CK mappings are served from `data/attack/mitre_attack_kb.json`.

---

## 🔄 Phase 2 Extension Point

The forecasting interface is defined via an abstract base class `ForecastEngine`:

```python
class ForecastEngine(ABC):
    @abstractmethod
    def forecast(self, state_history: List[NetworkState]) -> Union[ForecastResult, ModelNotReadyResult]:
        pass
```

In Phase 2, `LightweightForecastEngine` can be replaced with `TemporalWorldModel` (Neural Encoder $\rightarrow$ Latent Dynamics $\rightarrow$ K-Step Rollout) without changing the frontend API contract, trajectory schema, topology mapping, or evidence structures.
