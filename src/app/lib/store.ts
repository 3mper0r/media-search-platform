/**
 * store.ts
 *
 * Module-level singleton that holds:
 *  - the preprocessed MediaItem array
 *  - the inverted index (token → Set<bildnummer>)
 *  - a lookup map (bildnummer → MediaItem)
 *
 * In Next.js the module is initialised once per server process (not per request),
 * so build cost is paid only at cold-start. Hot-reload during development will
 * re-execute this module, which is acceptable.
 *
 * For production at scale this module would be replaced by a connection to
 * Elasticsearch / Meilisearch / Typesense. The search-engine.ts interface
 * remains unchanged — only this module swaps out.
 */

import rawData from "../../data/seed.json";
import { preprocessItem, buildInvertedIndex, indexItem } from "../lib/preprocessor";
import type { MediaItem, InvertedIndex, RawMediaItem } from "../lib/types";

// ─── Build the store ──────────────────────────────────────────────────────────

const _items: MediaItem[] = (rawData as RawMediaItem[]).map(preprocessItem);

const _index: InvertedIndex = buildInvertedIndex(_items);

const _map = new Map<string, MediaItem>(_items.map((item) => [item.bildnummer, item]));

// ─── Public accessors ─────────────────────────────────────────────────────────

/** Returns a shallow copy of the items array (safe for reads, don't mutate). */
export function getAllItems(): MediaItem[] {
  return _items;
}

/** Returns the live inverted index (read-only in practice). */
export function getIndex(): InvertedIndex {
  return _index;
}

/** O(1) lookup by bildnummer. */
export function getItemById(bildnummer: string): MediaItem | undefined {
  return _map.get(bildnummer);
}

/**
 * Appends a new raw item to the store and updates the index incrementally.
 *
 * This is the entry point for continuous ingestion (e.g. called by a
 * background job or a POST /api/ingest endpoint).
 *
 * Because JavaScript is single-threaded, there is no read/write race
 * in a single Node.js process. In a multi-process deployment (PM2 cluster,
 * multiple Vercel edge instances) you would use a shared external store
 * (Redis / Elasticsearch) instead.
 */
export function appendItem(raw: RawMediaItem): MediaItem {
  const item = preprocessItem(raw);
  _items.push(item);
  _map.set(item.bildnummer, item);
  indexItem(_index, item);
  return item;
}

/** Unique, sorted list of all credits — used to populate the filter dropdown. */
export function getAllCredits(): string[] {
  const credits = new Set(_items.map((i) => i.credit));
  return [...credits].sort();
}

/** Unique, sorted list of all restriction tokens — used for the multi-select UI. */
export function getAllRestrictions(): string[] {
  const r = new Set(_items.flatMap((i) => i.restrictions));
  return [...r].sort();
}