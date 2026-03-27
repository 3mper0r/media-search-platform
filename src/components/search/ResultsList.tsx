import SkeletonGrid from "../UI/SkeletonGrid";
import Spinner from "../UI/Spinner";
import ResultItem from "./ResultItem";

export default function ResultsList({ data, loading, error }: any) {
  //if (loading) return <Spinner />
  if (loading) return <SkeletonGrid />

  if (error) return <div className="text-red-500 py-6">{error}</div>;

  if (!data || data.items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="text-lg font-medium">No results found</div>
        <div className="text-sm mt-1">Try adjusting your search or filters</div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.items.map((item: any) => (
        <ResultItem key={item.bildnummer} item={item} />
      ))}
    </div>
  );
}