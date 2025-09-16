import React from "react";

const Pill = ({ children, tone = "emerald" }) => {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    sky: "bg-sky-50 text-sky-800 border-sky-200",
    rose: "bg-rose-50 text-rose-800 border-rose-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
        tones[tone] || tones.gray
      }`}
    >
      {children}
    </span>
  );
};

const Field = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-sm font-medium text-gray-800 break-words">
      {value ?? "—"}
    </div>
  </div>
);

const DeptSummaryCard = ({ c }) => {
  const clean = (s) =>
    typeof s === "string" ? s.replaceAll('"', '"').replaceAll("'", "'") : s;

  const status = (c?.status || "").toLowerCase();
  const statusTone =
    status === "resolved"
      ? "sky"
      : status === "in_progress"
      ? "purple"
      : status === "pending"
      ? "amber"
      : status === "rejected"
      ? "rose"
      : status === "escalated"
      ? "rose"
      : "gray";

  const priority = (c?.priority || "").toLowerCase();
  const priorityTone =
    priority === "high" ? "rose" : priority === "medium" ? "amber" : "emerald";

  const isSlaBreached = c?.sla?.breached;

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    const DD = String(d.getDate()).padStart(2, "0");
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const YY = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${DD}-${MM}-${YY} ${hh}:${mm}`;
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Complaint Summary</h2>
        <div className="flex items-center gap-2">
          <Pill tone={statusTone}>{status || "—"}</Pill>
          <Pill tone={priorityTone}>{priority || "medium"}</Pill>
          {isSlaBreached && <Pill tone="rose">SLA Breached</Pill>}
        </div>
      </div>

      {/* Summary Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Complaint ID" value={c?._id} />
        <Field label="Title" value={clean(c?.title)} />
        <Field label="Department" value={clean(c?.departmentName)} />
        <Field label="Category" value={clean(c?.category)} />
        <Field label="Created" value={formatDate(c?.createdAt)} />
        <Field label="Updated" value={formatDate(c?.updatedAt)} />
        <Field label="SLA Due" value={formatDate(c?.sla?.dueAt)} />
        <Field
          label="Assigned To"
          value={c?.assignedMitraId?.fullName || "Unassigned"}
        />
      </div>

      {/* Description + ResolvedAt side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Description</div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {clean(c?.description) || "—"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Resolved At</div>
          <div className="text-sm text-gray-800">
            {formatDate(c?.resolvedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeptSummaryCard;
