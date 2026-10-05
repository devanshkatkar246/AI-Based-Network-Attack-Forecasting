/**
 * THE FORECASTER - API Client
 * Centralized client for interacting with the FastAPI backend.
 * Uses same-origin /api endpoints in browser mode and BACKEND_URL for server-side fetches.
 */

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "/api";
  }
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  return `${backendUrl}/api`;
}

/**
 * Health check endpoint
 */
export async function fetchHealth() {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/health`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
    return { status: "error", code: res.status, service: "the-forecaster-backend" };
  } catch (err) {
    console.error("[API] Health check failed:", err);
    return { status: "offline", service: "the-forecaster-backend", error: err.message };
  }
}

/**
 * List all available benchmark and uploaded scenarios
 */
export async function fetchScenarios() {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/scenarios`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] fetchScenarios failed:", err);
  }
  return [];
}

/**
 * Fetch detailed metadata and data quality report for a specific scenario
 */
export async function fetchScenarioDetails(scenarioId) {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/scenarios/${encodeURIComponent(scenarioId)}`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`[API] fetchScenarioDetails failed for ${scenarioId}:`, err);
  }
  return null;
}

/**
 * Load a specific scenario into the backend processing orchestrator
 */
export async function loadScenario(scenarioId) {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/scenarios/${encodeURIComponent(scenarioId)}/load`, {
      method: "POST"
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`[API] loadScenario failed for ${scenarioId}:`, err);
  }
  return { status: "error", scenario_id: scenarioId };
}

/**
 * Upload telemetry CSV file to FastAPI backend
 */
export async function uploadScenarioCSV(file, scenarioName) {
  const formData = new FormData();
  formData.append("file", file);
  if (scenarioName && scenarioName.trim()) {
    formData.append("scenario_name", scenarioName.trim());
  }

  const base = getBaseUrl();
  const uploadUrl = `${base}/scenarios/upload`;

  let res;
  try {
    res = await fetch(uploadUrl, {
      method: "POST",
      body: formData
    });
  } catch (netErr) {
    console.error(`[CSV Upload] Network request failed for ${uploadUrl}:`, netErr);
    throw new Error(`NETWORK ERROR: Cannot reach backend server at ${base}. Please ensure the FastAPI backend is running.`);
  }

  if (!res.ok) {
    let errData;
    try {
      errData = await res.json();
    } catch (e) {
      errData = { detail: res.statusText || "Server error occurred." };
    }

    if (res.status === 422) {
      const msg = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
      throw new Error(`VALIDATION ERROR: ${msg}`);
    } else if (res.status === 400) {
      throw new Error(`INVALID REQUEST: ${errData.detail || "Invalid CSV payload."}`);
    } else {
      throw new Error(`SERVER ERROR (${res.status}): ${errData.detail || errData.message || "Backend processing failed."}`);
    }
  }

  return await res.json();
}

/**
 * Fetch canonical scenario replay state for a given tick index
 */
export async function fetchScenarioReplay(scenarioId = "enterprise-lateral-movement-01", tickIndex = 0) {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/scenarios/${encodeURIComponent(scenarioId)}/replay?tick=${tickIndex}`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`[API] fetchScenarioReplay failed for ${scenarioId} tick ${tickIndex}:`, err);
  }
  return null;
}

/**
 * Fetch canonical forecast for a given scenario and replay tick
 */
export async function fetchForecast(scenarioId = "enterprise-lateral-movement-01", tickIndex = 0, horizonWindows = 3) {
  const base = getBaseUrl();
  try {
    const res = await fetch(
      `${base}/forecast?scenario_id=${encodeURIComponent(scenarioId)}&tick=${tickIndex}&horizon_windows=${horizonWindows}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] fetchForecast failed:", err);
  }
  return null;
}

/**
 * Fetch network state for a given scenario and tick
 */
export async function fetchNetworkState(scenarioId = "enterprise-lateral-movement-01", tickIndex = 0) {
  const base = getBaseUrl();
  try {
    const res = await fetch(
      `${base}/network-state?scenario_id=${encodeURIComponent(scenarioId)}&tick=${tickIndex}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] fetchNetworkState failed:", err);
  }
  return null;
}

/**
 * Fetch trajectory progression for a given scenario and tick
 */
export async function fetchTrajectory(scenarioId = "enterprise-lateral-movement-01", tickIndex = 0) {
  const base = getBaseUrl();
  try {
    const res = await fetch(
      `${base}/trajectory?scenario_id=${encodeURIComponent(scenarioId)}&tick=${tickIndex}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] fetchTrajectory failed:", err);
  }
  return null;
}

/**
 * Fetch network topology graph for a given scenario and tick
 */
export async function fetchTopology(scenarioId = "enterprise-lateral-movement-01", tickIndex = 0) {
  const base = getBaseUrl();
  try {
    const res = await fetch(
      `${base}/topology?scenario_id=${encodeURIComponent(scenarioId)}&tick=${tickIndex}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] fetchTopology failed:", err);
  }
  return null;
}

/**
 * Fetch evidence signals supporting current forecast
 */
export async function fetchEvidence(scenarioId = "enterprise-lateral-movement-01", tickIndex = 0) {
  const base = getBaseUrl();
  try {
    const res = await fetch(
      `${base}/evidence?scenario_id=${encodeURIComponent(scenarioId)}&tick=${tickIndex}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] fetchEvidence failed:", err);
  }
  return null;
}

/**
 * Simulate counterfactual defensive intervention
 */
export async function simulateWhatIf(scenarioId, intervention, host, tickIndex = 0) {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/what-if`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario_id: scenarioId,
        intervention,
        host,
        tick: tickIndex
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] simulateWhatIf failed:", err);
  }
  return null;
}

/**
 * Fetch or generate canonical threat report data
 */
export async function fetchReport(scenarioId = "enterprise-lateral-movement-01", tickIndex = 0) {
  const base = getBaseUrl();
  try {
    const res = await fetch(
      `${base}/report?scenario_id=${encodeURIComponent(scenarioId)}&tick=${tickIndex}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] fetchReport failed:", err);
  }
  return null;
}

export async function generateReport(payload) {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("[API] generateReport failed:", err);
  }
  return null;
}
