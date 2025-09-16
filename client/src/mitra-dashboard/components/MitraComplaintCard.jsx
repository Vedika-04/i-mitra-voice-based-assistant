import React from "react";
import { Link } from "react-router-dom";

const MitraComplaintCard = ({ complaint }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-50 text-amber-800 border-amber-200",
      in_progress: "bg-blue-50 text-blue-800 border-blue-200",
      resolved: "bg-green-50 text-green-800 border-green-200",
      rejected: "bg-rose-50 text-rose-800 border-rose-200",
      escalated: "bg-purple-50 text-purple-800 border-purple-200",
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-50 text-gray-700 border-gray-200",
      medium: "bg-amber-50 text-amber-700 border-amber-200",
      high: "bg-orange-50 text-orange-700 border-orange-200",
      urgent: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) return "Just now";
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link
      to={`/mitra/complaints/${complaint._id}`}
      className="block bg-white rounded-2xl border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 p-5"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {complaint.title || "Untitled Complaint"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {complaint.category} • {complaint.zone}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(
                complaint.status
              )}`}
            >
              {complaint.status?.replace("_", " ") || "pending"}
            </span>
            <span
              className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${getPriorityColor(
                complaint.priority
              )}`}
            >
              {complaint.priority || "medium"}
            </span>
          </div>
        </div>

        {/* Location */}
        {complaint.location?.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">
              {truncateText(complaint.location.location, 50)}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Created {formatDate(complaint.createdAt)}
          </div>

          <div className="flex items-center gap-2">
            {complaint.resolvedAt && (
              <span className="text-xs text-green-600 font-medium">
                ✅ Resolved {formatDate(complaint.resolvedAt)}
              </span>
            )}

            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MitraComplaintCard;
