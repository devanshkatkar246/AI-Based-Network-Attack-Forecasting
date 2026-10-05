/**
 * THE FORECASTER - Temporal Utilities & Trajectory Normalization Service
 * Single source of truth for temporal conversions and canonical trajectory ordering.
 */

/**
 * Format relative numeric seconds into standard cybersecurity timeline notation.
 * Negative (< 0): "T-90s", "T-30s", "T-10s"
 * Zero (=== 0): "NOW"
 * Positive (> 0): "+10s", "+20s", "+30s"
 * Never generates double negative strings like "T--240s".
 */
export function formatRelativeTime(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return "NOW";
  }
  const num = Math.round(Number(seconds));
  if (num < 0) {
    return `T-${Math.abs(num)}s`;
  }
  if (num === 0) {
    return "NOW";
  }
  return `+${num}s`;
}

/**
 * Parse any time representation into numeric relative seconds.
 */
export function parseRelativeSeconds(val, fallbackIndex = 0, currentFreezeIndex = 0) {
  if (val === null || val === undefined) {
    return (fallbackIndex - currentFreezeIndex) * 10;
  }
  if (typeof val === "number") {
    return val;
  }
  if (typeof val === "string") {
    const clean = val.trim();
    if (clean.toUpperCase() === "NOW" || clean === "0s" || clean === "T-0s" || clean === "T+0s") {
      return 0;
    }
    if (clean.startsWith("+")) {
      const n = parseInt(clean.replace(/[^0-9]/g, ""), 10);
      return isNaN(n) ? 10 : n;
    }
    if (clean.startsWith("T--")) {
      // Fix bug T--45s
      const n = parseInt(clean.replace(/[^0-9]/g, ""), 10);
      return isNaN(n) ? -10 : -n;
    }
    if (clean.startsWith("T-") || clean.startsWith("-")) {
      const n = parseInt(clean.replace(/[^0-9]/g, ""), 10);
      return isNaN(n) ? -10 : -n;
    }
    const num = parseInt(clean.replace(/[^0-9-]/g, ""), 10);
    if (!isNaN(num)) {
      return num;
    }
  }
  return (fallbackIndex - currentFreezeIndex) * 10;
}

/**
 * Legacy compatibility wrapper for formatRelativeTimestamp
 */
export function formatRelativeTimestamp(val, fallbackIndex = 0, currentFreezeIndex = 0) {
  if (typeof val === "string" && (val.toUpperCase() === "NOW" || val === "0s")) {
    return "NOW";
  }
  const sec = parseRelativeSeconds(val, fallbackIndex, currentFreezeIndex);
  return formatRelativeTime(sec);
}

/**
 * Canonical Trajectory Normalizer
 * Enforces single canonical schema, strict chronological ordering, unique CURRENT node,
 * and unambiguous status classification (OBSERVED -> CURRENT -> FORECAST -> ACTUAL).
 */
export function normalizeTrajectory(rawSteps = [], currentTickIndex = 0, totalTicks = 1) {
  if (!rawSteps || !Array.isArray(rawSteps) || rawSteps.length === 0) {
    return [];
  }

  // 1. Map to raw items with numeric temporal position
  const mapped = rawSteps.map((step, idx) => {
    const rawStage = (step.stage || step.behavior || step.tactic || "Activity").toString().trim();
    // Prevent stage from accidentally becoming a timestamp string
    const cleanStage = (rawStage.startsWith("T-") || rawStage.startsWith("+") || rawStage === "NOW")
      ? (step.techniqueName || "Network Telemetry Activity")
      : rawStage;

    let relSec = null;
    if (step.relativeTimeSeconds !== undefined && step.relativeTimeSeconds !== null && !isNaN(step.relativeTimeSeconds)) {
      relSec = Number(step.relativeTimeSeconds);
    } else if (step.estimatedTime) {
      relSec = parseRelativeSeconds(step.estimatedTime, idx, currentTickIndex);
    } else if (step.isCurrent || step.status === "CURRENT") {
      relSec = 0;
    } else if (step.semanticState === "forecast" || step.status === "FORECAST" || step.status === "PENDING") {
      relSec = (idx + 1) * 10;
    } else {
      relSec = -((rawSteps.length - 1 - idx) * 10);
    }

    const isCurrent = step.isCurrent || step.status === "CURRENT" || relSec === 0;
    const isForecast = !isCurrent && (step.isForecast || step.status === "FORECAST" || step.status === "PENDING" || step.semanticState === "forecast" || relSec > 0);
    const isActual = !isCurrent && !isForecast && (step.status === "ACTUAL" || step.semanticState === "actual");
    const isObserved = !isCurrent && !isForecast && !isActual;

    const status = isCurrent ? "CURRENT" : isActual ? "ACTUAL" : isForecast ? "FORECAST" : "OBSERVED";
    const semanticState = isCurrent ? "current" : isActual ? "actual" : isForecast ? "forecast" : "observed";

    const relDisplay = isCurrent ? "NOW" : formatRelativeTime(relSec);

    return {
      id: step.id || `step-${idx}-${relSec}`,
      timestamp: step.timestamp || null,
      relativeTimeSeconds: relSec,
      relativeTimeDisplay: relDisplay,
      estimatedTime: relDisplay,
      stage: cleanStage,
      techniqueId: step.techniqueId || null,
      techniqueName: step.techniqueName || cleanStage,
      description: step.details || step.description || `Attack stage transition: ${cleanStage}`,
      details: step.details || step.description || `Attack stage transition: ${cleanStage}`,
      sourceHost: step.sourceHost || step.sourceAsset || "Monitored Subnet",
      targetHost: step.targetHost || step.targetAsset || "Target Subnet",
      sourceAsset: step.sourceAsset || step.sourceHost || "Monitored Subnet",
      targetAsset: step.targetAsset || step.targetHost || "Target Subnet",
      status: status,
      semanticState: semanticState,
      isForecast: isForecast,
      isCurrent: isCurrent,
      confidence: step.confidence !== undefined && step.confidence !== null ? Number(step.confidence) : null
    };
  });

  // 2. Deduplicate keeping unique temporal positions / unique step identities
  const seenKeys = new Set();
  const deduped = [];

  mapped.forEach((item) => {
    // Unique key combines time offset and stage
    const key = `${item.relativeTimeSeconds}_${item.stage}_${item.status}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      deduped.push(item);
    }
  });

  // 3. Sort strictly by relativeTimeSeconds ascending
  deduped.sort((a, b) => a.relativeTimeSeconds - b.relativeTimeSeconds);

  // 4. Guarantee exactly ONE current node
  let hasCurrent = false;
  const result = deduped.map((item) => {
    if (item.isCurrent || item.relativeTimeSeconds === 0) {
      if (!hasCurrent) {
        hasCurrent = true;
        return {
          ...item,
          status: "CURRENT",
          semanticState: "current",
          isCurrent: true,
          isForecast: false,
          relativeTimeSeconds: 0,
          relativeTimeDisplay: "NOW",
          estimatedTime: "NOW"
        };
      } else {
        // Demote duplicate current to observed
        return {
          ...item,
          status: "OBSERVED",
          semanticState: "observed",
          isCurrent: false,
          isForecast: false
        };
      }
    }
    return item;
  });

  return result;
}
