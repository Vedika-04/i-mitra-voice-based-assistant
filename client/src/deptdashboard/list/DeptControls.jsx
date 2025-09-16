import React from "react";

const DeptControls = ({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  search,
  onSearchChange,
  page,
  totalPages,
  onPrev,
  onNext,
  total,
}) => {
  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search by title, ID, or citizen name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 min-w-0">
          <label className="text-sm text-gray-600 whitespace-nowrap">
            Status:
          </label>
          <select
            className="border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 min-w-0">
          <label className="text-sm text-gray-600 whitespace-nowrap">
            Priority:
          </label>
          <select
            className="border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Pagination Row */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Page {page} of {Math.max(totalPages || 1, 1)} • {total} complaints
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-emerald-100 bg-white text-gray-700 disabled:opacity-40 hover:bg-emerald-50"
          >
            Previous
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

export default DeptControls;
