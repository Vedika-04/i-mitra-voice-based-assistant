import React from "react";

const Controls = ({
  status,
  onStatusChange,
  page,
  totalPages,
  onPrev,
  onNext,
  total,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Status:</label>
        <select
          className="border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div className="flex items-center gap-3 justify-between">
        <span className="text-sm text-gray-600">
          Page {page} of {Math.max(totalPages || 1, 1)} - {total} total
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-emerald-100 bg-white text-gray-700 disabled:opacity-40 hover:bg-emerald-50"
          >
            Prev
          </button>
          <button
            onClick={onNext}
            disabled={page >= (totalPages || 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-emerald-100 bg-white text-gray-700 disabled:opacity-40 hover:bg-emerald-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
