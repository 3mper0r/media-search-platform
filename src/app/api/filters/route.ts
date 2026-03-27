import { NextResponse } from 'next/server';
import { getAllCredits, getAllRestrictions } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * GET /api/filters
 *
 * Returns the distinct values that populate the filter UI controls:
 *   - credits:      all unique fotografen credit strings
 *   - restrictions: all unique restriction tokens extracted from suchtext
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    credits: getAllCredits(),
    restrictions: getAllRestrictions(),
  });
}