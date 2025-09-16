import React, { useMemo, useEffect, useState } from "react";
import { useMyComplaints } from "../hooks/useMyComplaints";
import { useNavigate } from "react-router-dom";

// Helper functions
const getShortId = (id) => (id ? id.slice(0, 5) : "—");
const formatDateOnly = (isoString) => {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString();
};

const LiveSlaCounter = ({ dueAt, status }) => {
  const [counter, setCounter] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!dueAt) {
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
      const diffSeconds = Math.floor((diffMs / 1000) % 60);

      // If less than 1 day, show urgency with seconds and special styling
      if (diffDays < 1) {
        setIsUrgent(true);
        setPulse(true);
        setCounter(`🔥 ${diffHours}h ${diffMinutes}m ${diffSeconds}s`);
      } else {
        setIsUrgent(false);
        setPulse(false);
        setCounter(`⏱️ ${diffDays}d ${diffHours}h ${diffMinutes}m`);
      }
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000); // Live ticking every second

    return () => clearInterval(interval);
  }, [dueAt]);

  return (
    <div className={`relative ${pulse ? "animate-pulse" : ""}`}>
      <span
        className={`text-sm font-mono transition-all duration-300 ${
          isUrgent ? "text-red-600 font-bold" : "text-emerald-700"
        }`}
        style={{
          filter: isUrgent
            ? "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))"
            : "none",
          animation: isUrgent ? "glow-fade 2s ease-in-out infinite" : "none",
        }}
      >
        {counter}
      </span>

      {isUrgent && (
        <style jsx>{`
          @keyframes glow-fade {
            0%,
            100% {
              text-shadow: 0 0 5px #ef4444, 0 0 10px #ef4444;
              transform: scale(1);
            }
            50% {
              text-shadow: 0 0 10px #dc2626, 0 0 20px #dc2626, 0 0 30px #dc2626;
              transform: scale(1.05);
            }
          }
        `}</style>
      )}
    </div>
  );
};

const Row = ({ c, onView }) => {
  const created = formatDateOnly(c?.createdAt);
  const status = (c?.status || "").toLowerCase();

  const statusColor =
    status === "resolved"
      ? "bg-sky-100 text-sky-800 border-sky-200"
      : status === "pending"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-rose-100 text-rose-800 border-rose-200";

  const clean = (s) =>
    typeof s === "string" ? s.replaceAll('\\"', '"').replaceAll("\\'", "'") : s;

  return (
    <tr className="hover:bg-emerald-50/40 transition">
      <td className="px-3 py-2 text-sm font-mono text-gray-700">
        {getShortId(c?._id)}
      </td>
      <td className="px-3 py-2 text-sm text-gray-800">
        {clean(c?.title) || "—"}
      </td>
      <td className="px-3 py-2 text-sm text-gray-600">
        {clean(c?.departmentName) || "—"}
      </td>
      <td className="px-3 py-2">
        <span
          className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor}`}
        >
          {status || "—"}
        </span>
      </td>
      <td className="px-3 py-2">
        {status === "resolved" ? (
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Resolved:</span>
            <span className="text-sm text-sky-600 font-medium">
              {formatDateOnly(c?.resolvedAt)}
            </span>
          </div>
        ) : status === "rejected" || status === "escalated" ? (
          "—"
        ) : (
          <LiveSlaCounter dueAt={c?.sla?.dueAt} status={status} />
        )}
      </td>
      <td className="px-3 py-2 text-xs text-gray-600">{created}</td>
      <td className="px-3 py-2">
        <button
          onClick={onView}
          className="text-emerald-700 hover:text-emerald-900 text-sm font-semibold"
        >
          View
        </button>
      </td>
    </tr>
  );
};

const TopUnresolved = () => {
  const navigate = useNavigate();
  const { complaints, loading, error } = useMyComplaints({
    page: 1,
    limit: 20,
  });

  const items = useMemo(() => {
    const list = Array.isArray(complaints) ? complaints : [];
    const unresolved = list.filter(
      (c) => (c?.status || "").toLowerCase() !== "resolved"
    );
    unresolved.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return unresolved.slice(0, 5);
  }, [complaints]);

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top 5 Unresolved</h2>
        <span className="text-xs text-gray-500">
          {loading ? "Loading…" : `${items.length} items`}
        </span>
      </div>

      {error ? (
        <div className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md p-3">
          Failed to load complaints. Please try again.
        </div>
      ) : loading ? (
        <div className="mt-4 text-sm text-gray-500">
          Loading latest complaints…
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 text-sm text-gray-500">
          All clear! No unresolved complaints.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-emerald-100">
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Department</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">SLA / Resolved</th>
                <th className="px-3 py-2 font-medium">Created</th>
                <th className="px-3 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <Row
                  key={c?._id}
                  c={c}
                  onView={() => navigate(`/complaint/${c?._id}`)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopUnresolved;
