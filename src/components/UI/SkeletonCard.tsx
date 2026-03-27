export default function SkeletonCard() {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm animate-pulse">
      
      {/* top row */}
      <div className="flex justify-between mb-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>

      {/* title */}
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-3" />

      {/* snippet lines */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
      </div>

      {/* tags */}
      <div className="flex gap-2 mt-3">
        <div className="h-4 w-16 bg-gray-200 rounded-full" />
        <div className="h-4 w-12 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}