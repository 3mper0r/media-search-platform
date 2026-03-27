export default function ResultItem({ item }: any) {
  return (
    <div className="bg-white/80 h-[140px] backdrop-blur border border-gray-200 p-4 rounded-2xl shadow-sm space-y-4 dark:bg-gray-800/70 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div className="text-xs text-gray-400 dark:text-gray-200">
          #{item.bildnummer}
        </div>
        {item.datumIso && (
          <div className="text-xs text-gray-500 dark:text-gray-200">
            {item.datum}
          </div>
        )}
      </div>

      <div className="mt-2 font-medium text-sm dark:text-gray-400">
        {item.fotografen}
      </div>

      <div
        className="mt-2 text-sm text-gray-700 leading-relaxed dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: item.snippet }}
      />

      {/* Restrictions */}
      {item.restrictions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.restrictions.map((r: string) => (
            <span
              key={r}
              className="text-xs bg-gray-100 px-2 py-0.5 rounded"
            >
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}