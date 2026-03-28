"use client";

import useSearch from "@/hooks/useSearch";
import useDarkMode from "@/hooks/useDarkMode";
import SearchBar from "@/components/search/SearchBar";
import Filters from "@/components/search/Filters";
import ResultsList from "@/components/search/ResultsList";
import Pagination from "@/components/search/Pagination";
import SortToggle from "@/components/search/SortToggle";
import Loader from "@/components/UI/LoaderAnimation";
import { Sun, Moon } from "lucide-react";

function SearchPanel() {
  const search = useSearch();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="flex-1 space-y-6">
      {/* Header + Dark Mode */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-gray-100">Media Search</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full transition-colors bg-gray-200 dark:bg-gray-700"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </button>
      </div>
      {/* Search Bar */}
      <SearchBar value={search.query} onChange={search.setQuery} />
      {/* Sort + Results Count */}
      <div className="flex justify-between items-center border-b pb-2">
        <SortToggle sortOrder={search.sortOrder} setSortOrder={search.setSortOrder} />
        {search.data && (
          <div className="text-sm text-gray-500 dark:text-gray-200">
            {search.data.total} results
          </div>
        )}
      </div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4 dark:bg-gray-600">
        <Filters {...search} />
      </div>
      {/* Results List */}
      <div className="min-h-[400px]">
        <ResultsList data={search.data} loading={search.loading} error={search.error} />
      </div>
      {/* Pagination */}
      {search.data && (
        <div className="dark:text-gray-400">
          <Pagination
            page={search.page}
            totalPages={search.data.totalPages}
            setPage={search.setPage}
          />
        </div>
      )}
    </div>
  );
}

export default SearchPanel