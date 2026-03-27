"use client";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {

  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-orange-500" 
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
      </svg>
    <input
      type="text"
      placeholder="Search by keywords, photographer, or ID..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
          w-full pl-12 pr-4 py-3 rounded-2xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          text-sm text-gray-900 dark:text-gray-100
          shadow-sm hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-400
          transition-all
        "
      />
    </div>
  );
}