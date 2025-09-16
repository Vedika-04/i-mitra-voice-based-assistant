import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper functions
const getShortId = (id) => (id ? id.slice(0, 8) : "—");
const formatDateOnly = (isoString) => {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString();
};

const LiveSlaCounter = ({ dueAt, status }) => {
  const [counter, setCounter] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!dueAt || status === "resolved" || status === "rejected") {
      setCounter("—");
      return;
    }

    const updateCounter = () => {
      const now = new Date();
      const due = new Date(dueAt);
      const diffMs = due - now;

      if (diffMs <= 0) {
        setCounter("⚠️ Overdue");
        setIsUrgent(true);
        setPulse(true);
        return;
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

      if (diffDays < 1) {
        setIsUrgent(true);
        setPulse(true);
        setCounter(`🔥 ${diffHours}h ${diffMinutes}m`);
      } else {
        setIsUrgent(false);
        setPulse(false);
        setCounter(`⏱️ ${diffDays}d ${diffHours}h`);
      }
    };

    updateCounter();
    const interval = setInterval(updateCounter, 60000); // Update every minute for performance

    return () => clearInterval(interval);
  }, [dueAt, status]);

  return (
    <div className={`relative ${pulse ? "animate-pulse" : ""}`}>
      <span
        className={`text-sm font-mono transition-all duration-300 ${
          isUrgent ? "text-red-600 font-bold" : "text-emerald-700"
        }`}
      >
        {counter}
      </span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const getStatusConfig = () => {
    switch (s) {
      case "resolved":
        return { color: "bg-sky-100 text-sky-800 border-sky-200", emoji: "✅" };
      case "pending":
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          emoji: "⏳",
        };
      case "in_progress":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          emoji: "🔄",
        };
      case "rejected":
        return {
          color: "bg-rose-100 text-rose-800 border-rose-200",
          emoji: "❌",
        };
      case "escalated":
        return { color: "bg-red-100 text-red-800 border-red-200", emoji: "⬆️" };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          emoji: "❓",
        };
    }
  };

  const { color, emoji } = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}
    >
      <span className="mr-1">{emoji}</span>
      {s || "unknown"}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const p = (priority || "medium").toLowerCase();
  const config = {
    high: { color: "bg-rose-100 text-rose-800 border-rose-200", emoji: "🔴" },
    medium: {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      emoji: "🟡",
    },
    low: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      emoji: "🟢",
    },
  };

  const { color, emoji } = config[p] || config.medium;

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}
    >
      <span className="mr-1">{emoji}</span>
      {p}
    </span>
  );
};

const Row = ({ c, onView }) => {
  const clean = (s) =>
    typeof s === "string" ? s.replaceAll('\\"', '"').replaceAll("\\'", "'") : s;
  const status = (c?.status || "").toLowerCase();

  return (
    <tr className="hover:bg-emerald-50/40 transition">
      <td className="px-3 py-3 text-sm font-mono text-gray-700">
        {getShortId(c?._id)}
      </td>
      <td className="px-3 py-3 text-sm text-gray-800 max-w-xs">
        <div className="truncate" title={clean(c?.title)}>
          {clean(c?.title) || "—"}
        </div>
      </td>
      <td className="px-3 py-3 text-sm text-gray-600">
        {clean(c?.departmentName) || "—"}
      </td>
      <td className="px-3 py-3">
        <StatusBadge status={c?.status} />
      </td>
      <td className="px-3 py-3">
        <PriorityBadge priority={c?.priority} />
      </td>
      <td className="px-3 py-3">
        {status === "resolved" ? (
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Resolved:</span>
            <span className="text-sm text-sky-600 font-medium">
              {formatDateOnly(c?.resolvedAt)}
            </span>
          </div>
        ) : (
          <LiveSlaCounter dueAt={c?.sla?.dueAt} status={status} />
        )}
      </td>
      <td className="px-3 py-3 text-xs text-gray-600">
        {formatDateOnly(c?.createdAt)}
      </td>
      <td className="px-3 py-3">
        <button
          onClick={onView}
          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 text-sm font-semibold hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors"
        >
          <span>👁️</span>
          Review
        </button>
      </td>
    </tr>
  );
};

const DeptTable = ({ items }) => {
  const navigate = useNavigate();

  if (!items?.length) {
    return (
      <div className="rounded-xl border border-emerald-100 bg-white/80 p-8 text-center">
        <div className="text-gray-600 mb-2">📋</div>
        <div className="text-gray-600">
          No complaints found matching your criteria.
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Try adjusting your filters or search terms.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-emerald-100 bg-white/80">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-gray-500 border-b border-emerald-100 bg-emerald-50/30">
            <th className="px-3 py-3 font-medium">ID</th>
            <th className="px-3 py-3 font-medium">Title</th>
            <th className="px-3 py-3 font-medium">Department</th>
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="px-3 py-3 font-medium">Priority</th>
            <th className="px-3 py-3 font-medium">SLA / Resolved</th>
            <th className="px-3 py-3 font-medium">Created</th>
            <th className="px-3 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <Row
              key={c?._id}
              c={c}
              onView={() => navigate(`/department/complaints/${c?._id}`)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeptTable;
