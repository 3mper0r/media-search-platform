export default function SortToggle({
  sortOrder,
  setSortOrder,
}: {
  sortOrder: "asc" | "desc";
  setSortOrder: (v: "asc" | "desc") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">Sort by date:</span>

      <button
        onClick={() =>
          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        }
        className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-100"
      >
        {sortOrder === "asc" ? "Oldest > Newest" : "Newest > Oldest"}
      </button>
    </div>
  );
}