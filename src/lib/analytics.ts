/**
 * analytics.ts
 *
 * Lightweight in-memory analytics store.
 *
 * Tracks:
 *   - Total number of searches
 *   - Per-request duration (ms)
 *   - Keyword frequency map
 *   - Rolling window of the last N raw events (for recent-searches display)
 *
 * For production this would be replaced by a time-series DB write
 * (e.g. ClickHouse, InfluxDB) or a Kafka topic, but the interface
 * (recordSearch / getSummary) stays the same.
 */

import type { AnalyticsEvent, AnalyticsSummary, SearchParams } from "./types";

// ─── Store state ──────────────────────────────────────────────────────────────

const MAX_RECENT = 50;

let totalSearches = 0;
let totalDurationMs = 0;
const keywordFrequency = new Map<string, number>();
const recentEvents: AnalyticsEvent[] = [];

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Records one search event.
 * Called by the route handler after each successful search response.
 */
export function recordSearch(
  query: string,
  durationMs: number,
  resultCount: number,
  filters: Omit<SearchParams, "q" | "page" | "pageSize">
): void {
  totalSearches += 1;
  totalDurationMs += durationMs;

  // Track individual words in the query (normalised, no stop words)
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  for (const word of words) {
    keywordFrequency.set(word, (keywordFrequency.get(word) ?? 0) + 1);
  }

  // Maintain rolling recent-events buffer
  const event: AnalyticsEvent = {
    timestamp: Date.now(),
    query,
    durationMs,
    resultCount,
    filters,
  };

  recentEvents.unshift(event);
  if (recentEvents.length > MAX_RECENT) recentEvents.pop();
}

/**
 * Returns an aggregated analytics summary.
 */
export function getSummary(): AnalyticsSummary {
  const avgDurationMs =
    totalSearches > 0 ? Math.round(totalDurationMs / totalSearches) : 0;

  // Top 10 keywords by frequency
  const topKeywords = Array.from(keywordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));

  return {
    totalSearches,
    avgDurationMs,
    topKeywords,
    recentSearches: recentEvents.slice(0, 10),
  };
}

/**
 * Resets the analytics store (useful for tests).
 */
export function resetAnalytics(): void {
  totalSearches = 0;
  totalDurationMs = 0;
  keywordFrequency.clear();
  recentEvents.length = 0;
}