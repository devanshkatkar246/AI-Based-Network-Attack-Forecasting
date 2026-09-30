# 🛡️ Tech πRates --- Temporal Network World Model {#shield-tech-πrates--temporal-network-world-model}

### AI-Based Network Attack Forecasting from Network Traffic Data

> **From detecting attacks → to forecasting where they are heading.**

**Smart India Hackathon 2026 · Problem Statement 26153**\
**Theme:** Cybersecurity & Intelligence\
**Team:** Tech πRates

------------------------------------------------------------------------

## ⚡ What if a security system could see the trajectory, not just the alert? {#zap-what-if-a-security-system-could-see-the-trajectory-not-just-the-alert}

Most network-security workflows are optimized to answer:

> **"What is happening right now?"**

Tech πRates is designed to answer:

> **"Given what has happened so far, what is likely to happen next?"**

We model network behaviour as an evolving sequence of **temporal network
states**, learn the dynamics between those states with a **Temporal
Network World Model**, and roll the learned dynamics forward to forecast
a **future attack trajectory**.

The intended output answers four operational questions:

-   🔮 **WHAT** --- likely future malicious behaviour
-   ⏱️ **WHEN** --- estimated warning lead time
-   🔍 **WHY** --- temporal, feature and topology evidence supporting
    the forecast
-   🧪 **WHAT-IF** --- projected trajectory under a modelled defensive
    intervention

> **Cyber attacks are trajectories, not isolated events.**

------------------------------------------------------------------------

## 🎯 Problem {#dart-problem}

A multi-stage attack rarely appears as one isolated malicious packet.

A possible progression is:

``` text
Reconnaissance → Initial Access → Discovery / Credential Access
→ Lateral Movement → Command & Control → Exfiltration / Impact
```

Real attacks are not guaranteed to follow a fixed linear sequence. They
can branch, repeat, skip behaviours, or change direction.

The challenge is therefore:

``` text
Observed network behaviour
          ↓
Current network state
          ↓
How is the state evolving?
          ↓
Where is the trajectory likely to go?
          ↓
How much warning time is available?
```

Tech πRates focuses on this forecasting layer.

------------------------------------------------------------------------

## 💡 Core Architecture {#bulb-core-architecture}

``` mermaid
flowchart LR
    A[PCAP / NetFlow / CSV] --> B[Ingestion & Validation]
    B --> C[Temporal Windowing]
    C --> D[Network State Sₜ]
    D --> E[Topology + New-Edge Detection]
    D --> F[Temporal Sequence L → K]
    E --> G[Latent State Encoder]
    F --> G
    G --> H[Temporal Dynamics Model]
    H --> I[K-Step Rollout]
    I --> J[Future Network States]
    J --> K[Attack Behaviour Forecast]
    J --> L[Warning Lead Time]
    K --> M[Explainability]
    K --> N[MITRE ATT&CK]
    K --> O[What-If Simulation]
    M --> P[Defender Interface]
    N --> P
    O --> P
    L --> P
```

------------------------------------------------------------------------

## 🧠 What Makes It Different? {#brain-what-makes-it-different}

We do **not** claim novelty merely because we use AI, Transformers,
graphs, explainability, or ATT&CK.

The project focuses on the combination of:

-   Explicit temporal network-state modelling
-   Learned network-state transition dynamics
-   K-step future attack trajectory forecasting
-   Quantifiable warning lead time
-   Forecast uncertainty and calibration
-   Evidence-based explanations
-   ATT&CK interpretation
-   Intervention-conditioned trajectory simulation
-   Leakage-aware evaluation
-   Unseen-scenario / cross-dataset generalisation
-   Offline / air-gapped operation

### World Model ≠ Transformer {#world-model--transformer}

**Transformer** = modelling architecture.

**World Model** = the learned dynamics of how network states evolve.

Conceptually:

``` text
Sₜ₋L ... Sₜ
    ↓
Latent Dynamics
    ↓
Ŝₜ₊₁ ... Ŝₜ₊ₖ
    ↓
Future Attack Behaviour
```

------------------------------------------------------------------------

## 🌐 Network State {#globe_with_meridians-network-state}

A network state is **not one packet** or one CSV row.

It is an aggregated representation of network behaviour over a temporal
window.

Example:

``` text
Sₜ = {
  traffic volume,
  active flows,
  source/destination behaviour,
  protocol distribution,
  TCP behaviour,
  packet timing,
  packet-size behaviour,
  destination-port activity,
  host communication relationships,
  topology statistics,
  ...
}
```

### Flow-level signals

-   Source / destination IP
-   Source / destination port
-   Protocol
-   TCP flags
-   Packets and bytes
-   Flow duration
-   Inter-arrival-time statistics
-   Bidirectional ratios

### Packet-level signals

-   TTL and TTL variation
-   TCP window size
-   IP fragmentation
-   Payload-size distribution
-   Port-scan patterns
-   Retransmissions
-   Packet timing
-   Packet sequencing

### Topology signals

-   Degree
-   Fan-in / fan-out
-   New edges
-   Destination diversity
-   East-west traffic
-   Communication-pattern changes

------------------------------------------------------------------------

## ⏳ Temporal Forecasting {#hourglass_flowing_sand-temporal-forecasting}

Instead of treating events independently:

``` text
Sₜ₋₃ → Sₜ₋₂ → Sₜ₋₁ → Sₜ
```

the model learns how the network state evolves.

Then it performs a multi-step rollout:

``` text
Sₜ
 ↓
Ŝₜ₊₁
 ↓
Ŝₜ₊₂
 ↓
Ŝₜ₊₃
 ↓
...
Ŝₜ₊ₖ
```

The objective is **not** to generate every future packet.

The objective is to forecast future latent/network states and
security-relevant behaviour.

------------------------------------------------------------------------

## 🔮 Attack Trajectory Forecast {#crystal_ball-attack-trajectory-forecast}

The primary product view is the **attack trajectory forecast**, not a
generic alert dashboard.

``` text
OBSERVED
──────────────●
              │
              │ current state
              ▼
          ┄┄┄┄┄┄┄┄┄
            FORECAST
              ├── Future behaviour A
              ├── Future behaviour B
              └── Future behaviour C
```

The forecast can expose:

-   Current observed behaviour
-   Future predicted behaviour
-   Multiple future horizons
-   Warning window
-   Supporting evidence
-   Cybersecurity interpretation
-   Optional intervention-conditioned projection

------------------------------------------------------------------------

## ⏱️ Warning Lead Time {#stopwatch-warning-lead-time}

Forecasting becomes operationally useful when it provides **time to
act**.

``` text
Current observed state
        │
        │<──── WARNING WINDOW ────>
        │
        ▼
Predicted attack stage
        │
        ▼
Observed future behaviour
```

Relevant operational metrics include:

-   Mean warning time
-   Median warning time
-   Warning-time distribution
-   Precision at selected horizons
-   False alarms / hour
-   Missed attacks

No performance number is considered valid unless it is actually
measured.

------------------------------------------------------------------------

## 🔍 Explainability {#mag-explainability}

A forecast should not be presented as an unexplained AI decision.

``` text
Forecast
   │
   ├── Temporal evidence
   ├── Flow-level evidence
   ├── Packet-level evidence
   └── Topology evidence
```

The architecture supports:

-   Integrated Gradients
-   Temporal attribution / occlusion
-   Topology evidence
-   Feature attribution
-   Forecast-to-evidence visualisation

Goal:

> **"Here is what we forecast --- and here is the observable evidence
> that contributed to that forecast."**

------------------------------------------------------------------------

## 🧩 MITRE ATT&CK Interpretation {#jigsaw-mitre-attck-interpretation}

Forecasted behaviour can be mapped to relevant **MITRE ATT&CK** tactics
and techniques.

``` text
Network Evidence
      ↓
Observed / Forecast Behaviour
      ↓
ATT&CK Interpretation
      ↓
Tactic / Technique
      ↓
Defender Context
```

ATT&CK is an interpretation framework, not a claim that every real
attack follows one fixed linear sequence.

Observed behaviour and model-inferred future behaviour remain explicitly
distinguishable.

------------------------------------------------------------------------

## 🧪 What-If Intervention Simulation {#test_tube-what-if-intervention-simulation}

The system supports a model-based intervention path:

``` text
                    Current State
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       No intervention       Isolate Host A
              │                     │
              ▼                     ▼
        Trajectory A           Trajectory B
```

The baseline and intervention-conditioned histories are passed through
the same World Model to compare projected trajectories.

> This is **decision-support simulation**, not guaranteed causal
> inference.

------------------------------------------------------------------------

## 📊 Evaluation {#bar_chart-evaluation}

We do not hide behind a single accuracy number.

### Detection / classification {#detection--classification}

-   Precision
-   Recall
-   F1
-   ROC-AUC
-   PR-AUC
-   False Positive Rate

### Forecasting

-   Forecast precision
-   Forecast recall
-   Precision at different horizons
-   Recall at different horizons
-   Calibration
-   Brier score

### Operational

-   Warning lead time
-   Median warning time
-   False alarms / hour
-   Missed attacks
-   Time-to-risk

### Generalisation

-   Unseen attack scenarios
-   Unseen attack families
-   Cross-dataset performance

------------------------------------------------------------------------

## 🚨 Leakage-Aware Evaluation {#rotating_light-leakage-aware-evaluation}

Naive random splitting is dangerous for temporal cybersecurity data.

### Bad

``` text
TRAIN:
Attack X @ 10:01
Attack X @ 10:02

TEST:
Attack X @ 10:03
```

This can make the model appear stronger than it really is.

### Preferred direction

``` text
TRAIN
Scenarios A / B / C / D

VALIDATION
Scenario E

TEST
Scenario F
```

Potential extensions:

``` text
Attack-family holdout
        +
Unseen scenario testing
        +
Cross-dataset validation
```

The goal is to test whether the model learned temporal dynamics rather
than memorised attack signatures.

------------------------------------------------------------------------

## 📚 Dataset Strategy {#books-dataset-strategy}

### Primary candidate

**CSE-CIC-IDS2018**

### Additional datasets under consideration

-   CIC-IDS2017
-   CTU-13
-   UNSW-NB15
-   CICIoT2023
-   LANL
-   DARPA intrusion datasets

We do **not** blindly combine datasets.

Each dataset should be assessed for:

-   timestamps
-   PCAP availability
-   flow availability
-   labels
-   scenario structure
-   temporal information
-   attack progression
-   feature compatibility
-   access/licensing
-   forecasting suitability

Generalisation direction:

``` text
Primary training
      ↓
Temporal / scenario validation
      ↓
Unseen scenario evaluation
      ↓
Cross-dataset validation
```

------------------------------------------------------------------------

## 🛡️ Offline / Air-Gapped Design {#shield-offline--air-gapped-design}

Sensitive telemetry should not require cloud inference.

``` text
Network Telemetry
      ↓
Local Processing
      ↓
Local World Model
      ↓
Local ATT&CK Knowledge Base
      ↓
Local Explanation
      ↓
Defender Interface
```

Core inference is designed around local execution with no mandatory
cloud dependency.

------------------------------------------------------------------------

## 🏗️ Technology Stack {#building_construction-technology-stack}

  Layer              Technology
  ------------------ ---------------------------------------------
  Frontend           Next.js, Tailwind CSS
  Backend            Python, FastAPI, Pydantic
  ML                 PyTorch
  Temporal Model     Latent Dynamics Transformer
  Data               Polars / Pandas / NumPy
  Local Analytics    DuckDB / Parquet ecosystem
  Graph / Topology   NetworkX / PyG where required
  Explainability     Integrated Gradients + temporal attribution
  Cyber Knowledge    Local MITRE ATT&CK knowledge base
  Persistence        Local artifacts / model checkpoints
  Deployment         Docker-oriented offline architecture

Every technology should have a clear purpose.

------------------------------------------------------------------------

## 🧩 Repository Architecture {#jigsaw-repository-architecture}

``` text
.
├── frontend/
│   ├── components/
│   ├── lib/
│   └── ...
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── world_model.py
│   │   │   ├── baseline.py
│   │   │   ├── trainer.py
│   │   │   ├── inference.py
│   │   │   └── attribution.py
│   │   ├── services/
│   │   │   ├── ingestion.py
│   │   │   ├── state_builder.py
│   │   │   ├── forecasting.py
│   │   │   ├── explanation.py
│   │   │   ├── attack_mapping.py
│   │   │   └── what_if_simulator.py
│   │   ├── pipeline/
│   │   │   ├── ingestion/
│   │   │   ├── validation/
│   │   │   ├── windowing/
│   │   │   ├── state/
│   │   │   ├── sequences/
│   │   │   └── preprocessing/
│   │   └── api/v1/
│   └── ...
├── data/
│   ├── raw/
│   ├── demo/
│   ├── processed/
│   └── attack/
│       └── mitre_attack_kb.json
├── models/
│   └── world_model/
│       ├── best.pt
│       ├── config.json
│       ├── scaler.json
│       └── metrics.json
├── docs/
├── tests/
├── docker/
└── README.md
```

------------------------------------------------------------------------

## 🔌 API Surface {#electric_plug-api-surface}

The architecture is organized around local APIs such as:

``` text
GET  /health
GET  /scenarios
GET  /network

POST /forecast
POST /explanation
POST /attack
POST /forecast/what-if
```

The API layer keeps ingestion, forecasting, explanation, ATT&CK
interpretation and intervention simulation modular.

------------------------------------------------------------------------

## 🧪 Baseline Strategy {#test_tube-baseline-strategy}

The World Model should be compared against progressively stronger
baselines:

``` text
Logistic Regression
       ↓
Random Forest / XGBoost
       ↓
MLP
       ↓
LSTM / GRU
       ↓
Temporal World Model
```

The research question is not:

> "Can we make a neural network?"

It is:

> **"Does explicit temporal state modelling improve future attack
> trajectory forecasting?"**

------------------------------------------------------------------------

## 🗺️ Roadmap {#world_map-roadmap}

### Foundation & Data Pipeline {#foundation--data-pipeline}

-   [x] Offline-first architecture
-   [x] Data contracts
-   [x] Dataset adapters
-   [x] Validation
-   [x] Temporal windowing
-   [x] Network-state construction
-   [x] Sparse topology
-   [x] New-edge detection
-   [x] Sequence construction
-   [x] Training-only scaling
-   [x] Scenario-boundary protection

### World Model

-   [x] Latent state representation
-   [x] Temporal dynamics model
-   [x] Transformer-based temporal modelling
-   [x] K-step rollout
-   [x] Forecast heads
-   [x] Baseline support
-   [x] Leakage-aware trainer
-   [x] Checkpoint persistence
-   [x] Warning lead-time calculation

### Explainability & Cyber Interpretation {#explainability--cyber-interpretation}

-   [x] Integrated Gradients
-   [x] Temporal attribution
-   [x] Topology evidence
-   [x] Local ATT&CK knowledge base
-   [x] Forecast interpretation
-   [ ] Stronger uncertainty estimation
-   [ ] Multi-horizon calibration
-   [ ] Confidence-aware prioritisation

### Intervention Simulation

-   [x] Baseline vs intervention-conditioned rollout
-   [x] Host-isolation simulation path
-   [ ] Multiple intervention types
-   [ ] Comparative trajectory analytics
-   [ ] Intervention uncertainty reporting

### Research-Grade Evaluation

-   [ ] Full baseline comparison
-   [ ] Temporal evaluation
-   [ ] Scenario-level holdout
-   [ ] Attack-family holdout
-   [ ] Unseen attack evaluation
-   [ ] Cross-dataset validation
-   [ ] Warning-time analysis
-   [ ] Calibration analysis
-   [ ] False-alarms/hour analysis

### Advanced Research

-   [ ] Probabilistic trajectory forecasting
-   [ ] Multi-horizon forecasting
-   [ ] Temporal graph dynamics
-   [ ] Concept-drift detection
-   [ ] Domain adaptation
-   [ ] Cross-environment transfer
-   [ ] Robustness against adversarial telemetry
-   [ ] Continual-learning research
-   [ ] Streaming inference

### Deployment Hardening

-   [ ] Air-gapped installation bundle
-   [ ] Signed model artifacts
-   [ ] Audit logging
-   [ ] Role-based access control
-   [ ] Secure artifact management
-   [ ] Model versioning / rollback
-   [ ] Resource-aware inference

------------------------------------------------------------------------

## 👥 Intended Users {#busts_in_silhouette-intended-users}

### SOC Analysts

Use forecasts, warning horizons and evidence to prioritise
investigation.

### Threat Hunters

Investigate emerging suspicious trajectories before they become larger
incidents.

### Cyber Defence Teams

Use projected attack progression to support proactive response planning.

### Critical-Infrastructure Security Teams

Use local predictive analytics in sensitive or connectivity-constrained
environments.

Tech πRates is intended to act as a **predictive decision-support
layer**, not as a replacement for a complete SIEM, EDR or SOAR platform.

------------------------------------------------------------------------

## 🔐 Security Principles {#closed_lock_with_key-security-principles}

-   Offline-first
-   Local inference
-   No mandatory cloud LLM
-   Local ATT&CK knowledge base
-   Clear observed-vs-forecast separation
-   Leakage-aware evaluation
-   Explainable predictions
-   Human-controlled response
-   No autonomous irreversible action by default
-   Reproducible model artifacts
-   Auditability as a deployment goal

------------------------------------------------------------------------

## ⚠️ Threats to Validity {#warning-threats-to-validity}

A serious forecasting system must acknowledge:

-   **Dataset bias** --- public datasets may not represent every
    production environment.
-   **Label quality** --- attack-stage labels may be incomplete or
    imperfect.
-   **Temporal leakage** --- naive splits can inflate performance.
-   **Distribution shift** --- network behaviour changes across
    environments.
-   **Concept drift** --- future behaviour may differ from historical
    training data.
-   **Forecast uncertainty** --- longer horizons are inherently harder.
-   **False positives** --- legitimate behavioural changes can resemble
    attacks.
-   **ATT&CK ambiguity** --- network evidence may not uniquely identify
    a technique.
-   **Counterfactual limitations** --- simulated interventions are model
    projections, not guaranteed causal outcomes.

------------------------------------------------------------------------

## 🚀 Getting Started {#rocket-getting-started}

> Exact commands should follow the current repository configuration.

### Prerequisites

-   Python 3.11+
-   Node.js 18+
-   npm / pnpm
-   Git
-   Docker (recommended)

### Clone

``` bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_NAME>
```

### Backend

``` bash
cd backend
python -m venv .venv

# Linux/macOS
source .venv/bin/activate

# Windows
# .venv\Scriptsctivate

pip install -r requirements.txt
```

Run the API using the current repository entry point.

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

### Docker

``` bash
docker compose up --build
```

------------------------------------------------------------------------

## 🧪 Reproducibility {#test_tube-reproducibility}

Experiments should record:

-   Dataset/version
-   Scenario split
-   Temporal split
-   Feature configuration
-   Window size
-   History length `L`
-   Forecast horizon `K`
-   Model configuration
-   Scaling configuration
-   Random seed
-   Checkpoint
-   Metrics
-   Evaluation protocol

A result without a reproducible evaluation protocol is not treated as
strong evidence.

------------------------------------------------------------------------

## 🔬 Research Questions {#microscope-research-questions}

1.  Can network-state dynamics predict attack progression?
2.  How much historical context is required?
3.  How far into the future does useful forecasting remain reliable?
4.  Does topology improve forecasting beyond flow statistics?
5.  Can the model generalise to unseen attack scenarios?
6.  How does forecast quality degrade with horizon?
7.  Can warning lead time become operationally meaningful?
8.  Are forecast probabilities calibrated?
9.  Can explanations identify evidence analysts can independently
    verify?
10. Does intervention-conditioned simulation provide useful decision
    support?

------------------------------------------------------------------------

## 📌 Project Status {#pushpin-project-status}

Tech πRates is an evolving research and engineering project.

The current architecture contains implemented components across the
foundation, data pipeline, temporal World Model, explainability, ATT&CK
mapping and intervention simulation layers. The roadmap extends this
toward more rigorous uncertainty estimation, generalisation, evaluation,
streaming and deployment hardening.

**Repository state is the source of truth for what is currently
runnable.**

We intentionally avoid fabricated metrics, users, partnerships,
benchmark results or unsupported claims.

------------------------------------------------------------------------

## 🧠 One-Sentence Explanation {#brain-one-sentence-explanation}

> **Tech πRates is an offline Temporal Network World Model that learns
> how network states evolve over time and forecasts future attack
> trajectories early enough to provide defenders with a measurable
> warning window and evidence for decision-making.**

------------------------------------------------------------------------

## 🔥 The Three Ideas {#fire-the-three-ideas}

### 01 --- Attacks are trajectories {#01--attacks-are-trajectories}

**Not isolated events.**

### 02 --- The World Model learns state evolution {#02--the-world-model-learns-state-evolution}

**Not just current-state classification.**

### 03 --- Forecasting creates time {#03--forecasting-creates-time}

**The goal is actionable warning, not prediction for its own sake.**

------------------------------------------------------------------------

## 📖 Core Research Areas {#open_book-core-research-areas}

-   Network traffic analysis
-   Intrusion detection
-   Temporal machine learning
-   Sequence modelling
-   Temporal Transformers
-   Network graphs
-   Predictive state representations
-   Cyber attack progression
-   Multi-horizon forecasting
-   Explainable AI
-   Uncertainty and calibration
-   MITRE ATT&CK
-   Cyber defence decision support

------------------------------------------------------------------------

## ⚠️ Disclaimer {#warning-disclaimer}

Tech πRates is a research and engineering prototype for predictive
cyber-defence decision support.

Forecasts are probabilistic model outputs and are not guaranteed future
events.

Intervention simulations are model projections and should not
automatically be interpreted as causal guarantees.

Security decisions should remain under appropriate human and
organizational control.

------------------------------------------------------------------------

## 👨‍💻 Team {#man_technologist-team}

# **Tech πRates**

### Building toward:

> **Predictive Cyber Defence through Temporal Network Intelligence.**

**Smart India Hackathon 2026 · Problem Statement 26153**

```{=html}
<p align="center">
```
### 🛡️ Observe. Model. Forecast. Explain. Decide. {#shield-observe-model-forecast-explain-decide}

**From detecting attacks → to forecasting where they are heading.**

```{=html}
</p>
```
