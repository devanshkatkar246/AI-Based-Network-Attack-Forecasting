/**
 * Enforces strict temporal label formatting across the Command Center.
 * Prevents bugs like T--45s, T--90s, T-0s.
 * 
 * Rules:
 * Past: T-90s, T-60s, T-30s
 * Current: NOW
 * Future: T+30s, T+60s (or +30s, +60s)
 */
export function formatRelativeTimestamp(val, fallbackIndex = 0, currentFreezeIndex = 2) {
  if (val === null || val === undefined) {
    const diff = fallbackIndex - currentFreezeIndex;
    if (diff < 0) return `T-${Math.abs(diff * 30)}s`;
    if (diff === 0) return "NOW";
    return `+${diff * 30}s`;
  }

  if (typeof val === "string") {
    const clean = val.trim();
    if (clean.toUpperCase() === "NOW" || clean === "0s" || clean === "T-0s" || clean === "T+0s") {
      return "NOW";
    }
    // Fix T--45s or T--90s double negative bugs
    if (clean.startsWith("T--")) {
      return `T-${clean.slice(3)}`;
    }
    if (clean.startsWith("T-") || clean.startsWith("T+") || clean.startsWith("+") || clean.startsWith("-")) {
      return clean;
    }
    const num = parseInt(clean.replace(/[^0-9-]/g, ""), 10);
    if (!isNaN(num)) {
      if (num < 0) return `T-${Math.abs(num)}s`;
      if (num > 0) return `+${num}s`;
      return "NOW";
    }
    return clean;
  }

  if (typeof val === "number") {
    if (val < 0) return `T-${Math.abs(val)}s`;
    if (val > 0) return `+${val}s`;
    return "NOW";
  }

  return "NOW";
}
