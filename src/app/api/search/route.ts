/**
 * GET /api/search
 *
 * Query parameters:
 *   q           string              free-text search
 *   credit      string              filter by credit/agency
 *   dateFrom    string (YYYY-MM-DD) range start
 *   dateTo      string (YYYY-MM-DD) range end
 *   restrictions string[]           comma-separated restriction tokens
 *   sortBy      "datum"|"relevance" default: "relevance"
 *   sortOrder   "asc"|"desc"        default: "desc"
 *   page        number              1-based, default: 1
 *   pageSize    number              default: 20, max: 100
 */

import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search-engine";
import { recordSearch } from "@/lib/analytics";
import type { SearchParams, SearchResponse } from "@/lib/types";

export const dynamic = "force-dynamic"; // never statically cache this route

export async function GET(req: NextRequest): Promise<NextResponse> {
  const start = performance.now();
  const sp = req.nextUrl.searchParams;

  // ── Parse & validate params ────────────────────────────────────────────────

  const params: SearchParams = {
    q: sp.get("q") ?? undefined,
    credit: sp.get("credit") ?? undefined,
    dateFrom: sp.get("dateFrom") ?? undefined,
    dateTo: sp.get("dateTo") ?? undefined,
    sortBy:
      (sp.get("sortBy") as SearchParams["sortBy"]) ??
      (sp.has("q") ? "relevance" : "datum"),
    sortOrder: (sp.get("sortOrder") as SearchParams["sortOrder"]) ?? "desc",
    page: sp.has("page") ? Math.max(1, parseInt(sp.get("page")!, 10)) : 1,
    pageSize: sp.has("pageSize")
      ? Math.min(100, Math.max(1, parseInt(sp.get("pageSize")!, 10)))
      : 10,
  };

  // Restrictions arrive as a single comma-separated value or multiple params
  const rawRestrictions =
    sp.getAll("restrictions").join(",") || sp.get("restrictions") || "";
  if (rawRestrictions) {
    params.restrictions = rawRestrictions
      .split(",")
      .map((r) => r.trim().toUpperCase())
      .filter(Boolean);
  }

  // Basic date format validation
  const isoDateRe = /^\d{4}-\d{2}-\d{2}$/;
  if (params.dateFrom && !isoDateRe.test(params.dateFrom)) {
    return NextResponse.json(
      { error: "dateFrom must be YYYY-MM-DD" },
      { status: 400 }
    );
  }
  if (params.dateTo && !isoDateRe.test(params.dateTo)) {
    return NextResponse.json(
      { error: "dateTo must be YYYY-MM-DD" },
      { status: 400 }
    );
  }

  // ── Execute search ─────────────────────────────────────────────────────────

  try {
    const result = search(params);
    const durationMs = Math.round(performance.now() - start);

    // Record analytics (non-blocking — any error here must not fail the request)
    try {
      const { q, page: _p, pageSize: _ps, ...filters } = params;
      recordSearch(q ?? "", durationMs, result.total, filters);
    } catch (_) {
      // analytics errors are silent
    }

    const response: SearchResponse = { ...result, durationMs };

    return NextResponse.json(response, {
      headers: {
        "X-Search-Duration-Ms": String(durationMs),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/search] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}