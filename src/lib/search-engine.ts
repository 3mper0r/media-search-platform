/**
 * search-engine.ts
 *
 * Pure functions — no I/O, no side effects.
 * Receives preprocessed items + an inverted index and returns paginated results.
 *
 * ── Relevance scoring ──────────────────────────────────────────────────────
 *
 * For a given query token t and item i, the contribution to score is:
 *
 *   score += FIELD_WEIGHT[field] × MATCH_BONUS[matchType]
 *
 * Field weights:
 *   suchtext  → 1.0   (primary)
 *   fotografen → 0.6  (secondary)
 *   bildnummer → 0.3  (optional, mainly for direct lookup)
 *
 * Match types:
 *   exact      → ×2.0   (token === query word)
 *   prefix     → ×1.0   (token.startsWith(queryWord))
 *
 * Multi-token queries:
 *   Each query word scores independently; total = Σ contributions.
 *   Items matching MORE query words rank higher naturally.
 *
 * ── Why this approach? ────────────────────────────────────────────────────
 * The inverted index narrows the candidate set to only items that contain
 * at least one query token.  Scoring then runs only over that candidate set,
 * keeping latency low even for large corpora.
 */

import { tokenize } from "./preprocessor";
import { getAllItems, getIndex } from "./store";
import type {
  MediaItem,
  SearchParams,
  SearchResponse,
  SearchResultItem,
  SortField,
  SortOrder,
} from "./types";

// ─── Weights ──────────────────────────────────────────────────────────────────

const FIELD_WEIGHT = {
  suchtext: 1.0,
  fotografen: 0.6,
  bildnummer: 0.3,
} as const;

const MATCH_BONUS = {
  exact: 2.0,
  prefix: 1.0,
} as const;

// ─── Snippet generation ───────────────────────────────────────────────────────

const SNIPPET_LENGTH = 160;

/**
 * Returns a short excerpt from suchtext that contains the first query hit,
 * with matched words wrapped in <mark> tags for frontend highlighting.
 *
 * Falls back to a plain truncation when there is no query.
 */
function buildSnippet(suchtext: string, queryWords: string[]): string {
  if (!queryWords.length) {
    return suchtext.length > SNIPPET_LENGTH
      ? suchtext.slice(0, SNIPPET_LENGTH) + "…"
      : suchtext;
  }

  // Find the earliest position of any query word (case-insensitive)
  let earliest = -1;
  for (const word of queryWords) {
    const idx = suchtext.toLowerCase().indexOf(word.toLowerCase());
    if (idx !== -1 && (earliest === -1 || idx < earliest)) {
      earliest = idx;
    }
  }

  const start = Math.max(0, earliest - 40);
  let excerpt =
    (start > 0 ? "…" : "") +
    suchtext.slice(start, start + SNIPPET_LENGTH) +
    (start + SNIPPET_LENGTH < suchtext.length ? "…" : "");

  // Wrap matched words in <mark> — safe for React dangerouslySetInnerHTML
  for (const word of queryWords) {
    if (!word) continue;
    const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    excerpt = excerpt.replace(
      new RegExp(`(${safeWord})`, "gi"),
      "<mark>$1</mark>"
    );
  }

  return excerpt;
}

// ─── Candidate retrieval via inverted index ───────────────────────────────────

/**
 * Returns the set of bildnummer values that contain at least one query token.
 * Uses the inverted index for O(|query_tokens|) lookup vs O(n) full scan.
 */
function getCandidateBildnummern(queryTokens: string[]): Set<string> | null {
  if (!queryTokens.length) return null; // null means "all items"

  const index = getIndex();
  const candidates = new Set<string>();

  for (const token of queryTokens) {
    // Exact match
    if (index[token]) {
      Array.from(index[token]).forEach((id) => candidates.add(id));
    }

    // Prefix match — scan index keys that start with this token.
    // Acceptable at ≤10k items; for millions, use a trie or prefix-aware index.
    Object.keys(index).forEach((key) => {
      if (key !== token && key.startsWith(token)) {
        Array.from(index[key]).forEach((id) => candidates.add(id));
      }
    });
  }

  return candidates;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreItem(item: MediaItem, queryWords: string[]): number {
  if (!queryWords.length) return 0;

  let score = 0;
  const suctextLower = item.suchtext.toLowerCase();
  const fotografenLower = item.fotografen.toLowerCase();
  const bildnummerLower = item.bildnummer.toLowerCase();

  for (const word of queryWords) {
    const wLower = word.toLowerCase();

    // suchtext
    if (suctextLower.includes(wLower)) {
      const bonus = suctextLower.split(/\s+/).includes(wLower)
        ? MATCH_BONUS.exact
        : MATCH_BONUS.prefix;
      score += FIELD_WEIGHT.suchtext * bonus;
    }

    // fotografen
    if (fotografenLower.includes(wLower)) {
      score += FIELD_WEIGHT.fotografen * MATCH_BONUS.prefix;
    }

    // bildnummer
    if (bildnummerLower.includes(wLower)) {
      score += FIELD_WEIGHT.bildnummer * MATCH_BONUS.exact;
    }
  }

  return score;
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function applyFilters(
  items: MediaItem[],
  params: SearchParams,
  candidateIds: Set<string> | null
): MediaItem[] {
  return items.filter((item) => {
    // 1. Candidate set filter (from inverted index)
    if (candidateIds !== null && !candidateIds.has(item.bildnummer)) {
      return false;
    }

    // 2. Credit filter (case-insensitive partial match)
    if (params.credit) {
      const creditLower = params.credit.toLowerCase();
      if (
        !item.credit.toLowerCase().includes(creditLower) &&
        !item.fotografen.toLowerCase().includes(creditLower)
      ) {
        return false;
      }
    }

    // 3. Date range filter
    if (params.dateFrom || params.dateTo) {
      if (!item.datumIso) return false; // unknown dates excluded when filtering

      if (params.dateFrom && item.datumIso < params.dateFrom) return false;
      if (params.dateTo && item.datumIso > params.dateTo) return false;
    }

    // 4. Restrictions filter — item must include ALL requested restrictions
    if (params.restrictions && params.restrictions.length > 0) {
      const itemRestrictions = item.restrictions.map((r) => r.toUpperCase());
      for (const req of params.restrictions) {
        if (!itemRestrictions.includes(req.toUpperCase())) return false;
      }
    }

    return true;
  });
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

type ScoredItem = { item: MediaItem; score: number };

function sortResults(
  scored: ScoredItem[],
  sortBy: SortField,
  sortOrder: SortOrder
): ScoredItem[] {
  return [...scored].sort((a, b) => {
    if (sortBy === "datum") {
      const da = a.item.datumIso ?? "";
      const db = b.item.datumIso ?? "";
      return sortOrder === "asc"
        ? da.localeCompare(db)
        : db.localeCompare(da);
    }

    // Default: sort by relevance score descending, then date descending as tiebreaker
    if (b.score !== a.score) return b.score - a.score;
    const da = a.item.datumIso ?? "";
    const db = b.item.datumIso ?? "";
    return db.localeCompare(da);
  });
}

// ─── Result projection ────────────────────────────────────────────────────────

function projectItem(
  item: MediaItem,
  score: number,
  queryWords: string[]
): SearchResultItem {
  return {
    bildnummer: item.bildnummer,
    fotografen: item.fotografen,
    credit: item.credit,
    agency: item.agency,
    datum: item.datum,
    datumIso: item.datumIso,
    restrictions: item.restrictions,
    snippet: buildSnippet(item.suchtext, queryWords),
    score,
    hoehe: item.hoehe,
    breite: item.breite,
  };
}

// ─── Main search function ─────────────────────────────────────────────────────

export function search(params: SearchParams): Omit<SearchResponse, "durationMs"> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

  const rawQuery = params.q ?? "";
  const queryWords = rawQuery.trim() ? rawQuery.trim().split(/\s+/) : [];
  const queryTokens = tokenize(rawQuery);

  // 1. Use inverted index to get candidate IDs (null = no text query = all items)
  const candidateIds = queryTokens.length
    ? getCandidateBildnummern(queryTokens)
    : null;

  // 2. Fetch all preprocessed items
  const allItems = getAllItems();

  // 3. Filter
  const filtered = applyFilters(allItems, params, candidateIds);

  // 4. Score
  const scored: ScoredItem[] = filtered.map((item) => ({
    item,
    score: scoreItem(item, queryWords),
  }));

  // 5. Sort
  const sortBy: SortField = params.sortBy ?? "relevance";
  const sortOrder: SortOrder = params.sortOrder ?? "desc";
  const sorted = sortResults(scored, sortBy, sortOrder);

  // 6. Paginate
  const total = sorted.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const pageItems = sorted.slice(offset, offset + pageSize);

  // 7. Project to response shape
  const items = pageItems.map(({ item, score }) =>
    projectItem(item, score, queryWords)
  );

  return { items, total, page, pageSize, totalPages, query: rawQuery };
}