import React from "react";

const Pill = ({ children, tone = "emerald" }) => {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    sky: "bg-sky-50 text-sky-800 border-sky-200",
    rose: "bg-rose-50 text-rose-800 border-rose-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
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

// Helper to format date as DD-MM-YY HH:MM:SS
const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  const DD = String(date.getDate()).padStart(2, "0");
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const YY = String(date.getFullYear()).slice(-2);
  const HH = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const SS = String(date.getSeconds()).padStart(2, "0");
  return `${DD}-${MM}-${YY} ${HH}:${min}:${SS}`;
};

const SummaryCard = ({ c }) => {
  const clean = (s) =>
    typeof s === "string" ? s.replaceAll('"', '"').replaceAll("'", "'") : s;
  const status = (c?.status || "").toLowerCase();
  const statusTone =
    status === "resolved" ? "sky" : status === "pending" ? "amber" : "rose";

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Summary</h2>
        <Pill tone={statusTone}>{status || "—"}</Pill>
      </div>

      {/* All fields in grid including Resolved At */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Complaint ID" value={c?._id} />
        <Field label="Title" value={clean(c?.title)} />
        <Field label="Department" value={clean(c?.departmentName)} />
        <Field label="Category" value={clean(c?.category)} />
        <Field label="Priority" value={c?.priority || "medium"} />
        <Field
          label="Created"
          value={c?.createdAt ? formatDate(c.createdAt) : "—"}
        />
        <Field
          label="Updated"
          value={c?.updatedAt ? formatDate(c.updatedAt) : "—"}
        />
        <Field
          label="SLA Due"
          value={c?.sla?.dueAt ? formatDate(c.sla.dueAt) : "—"}
        />
        <Field label="SLA Breached" value={String(c?.sla?.breached ?? false)} />
        <Field
          label="Resolved At"
          value={c?.resolvedAt ? formatDate(c.resolvedAt) : "—"}
        />
      </div>

      {/* Description shown separately below */}
      <div>
        <div className="text-xs text-gray-500 mb-1">Description</div>
        <div className="text-sm text-gray-800 whitespace-pre-wrap">
          {clean(c?.description) || "—"}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
