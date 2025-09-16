import React, { useState } from "react";

const StatusUpdateCard = ({ currentStatus, onUpdate }) => {
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
    { value: "escalated", label: "Escalated" },
  ];

  const needsNote = ["resolved", "rejected", "escalated"].includes(newStatus);

  const handleUpdate = async () => {
    if (!newStatus) return;
    if (needsNote && !note.trim()) return;

    setUpdating(true);
    try {
      const payload = { status: newStatus };
      if (note.trim()) {
        if (newStatus === "resolved") payload.resolutionNote = note;
        else if (newStatus === "rejected") payload.rejectReason = note;
        else if (newStatus === "escalated") payload.escalationReason = note;
      }

      await onUpdate(payload);
      setNewStatus("");
      setNote("");
    } catch (error) {
      // Error handled in hook
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-3">
      <h3 className="text-lg font-semibold">Update Status</h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-700 mb-1 block">New Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            disabled={updating}
          >
            <option value="">Select status</option>
            {statusOptions
              .filter((opt) => opt.value !== currentStatus)
              .map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>

        {needsNote && (
          <div>
            <label className="text-sm text-gray-700 mb-1 block">
              {newStatus === "resolved" && "Resolution Note"}
              {newStatus === "rejected" && "Rejection Reason"}
              {newStatus === "escalated" && "Escalation Reason"}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full min-h-[80px] border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder={`Enter ${newStatus} details...`}
              disabled={updating}
            />
          </div>
        )}

        <button
          onClick={handleUpdate}
          disabled={!newStatus || (needsNote && !note.trim()) || updating}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
};

export default StatusUpdateCard;
