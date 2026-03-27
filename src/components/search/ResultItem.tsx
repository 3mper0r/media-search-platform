export default function ResultItem({ item }: any) {
  return (
    <div className="group relative bg-white/90 dark:bg-gray-900/80 h-[140px] backdrop-blur-sm border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:cursor-pointer hover:-translate-y-0.5 overflow-hidden">
      
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Subtle shimmer bg on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-orange-50/0 group-hover:from-amber-50/50 group-hover:to-orange-50/20 dark:group-hover:from-amber-900/10 dark:group-hover:to-orange-900/5 rounded-2xl transition-all duration-300 pointer-events-none" />

      <div className="relative flex justify-between items-start">
        <div className="text-[10px] font-mono font-semibold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-md">
          #{item.bildnummer}
        </div>
        {item.datumIso && (
          <div className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">
            {item.datum}
          </div>
        )}
      </div>

      <div className="relative mt-1.5 font-semibold text-xs text-gray-500 dark:text-gray-400 tracking-wide uppercase">
        {item.fotografen}
      </div>

      <div
        className="relative mt-1 text-sm text-gray-800 dark:text-gray-200 leading-relaxed line-clamp-2"
        dangerouslySetInnerHTML={{ __html: item.snippet }}
      />

      {item.restrictions.length > 0 && (
        <div className="relative mt-2 flex flex-wrap gap-1">
          {item.restrictions.map((r: string) => (
            <span
              key={r}
              className="text-[10px] font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800 px-2 py-0.5 rounded-full"
            >
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}