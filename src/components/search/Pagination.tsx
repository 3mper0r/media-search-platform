export default function Pagination({ data, page, totalPages, setPage }: any) {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        disabled={page === 1 && !data}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded-xl hover:opacity-70 disabled:opacity-25"
      >
        Prev
      </button>

      <span>{page} / {totalPages}</span>

      <button
        disabled={page === totalPages || totalPages === 0 && !data}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 border rounded-xl hover:opacity-70 disabled:opacity-25"
      >
        Next
      </button>
    </div>
  );
}