import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, total, totalPages } = pagination;

  return (
    <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-800">{page}</span> of <span className="font-semibold text-slate-800">{totalPages}</span> · {total} total
      </p>
      <div className="flex items-center gap-2">
        <button className="icon-btn border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40" disabled={page <= 1} onClick={() => onPageChange(page - 1)} type="button" aria-label="Previous page">
          <ChevronLeft size={17} />
        </button>
        <button className="icon-btn border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} type="button" aria-label="Next page">
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
