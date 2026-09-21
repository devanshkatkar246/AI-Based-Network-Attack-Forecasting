export const SCENARIOS = [
  {
    id: "Enterprise-Lateral-Movement-01",
    title: "Lateral Movement & Domain Controller Escalation",
    category: "Active Cyber Attack Vector",
    riskLevel: "ELEVATED",
    riskScore: 78,
    warningWindowSec: 75,
    timestamp: "2026-09-21 19:54:12 UTC",
    currentState: "Privilege Access",
    telemetry: {
      activeHosts: 142,
      activeFlows: "8.4k",
      activeConnections: 326,
      newEdges: 17,
      trafficMbps: "420 Mbps",
      networkState: "ELEVATED",
      anomalyIndex: "+34% vs baseline"
    },
    networkTimeline: [
      { time: "-60s", label: "Normal baseline traffic across subnets" },
      { time: "-30s", label: "New SMB connection from Workstation-302" },
      { time: "NOW", label: "East-West lateral expansion anomaly detected" }
    ],
    nextLikelyBehaviour: {
      behaviour: "Lateral Movement",
      timeHorizon: "+60 sec",
      probability: 81,
      targetAsset: "FIN-SRV-01 (10.0.4.12)",
      impact: "Domain Admin Credential Theft & Database Access"
    },
    horizonData: [
      { horizon: "+30s", probability: 64, label: "Medium Likelihood" },
      { horizon: "+60s", probability: 81, label: "Peak Forecast" },
      { horizon: "+90s", probability: 58, label: "Secondary Vector" },
      { horizon: "+120s", probability: 42, label: "Extended Horizon" }
    ],
    trajectory: [
      {
        id: "step-1",
        stage: "Reconnaissance",
        techniqueId: "T1046",
        techniqueName: "Network Service Discovery",
        status: "OBSERVED",
        timestamp: "19:48:02",
        sourceHost: "10.0.2.45 (Workstation-302)",
        targetHost: "10.0.2.0/24 Subnet",
        details: "Port scan activity across 10.0.2.0/24 targeting SMB/RPC ports.",
        confidence: 0.98,
        isCurrent: false
      },
      {
        id: "step-2",
        stage: "Discovery",
        techniqueId: "T1087.002",
        techniqueName: "Domain Account Discovery",
        status: "OBSERVED",
        timestamp: "19:50:45",
        sourceHost: "10.0.2.45 (Workstation-302)",
        targetHost: "10.0.1.10 (DC-PRIMARY)",
        details: "LDAP enumeration queries for Domain Admin privileges.",
        confidence: 0.94,
        isCurrent: false
      },
      {
        id: "step-3",
        stage: "Privilege Access",
        techniqueId: "T1003.001",
        techniqueName: "LSASS Memory Dump",
        status: "OBSERVED",
        timestamp: "19:53:30",
        sourceHost: "10.0.2.45 (Workstation-302)",
        targetHost: "Local Host Process",
        details: "Unusual handle open to lsass.exe process by elevated user token.",
        confidence: 0.96,
        isCurrent: true
      },
      {
        id: "step-4",
        stage: "Lateral Movement",
        techniqueId: "T1021.002",
        techniqueName: "SMB/PsExec Execution",
        status: "FORECAST",
        estimatedTime: "+30s",
        sourceHost: "10.0.2.45 (Workstation-302)",
        targetHost: "10.0.4.12 (FIN-SRV-01)",
        details: "Predicted SMB authentication attempt using dumped NTLM hash.",
        confidence: 0.88,
        probability: 64,
        isCurrent: false
      },
      {
        id: "step-5",
        stage: "Command & Control",
        techniqueId: "T1071.001",
        techniqueName: "Encrypted Web Protocol",
        status: "FORECAST",
        estimatedTime: "+60s",
        sourceHost: "10.0.4.12 (FIN-SRV-01)",
        targetHost: "198.51.100.42 (External C2)",
        details: "Projected beacon establishing encrypted outbound tunnel.",
        confidence: 0.82,
        probability: 81,
        isCurrent: false
      },
      {
        id: "step-6",
        stage: "Exfiltration",
        techniqueId: "T1041",
        techniqueName: "Exfiltration Over C2 Channel",
        status: "FORECAST",
        estimatedTime: "+90s",
        sourceHost: "10.0.4.12 (FIN-SRV-01)",
        targetHost: "External C2 Storage",
        details: "Potential automated data staging and outbound transfer.",
        confidence: 0.71,
        probability: 58,
        isCurrent: false
      }
    ],
    warningWindow: {
      durationSec: 75,
      horizonLabel: "60–90 SEC WINDOW",
      urgency: "HIGH",
      timeRemainingSec: 52,
      impact: "Domain Credential Breach & Financial Server Compromise",
      targetAsset: "FIN-SRV-01 (10.0.4.12)",
      recommendedAction: "Isolate Host 10.0.2.45 & Block Port 445 on Subnet 10.0.4.0/24"
    },
    likelihoodOverTime: [
      { time: "NOW", observed: 68, forecast: 68, upper: 72, lower: 64 },
      { time: "+30s", observed: null, forecast: 64, upper: 74, lower: 54 },
      { time: "+60s", observed: null, forecast: 81, upper: 89, lower: 73 },
      { time: "+90s", observed: null, forecast: 58, upper: 68, lower: 48 },
      { time: "+120s", observed: null, forecast: 42, upper: 55, lower: 30 }
    ],
    featureSignals: [
      { feature: "Destination Diversity", weight: 24 },
      { feature: "TCP SYN Sweep Rate", weight: 21 },
      { feature: "SMB Port 445 Flow Burst", weight: 18 },
      { feature: "Inter-Arrival Time (IAT) Variance", weight: 13 }
    ],
    temporalEvidence: [
      { time: "T-40s", label: "Port probing across 10.0.2.0/24" },
      { time: "T-20s", label: "Destination IP expansion to 10.0.1.10" },
      { time: "T-10s", label: "SMB/RPC authorization attempt burst" },
      { time: "NOW", label: "East-west traffic pattern anomaly detected" }
    ],
    topologyEvidence: {
      nodes: [
        { id: "h1", label: "WORKSTATION-302", ip: "10.0.2.45", type: "compromised" },
        { id: "h2", label: "FIN-SRV-01", ip: "10.0.4.12", type: "target" }
      ],
      edgeLabel: "NEW PROJECTED EDGE"
    },
    attackInterpretation: [
      {
        observed: "Port scanning activity across 10.0.2.0/24",
        technique: "Network Service Discovery (T1046)",
        tactic: "Discovery"
      },
      {
        observed: "SMB / RPC authentication burst to DC-PRIMARY",
        technique: "Remote Services (T1021.002)",
        tactic: "Lateral Movement"
      },
      {
        observed: "Periodic HTTPS beaconing to unapproved external IP",
        technique: "Application Layer Protocol (T1071.001)",
        tactic: "Command & Control"
      }
    ],
    topology: {
      zones: [
        { id: "z-internal", label: "INTERNAL WORKSTATIONS", color: "bg-slate-100/50 border-slate-200" },
        { id: "z-servers", label: "PRODUCTION SERVERS", color: "bg-blue-50/40 border-blue-200/50" },
        { id: "z-db", label: "DATABASE CLUSTER", color: "bg-amber-50/40 border-amber-200/50" },
        { id: "z-external", label: "EXTERNAL WAN", color: "bg-red-50/30 border-red-200/40" }
      ],
      nodes: [
        { id: "n1", label: "GW-Router-01", type: "gateway", ip: "10.0.0.1", status: "clean", zone: "INTERNAL", x: 80, y: 150, connections: 12, newEdges: 1 },
        { id: "n2", label: "DC-PRIMARY", type: "dc", ip: "10.0.1.10", status: "targeted", zone: "SERVERS", x: 240, y: 80, connections: 24, newEdges: 3 },
        { id: "n3", label: "Workstation-302", type: "host", ip: "10.0.2.45", status: "compromised", zone: "INTERNAL", x: 240, y: 220, connections: 8, newEdges: 5 },
        { id: "n4", label: "FIN-SRV-01", type: "server", ip: "10.0.4.12", status: "forecasted-target", zone: "SERVERS", x: 440, y: 150, connections: 6, newEdges: 3 },
        { id: "n5", label: "DB-CLUSTER-01", type: "db", ip: "10.0.4.50", status: "at-risk", zone: "DATABASE", x: 600, y: 150, connections: 4, newEdges: 1 },
        { id: "n6", label: "External C2", type: "external", ip: "198.51.100.42", status: "external", zone: "EXTERNAL", x: 740, y: 80, connections: 2, newEdges: 2 },
        { id: "n7", label: "App-Server-02", type: "server", ip: "10.0.4.18", status: "clean", zone: "SERVERS", x: 440, y: 240, connections: 5, newEdges: 0 },
        { id: "n8", label: "Workstation-104", type: "host", ip: "10.0.2.14", status: "clean", zone: "INTERNAL", x: 140, y: 260, connections: 3, newEdges: 0 }
      ],
      edges: [
        { source: "n1", target: "n2", status: "OBSERVED", type: "normal", label: "HTTPS/LDAP" },
        { source: "n1", target: "n3", status: "OBSERVED", type: "normal", label: "DHCP/DNS" },
        { source: "n3", target: "n2", status: "OBSERVED", type: "suspicious", label: "Suspicious RPC Scan" },
        { source: "n3", target: "n4", status: "FORECAST", type: "forecast", label: "Projected SMB PsExec" },
        { source: "n4", target: "n5", status: "FORECAST", type: "forecast", label: "Projected SQL Query" },
        { source: "n4", target: "n6", status: "FORECAST", type: "forecast", label: "Projected C2 Tunnel" },
        { source: "n1", target: "n8", status: "OBSERVED", type: "normal", label: "Normal Flow" },
        { source: "n4", target: "n7", status: "OBSERVED", type: "new", label: "New Internal Flow" }
      ]
    },
    whatIfSimulationData: {
      targetHost: "FIN-SRV-01",
      targetIp: "10.0.4.12",
      compromisedHost: "Workstation-302 (10.0.2.45)",
      baselineTrajectory: [
        { stage: "Reconnaissance", status: "OBSERVED", time: "T-90s" },
        { stage: "Discovery", status: "OBSERVED", time: "T-60s" },
        { stage: "Privilege Access", status: "OBSERVED", time: "NOW", isCurrent: true },
        { stage: "Lateral Movement", status: "FORECAST", time: "+30s", probability: 64 },
        { stage: "Command & Control", status: "FORECAST", time: "+60s", probability: 81 },
        { stage: "Exfiltration", status: "FORECAST", time: "+90s", probability: 58 }
      ],
      interventionTrajectory: [
        { stage: "Reconnaissance", status: "OBSERVED", time: "T-90s" },
        { stage: "Discovery", status: "OBSERVED", time: "T-60s" },
        { stage: "Privilege Access", status: "OBSERVED", time: "NOW", isCurrent: true },
        { stage: "[HOST ISOLATED]", status: "INTERVENTION", time: "INTERVENTION", isInterventionPoint: true },
        { stage: "Propagation Truncation", status: "CONTAINED", time: "+30s", probability: 14 },
        { stage: "Trajectory Containment", status: "CONTAINED", time: "+60s", probability: 5 }
      ],
      riskComparison: [
        { stage: "Lateral Movement", baselineProb: 81, interventionProb: 21 },
        { stage: "Command & Control", baselineProb: 58, interventionProb: 9 },
        { stage: "Exfiltration", baselineProb: 42, interventionProb: 3 }
      ]
    },
    evidence: [
      {
        id: "ev-1",
        time: "19:53:30",
        type: "Process Telemetry",
        source: "EDR Sentinel Agent #104",
        indicator: "lsass.exe memory access requested by rundll32.exe",
        severity: "HIGH",
        mitreId: "T1003.001"
      }
    ],
    whatIfSimulations: [
      {
        id: "interv-1",
        action: "Isolate Host FIN-SRV-01 (10.0.4.12)",
        description: "Apply modelled intervention to sever communication edges",
        riskReduction: "88% Trajectory Divergence",
        projectedOutcome: "Modelled trajectory truncates propagation to DB-CLUSTER-01 and External C2.",
        recommended: true
      }
    ]
  },
  {
    id: "Cloud-Exfiltration-Vector-02",
    title: "AWS S3 Staging & Cross-Account Exfiltration",
    category: "Cloud Infrastructure Threat",
    riskLevel: "CRITICAL",
    riskScore: 91,
    warningWindowSec: 60,
    timestamp: "2026-09-21 19:50:00 UTC",
    currentState: "Cloud Discovery",
    telemetry: {
      activeHosts: 86,
      activeFlows: "14.2k",
      activeConnections: 184,
      newEdges: 9,
      trafficMbps: "1.2 Gbps",
      networkState: "HIGH RISK",
      anomalyIndex: "+62% vs baseline"
    },
    networkTimeline: [
      { time: "-60s", label: "STS temporary auth token issued" },
      { time: "-30s", label: "s3:ListAllMyBuckets API call from unapproved IP" },
      { time: "NOW", label: "Batch GetObject operation initiated" }
    ],
    nextLikelyBehaviour: {
      behaviour: "Exfiltration Staging",
      timeHorizon: "+30 sec",
      probability: 92,
      targetAsset: "s3://prod-customer-pii-vault",
      impact: "Unencrypted PII Backup Batch Transfer"
    },
    horizonData: [
      { horizon: "+30s", probability: 92, label: "Immediate Risk" },
      { horizon: "+60s", probability: 86, label: "Cross-Account Sync" },
      { horizon: "+90s", probability: 74, label: "KMS Key Erasure" },
      { horizon: "+120s", probability: 55, label: "Extended Horizon" }
    ],
    trajectory: [
      {
        id: "c-step-1",
        stage: "Initial Access",
        techniqueId: "T1078.004",
        techniqueName: "Valid Cloud Accounts",
        status: "OBSERVED",
        timestamp: "19:42:10",
        sourceHost: "IAM User: dev-role",
        targetHost: "CloudTrail API",
        details: "Stolen STS temporary credentials used from unapproved IP.",
        confidence: 0.99,
        isCurrent: false
      },
      {
        id: "c-step-2",
        stage: "Cloud Discovery",
        techniqueId: "T1526",
        techniqueName: "Cloud Service Discovery",
        status: "OBSERVED",
        timestamp: "19:45:18",
        sourceHost: "IAM User: dev-role",
        targetHost: "s3:ListAllMyBuckets",
        details: "Enumeration of all S3 storage buckets and KMS keys.",
        confidence: 0.96,
        isCurrent: true
      },
      {
        id: "c-step-3",
        stage: "Exfiltration Staging",
        techniqueId: "T1567.002",
        techniqueName: "Exfiltration to Cloud Storage",
        status: "FORECAST",
        estimatedTime: "+30s",
        sourceHost: "s3://prod-customer-pii",
        targetHost: "s3://temp-staging",
        details: "Projected batch copy operation of customer DB backups.",
        confidence: 0.92,
        probability: 92,
        isCurrent: false
      },
      {
        id: "c-step-4",
        stage: "Cross-Account Transfer",
        techniqueId: "T1537",
        techniqueName: "Transfer Data to Cloud Account",
        status: "FORECAST",
        estimatedTime: "+60s",
        sourceHost: "s3://temp-staging",
        targetHost: "AWS Acct #90214410",
        details: "Projected bucket policy modification allowing external read.",
        confidence: 0.86,
        probability: 86,
        isCurrent: false
      }
    ],
    warningWindow: {
      durationSec: 60,
      horizonLabel: "45–60 SEC WINDOW",
      urgency: "CRITICAL",
      timeRemainingSec: 38,
      impact: "Unencrypted PII Backup Leakage (Est. 4.2 GB)",
      targetAsset: "s3://prod-customer-pii-vault",
      recommendedAction: "Attach Deny-All IAM Inline Policy to dev-automation-role"
    },
    likelihoodOverTime: [
      { time: "NOW", observed: 85, forecast: 85, upper: 88, lower: 82 },
      { time: "+30s", observed: null, forecast: 92, upper: 96, lower: 88 },
      { time: "+60s", observed: null, forecast: 86, upper: 92, lower: 80 },
      { time: "+90s", observed: null, forecast: 74, upper: 82, lower: 66 },
      { time: "+120s", observed: null, forecast: 55, upper: 68, lower: 42 }
    ],
    featureSignals: [
      { feature: "API Invocation Frequency", weight: 32 },
      { feature: "IAM Session Entropy", weight: 28 },
      { feature: "S3 ListObject Rate", weight: 22 },
      { feature: "Geographic IP Anomaly", weight: 18 }
    ],
    temporalEvidence: [
      { time: "T-40s", label: "STS temporary credential request" },
      { time: "T-20s", label: "s3:ListAllMyBuckets API burst" },
      { time: "T-10s", label: "KMS Key permissions check" },
      { time: "NOW", label: "Batch GetObject API anomaly" }
    ],
    topologyEvidence: {
      nodes: [
        { id: "ch1", label: "STS AUTH ROLE", ip: "dev-automation-role", type: "compromised" },
        { id: "ch2", label: "s3://prod-customer-pii", ip: "S3 Bucket", type: "target" }
      ],
      edgeLabel: "PROJECTED BATCH COPY"
    },
    attackInterpretation: [
      {
        observed: "STS token usage from unrecognized IP",
        technique: "Valid Cloud Accounts (T1078.004)",
        tactic: "Initial Access"
      },
      {
        observed: "Bulk enumeration of S3 bucket permissions",
        technique: "Cloud Service Discovery (T1526)",
        tactic: "Discovery"
      }
    ],
    topology: {
      zones: [
        { id: "z-external", label: "EXTERNAL REPO", color: "bg-red-50/30 border-red-200/40" },
        { id: "z-iam", label: "IAM IDENTITY SERVICE", color: "bg-blue-50/40 border-blue-200/50" },
        { id: "z-storage", label: "S3 DATA VAULT", color: "bg-amber-50/40 border-amber-200/50" }
      ],
      nodes: [
        { id: "c1", label: "External IP 203.0.113.88", type: "external", ip: "203.0.113.88", status: "compromised", zone: "EXTERNAL", x: 100, y: 150, connections: 4, newEdges: 2 },
        { id: "c2", label: "STS Auth Token", type: "gateway", ip: "IAM STS API", status: "compromised", zone: "IAM", x: 260, y: 150, connections: 10, newEdges: 3 },
        { id: "c3", label: "PII Vault Bucket", type: "db", ip: "s3://prod-customer-pii", status: "targeted", zone: "STORAGE", x: 460, y: 100, connections: 8, newEdges: 4 },
        { id: "c4", label: "Staging Bucket", type: "server", ip: "s3://temp-staging", status: "forecasted-target", zone: "STORAGE", x: 460, y: 220, connections: 3, newEdges: 2 },
        { id: "c5", label: "Attacker AWS Acct", type: "external", ip: "Acct #90214410", status: "at-risk", zone: "EXTERNAL", x: 660, y: 160, connections: 2, newEdges: 1 }
      ],
      edges: [
        { source: "c1", target: "c2", status: "OBSERVED", type: "suspicious", label: "STS Auth Call" },
        { source: "c2", target: "c3", status: "OBSERVED", type: "suspicious", label: "s3:ListObjects Burst" },
        { source: "c3", target: "c4", status: "FORECAST", type: "forecast", label: "Projected Batch Copy" },
        { source: "c4", target: "c5", status: "FORECAST", type: "forecast", label: "Projected Cross-Acct Sync" }
      ]
    },
    whatIfSimulationData: {
      targetHost: "s3://prod-customer-pii-vault",
      targetIp: "S3 Bucket Vault",
      compromisedHost: "STS Auth Role (dev-automation-role)",
      baselineTrajectory: [
        { stage: "Initial Access", status: "OBSERVED", time: "T-90s" },
        { stage: "Cloud Discovery", status: "OBSERVED", time: "NOW", isCurrent: true },
        { stage: "Exfiltration Staging", status: "FORECAST", time: "+30s", probability: 92 },
        { stage: "Cross-Account Transfer", status: "FORECAST", time: "+60s", probability: 86 }
      ],
      interventionTrajectory: [
        { stage: "Initial Access", status: "OBSERVED", time: "T-90s" },
        { stage: "Cloud Discovery", status: "OBSERVED", time: "NOW", isCurrent: true },
        { stage: "[ROLE POLICY REVOKED]", status: "INTERVENTION", time: "INTERVENTION", isInterventionPoint: true },
        { stage: "Batch Transfer Blocked", status: "CONTAINED", time: "+30s", probability: 4 },
        { stage: "Egress Neutralized", status: "CONTAINED", time: "+60s", probability: 1 }
      ],
      riskComparison: [
        { stage: "Exfiltration Staging", baselineProb: 92, interventionProb: 4 },
        { stage: "Cross-Account Transfer", baselineProb: 86, interventionProb: 1 }
      ]
    },
    evidence: [
      {
        id: "ev-c1",
        time: "19:45:18",
        type: "CloudTrail Log",
        source: "us-east-1 CloudTrail",
        indicator: "Unusual s3:GetObject API burst from new geographic IP",
        severity: "HIGH",
        mitreId: "T1526"
      }
    ],
    whatIfSimulations: [
      {
        id: "interv-c1",
        action: "Apply Deny-All IAM Policy to dev-automation-role",
        description: "Revoke active STS token session permissions",
        riskReduction: "96% Immediate Modelled Divergence",
        projectedOutcome: "Modelled trajectory halts batch S3 copy operation.",
        recommended: true
      }
    ]
  }
];

export const SYSTEM_STATUS = {
  mode: "TEMPORAL WORLD MODEL ENGINE",
  status: "OFFLINE",
  version: "v0.9.4-MVP",
  nodeCount: 142,
  predictiveHorizon: "90s",
  inferenceLatency: "12ms"
};
