import React, { useState } from "react";
import { useMitraComplaints } from "../hooks/useMitraComplaints";
import MitraFilterBar from "../components/MitraFilterBar";
import MitraComplaintCard from "../components/MitraComplaintCard";

const MitraDashboard = () => {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    page: 1,
    limit: 20,
  });

  const { complaints, loading, error, refetch } = useMitraComplaints(filters);

  const getStatusCounts = () => {
    const counts = {
      total: complaints.length,
      pending: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
      escalated: 0,
    };

    complaints.forEach((complaint) => {
      if (counts.hasOwnProperty(complaint.status)) {
        counts[complaint.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const StatCard = ({ label, count, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-indigo-500",
      amber: "from-amber-500 to-orange-500",
      green: "from-green-500 to-emerald-500",
      rose: "from-rose-500 to-red-500",
      purple: "from-purple-500 to-indigo-500",
    };

    return (
      <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}
          >
            <span className="text-white font-bold text-lg">{count}</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{count}</p>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Complaints
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Assigned Complaints
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and update your assigned field operations
          </p>
        </div>

        <button
          onClick={refetch}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white border border-blue-200 hover:border-blue-300 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total" count={statusCounts.total} color="blue" />
        <StatCard label="Pending" count={statusCounts.pending} color="amber" />
        <StatCard
          label="In Progress"
          count={statusCounts.in_progress}
          color="purple"
        />
        <StatCard
          label="Resolved"
          count={statusCounts.resolved}
          color="green"
        />
        <StatCard label="Rejected" count={statusCounts.rejected} color="rose" />
      </div>

      {/* Filters */}
      <MitraFilterBar filters={filters} onFilterChange={setFilters} />

      {/* Complaints List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-blue-100 p-5 animate-pulse"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Complaints Found
          </h3>
          <p className="text-gray-600">
            {filters.status || filters.priority
              ? "No complaints match your current filters. Try adjusting the filters above."
              : "You have no assigned complaints at the moment."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <MitraComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MitraDashboard;
