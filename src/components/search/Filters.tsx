"use client";

import { useEffect, useState } from "react";

export default function Filters({
  credit,
  setCredit,
  restrictions,
  setRestrictions,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: any) {
  const [credits, setCredits] = useState<string[]>([]);
  const [allRestrictions, setAllRestrictions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.credits);
        setAllRestrictions(data.restrictions);
      });
  }, []);

  const toggleRestriction = (r: string) => {
    setRestrictions((prev: string[]) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  return (
    <div className="space-y-4">
      {/* Credit */}
      <select
        value={credit}
        onChange={(e) => setCredit(e.target.value)}
        className="w-full border rounded-xl p-2"
      >
        <option value="">All Credits</option>
        {credits.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {/* Date */}
      <div className="flex gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border rounded-xl p-2 w-full"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border rounded-xl p-2 w-full"
        />
      </div>

      {/* Restrictions */}
      <div className="flex flex-wrap gap-2">
        {allRestrictions.map((r) => (
          <button
            key={r}
            onClick={() => toggleRestriction(r)}
            className={`px-3 py-1 rounded-full border ${
              restrictions.includes(r)
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}