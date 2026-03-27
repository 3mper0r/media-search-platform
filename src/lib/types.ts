// ─── Raw data shape (as it arrives from JSON) ────────────────────────────────

export interface RawMediaItem {
  suchtext: string;
  bildnummer: string;
  fotografen: string;
  datum: string; // "DD.MM.YYYY"
  hoehe: string;
  breite: string;
}

// ─── Preprocessed / indexed shape ────────────────────────────────────────────

export interface MediaItem {
  // Original fields
  suchtext: string;
  bildnummer: string;
  fotografen: string;
  datum: string; // original string kept for display

  // Derived / normalised fields (added at index time)
  datumIso: string | null; // "YYYY-MM-DD" or null if unparseable
  restrictions: string[]; // e.g. ["PUBLICATIONxINxGERxSUIxAUTxONLY"]
  credit: string; // cleaned fotografen, e.g. "United Archives International"
  agency: string; // e.g. "IMAGO"
  tokens: string[]; // lowercase normalised tokens for full-text search
  hoehe: number;
  breite: number;
}

// ─── Inverted index ───────────────────────────────────────────────────────────

/**
 * Maps a normalised token → set of bildnummer values that contain it.
 * Kept as a plain object for fast V8 property lookup.
 */
export type InvertedIndex = Record<string, Set<string>>;

// ─── Search API ───────────────────────────────────────────────────────────────

export type SortOrder = "asc" | "desc";
export type SortField = "datum" | "relevance";

export interface SearchParams {
  q?: string; // free-text query
  credit?: string; // exact credit/agency filter
  dateFrom?: string; // ISO date "YYYY-MM-DD"
  dateTo?: string; // ISO date "YYYY-MM-DD"
  restrictions?: string[]; // must include ALL listed restrictions
  sortBy?: SortField;
  sortOrder?: SortOrder;
  page?: number; // 1-based
  pageSize?: number; // default 20, max 100
}

export interface SearchResultItem {
  bildnummer: string;
  fotografen: string;
  credit: string;
  agency: string;
  datum: string;
  datumIso: string | null;
  restrictions: string[];
  snippet: string; // highlighted suchtext excerpt
  score: number; // relevance score (higher = better)
  hoehe: number;
  breite: number;
}

export interface SearchResponse {
  items: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  durationMs: number;
  query: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  timestamp: number;
  query: string;
  durationMs: number;
  resultCount: number;
  filters: Omit<SearchParams, "q" | "page" | "pageSize">;
}

export interface AnalyticsSummary {
  totalSearches: number;
  avgDurationMs: number;
  topKeywords: Array<{ keyword: string; count: number }>;
  recentSearches: AnalyticsEvent[];
}