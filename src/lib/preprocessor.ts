import type { RawMediaItem, MediaItem, InvertedIndex } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Stop words we strip from tokens before indexing.
 * Keeps the index lean and improves precision.
 */
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "in", "on", "at", "to", "for",
  "of", "by", "with", "from", "is", "was", "are", "were", "be",
  "her", "him", "his", "sie", "der", "die", "das", "und", "oder",
  "im", "in", "am", "an", "auf", "zu", "für", "von", "mit", "bei",
  "aus", "als", "nach", "über", "vor", "nach", "hoch", "ganz",
]);

/**
 * Regex to recognise restriction tokens.
 * Matches strings of 2+ uppercase-or-digit segments joined by "x" (case-insensitive),
 * e.g.  PUBLICATIONxINxGERxSUIxAUTxONLY  or  REUTERSxONLY
 */
const RESTRICTION_REGEX = /\b([A-Z]{2,}(?:x[A-Z0-9]{2,}){1,})\b/g;

// ─── Date parsing ─────────────────────────────────────────────────────────────

/**
 * Converts "DD.MM.YYYY" → "YYYY-MM-DD".
 * Returns null if the date is clearly a placeholder ("01.01.1900") or unparseable.
 */
export function parseDatum(datum: string): string | null {
  if (!datum) return null;
  const match = datum.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;

  const [, dd, mm, yyyy] = match;
  // Treat "01.01.1900" as a known placeholder / unknown date
  if (yyyy === "1900" && mm === "01" && dd === "01") return null;

  return `${yyyy}-${mm}-${dd}`;
}

// ─── Restriction extraction ───────────────────────────────────────────────────

/**
 * Extracts all restriction tokens from a suchtext string.
 * e.g. "... PUBLICATIONxINxGERxSUIxAUTxONLY" → ["PUBLICATIONxINxGERxSUIxAUTxONLY"]
 *
 * We normalise to uppercase so filtering is case-insensitive at query time.
 */
export function extractRestrictions(suchtext: string): string[] {
  const matches = suchtext.toUpperCase().match(RESTRICTION_REGEX);
  return matches ? Array.from(new Set(matches)) : [];
}

// ─── Credit / agency splitting ────────────────────────────────────────────────

/**
 * Splits "IMAGO / United Archives International" into:
 *   agency  → "IMAGO"
 *   credit  → "United Archives International"
 *
 * Falls back gracefully when the separator is absent.
 */
export function parseCredit(fotografen: string): { agency: string; credit: string } {
  const parts = fotografen.split("/").map((p) => p.trim());
  if (parts.length >= 2) {
    return { agency: parts[0], credit: parts.slice(1).join(" / ") };
  }
  return { agency: fotografen.trim(), credit: fotografen.trim() };
}

// ─── Tokenisation ─────────────────────────────────────────────────────────────

/**
 * Normalises a string and returns a de-duped array of lowercase tokens.
 *
 * Steps:
 * 1. Lowercase
 * 2. Strip restriction tokens (they live in their own field)
 * 3. Replace non-alphanumeric chars with spaces
 * 4. Split on whitespace
 * 5. Remove stop words and tokens shorter than 2 chars
 * 6. De-duplicate
 */
export function tokenize(text: string): string[] {
  const withoutRestrictions = text.replace(RESTRICTION_REGEX, " ");
  const lower = withoutRestrictions.toLowerCase();
  const clean = lower.replace(/[^a-z0-9äöüß]+/g, " ");
  const raw = clean.split(/\s+/).filter(Boolean);

  const seen = new Set<string>();
  const result: string[] = [];
  for (const tok of raw) {
    if (tok.length < 2) continue;
    if (STOP_WORDS.has(tok)) continue;
    if (!seen.has(tok)) {
      seen.add(tok);
      result.push(tok);
    }
  }
  return result;
}

// ─── Item preprocessing ───────────────────────────────────────────────────────

/**
 * Converts a raw JSON record into a fully preprocessed MediaItem.
 *
 * All derived fields are computed once here so that:
 * - The search engine never has to re-parse dates or re-extract restrictions
 * - The inverted index can be built from the tokens field directly
 */
export function preprocessItem(raw: RawMediaItem): MediaItem {
  const { agency, credit } = parseCredit(raw.fotografen);
  const datumIso = parseDatum(raw.datum);
  const restrictions = extractRestrictions(raw.suchtext);

  // Build a combined text corpus for full-text tokens:
  // suchtext is primary, fotografen secondary, bildnummer optional
  const corpus = [raw.suchtext, raw.fotografen].join(" ");
  const tokens = tokenize(corpus);

  return {
    suchtext: raw.suchtext,
    bildnummer: raw.bildnummer,
    fotografen: raw.fotografen,
    datum: raw.datum,
    datumIso,
    restrictions,
    credit,
    agency,
    tokens,
    hoehe: parseInt(raw.hoehe, 10) || 0,
    breite: parseInt(raw.breite, 10) || 0,
  };
}

// ─── Inverted index builder ───────────────────────────────────────────────────

/**
 * Builds an inverted index: token → Set<bildnummer>
 *
 * Having this data structure lets the search engine skip items that
 * don't contain any query token in O(1) per token instead of scanning
 * every item for every query.
 *
 * Build complexity : O(n × avg_tokens)
 * Lookup complexity: O(|query_tokens|)  (set intersection)
 */
export function buildInvertedIndex(items: MediaItem[]): InvertedIndex {
  const index: InvertedIndex = {};

  for (const item of items) {
    for (const token of item.tokens) {
      if (!index[token]) index[token] = new Set();
      index[token].add(item.bildnummer);
    }
  }

  return index;
}

/**
 * Incrementally updates an existing inverted index with a single new item.
 * Called when new items arrive at runtime (e.g. from a background ingestion job).
 */
export function indexItem(index: InvertedIndex, item: MediaItem): void {
  for (const token of item.tokens) {
    if (!index[token]) index[token] = new Set();
    index[token].add(item.bildnummer);
  }
}