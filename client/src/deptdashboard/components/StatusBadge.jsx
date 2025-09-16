const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  in_progress: "bg-blue-100 text-blue-800 border border-blue-200",
  resolved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  rejected: "bg-gray-100 text-gray-700 border border-gray-200",
  escalated: "bg-red-100 text-red-800 border border-red-200",
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      STATUS_COLORS[status] || "bg-gray-100 text-gray-600"
    }`}
  >
    {status.replace("_", " ").toUpperCase()}
  </span>
);

export default StatusBadge;
