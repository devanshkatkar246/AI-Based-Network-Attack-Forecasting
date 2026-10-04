import { REPLAY_TICKS, SYSTEM_STATUS, EVALUATION_BENCHMARKS } from "@/data/mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback to local system status
  }
  return { status: "offline", service: "Static Mock Mode" };
}

export async function fetchScenarios() {
  try {
    const res = await fetch(`${API_BASE}/scenarios`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }
  return [
    {
      id: "enterprise-lateral-movement-01",
      name: "Enterprise Lateral Movement Demo",
      description: "Multi-stage attack across subnet 10.0.2.0/24 targeting DC & FIN-SRV.",
      status: "available",
      category: "READY DEMO"
    }
  ];
}

export async function loadScenario(scenarioId) {
  try {
    const res = await fetch(`${API_BASE}/scenarios/${scenarioId}/load`, {
      method: "POST"
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }
  return { status: "loaded", scenario_id: scenarioId };
}

export async function uploadScenarioCSV(file, scenarioName) {
  const formData = new FormData();
  formData.append("file", file);
  if (scenarioName) {
    formData.append("scenario_name", scenarioName);
  }

  const res = await fetch(`${API_BASE}/scenarios/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Upload failed." }));
    throw new Error(errData.detail || "CSV upload and validation failed.");
  }
  return await res.json();
}

export async function fetchScenarioReplay(scenarioId = "enterprise-lateral-movement-01", tickIndex = 0) {
  try {
    const res = await fetch(`${API_BASE}/scenarios/${scenarioId}/replay?tick=${tickIndex}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Fallback to static REPLAY_TICKS
  }
  const mockTick = REPLAY_TICKS[tickIndex] || REPLAY_TICKS[0];
  return {
    tickIndex,
    totalTicks: REPLAY_TICKS.length,
    current_state: mockTick,
    forecast: {
      status: "success",
      engine_id: "Static Mock Engine",
      warning_lead_time_seconds: mockTick.warningWindow?.leadTimeSeconds || null,
      trajectory: mockTick.trajectory || [],
      evidence: mockTick.evidence || []
    }
  };
}

export async function simulateWhatIf(scenarioId, intervention, host) {
  try {
    const res = await fetch(`${API_BASE}/what-if`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario_id: scenarioId, intervention, host })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }
  return null;
}
