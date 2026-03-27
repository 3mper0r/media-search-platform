"use client";

import { useEffect, useState, useRef } from "react";
import { useDebounce } from "./useDebounce";
import { useRouter, useSearchParams } from "next/navigation";

function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── State (initialized from URL) ─────────────────────────
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [credit, setCredit] = useState(searchParams.get("credit") || "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");
  const [restrictions, setRestrictions] = useState<string[]>(
    searchParams.get("restrictions")
      ? searchParams.get("restrictions")!.split(",")
      : []
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query, 600);

  // ── Keep track of last applied filters to avoid unnecessary page reset ──
  const lastFilters = useRef({
    query: debouncedQuery,
    credit,
    restrictions,
    dateFrom,
    dateTo,
    sortOrder,
  });

  // ── Sync FROM URL (for back/forward navigation) ─────────
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setCredit(searchParams.get("credit") || "");
    setDateFrom(searchParams.get("dateFrom") || "");
    setDateTo(searchParams.get("dateTo") || "");
    setRestrictions(
      searchParams.get("restrictions")
        ? searchParams.get("restrictions")!.split(",")
        : []
    );
    setSortOrder(
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    );
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // ── Reset page if filters change (but not when page changes manually) ──
  useEffect(() => {
    const filtersChanged =
      lastFilters.current.query !== debouncedQuery ||
      lastFilters.current.credit !== credit ||
      lastFilters.current.dateFrom !== dateFrom ||
      lastFilters.current.dateTo !== dateTo ||
      lastFilters.current.sortOrder !== sortOrder ||
      JSON.stringify(lastFilters.current.restrictions) !== JSON.stringify(restrictions);

    if (filtersChanged) {
      setPage(1);
      lastFilters.current = {
        query: debouncedQuery,
        credit,
        restrictions,
        dateFrom,
        dateTo,
        sortOrder,
      };
    }
  }, [debouncedQuery, credit, restrictions, dateFrom, dateTo, sortOrder]);

  // ── Fetch data from API ───────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    const fetchSearch = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("q", debouncedQuery);
        if (credit) params.set("credit", credit);
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);
        if (restrictions.length) params.set("restrictions", restrictions.join(","));
        params.set("sortOrder", sortOrder);
        params.set("page", String(page));

        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        if (e.name !== "AbortError") setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
    return () => controller.abort();
  }, [debouncedQuery, credit, restrictions, dateFrom, dateTo, sortOrder, page]);

  // ── Sync TO URL (replace state) ──────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (credit) params.set("credit", credit);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (restrictions.length) params.set("restrictions", restrictions.join(","));
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (page > 1) params.set("page", String(page));

    const newUrl = `?${params.toString()}`;
    if (newUrl !== window.location.search) router.replace(newUrl);
  }, [debouncedQuery, credit, restrictions, dateFrom, dateTo, sortOrder, page, router]);

  return {
    query,
    setQuery,
    credit,
    setCredit,
    restrictions,
    setRestrictions,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    data,
    loading,
    error,
  };
}

export default useSearch;