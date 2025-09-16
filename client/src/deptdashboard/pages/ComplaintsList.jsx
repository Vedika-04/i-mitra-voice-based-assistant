import React, { useMemo, useState } from "react";
import { useDepartmentComplaints } from "../hooks/useDepartmentComplaints";
import DeptControls from "../list/DeptControls";
import DeptTable from "../list/DeptTable";

const DepartmentComplaintsList = () => {
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { complaints, total, totalPages, loading, error } =
    useDepartmentComplaints({
      page,
      limit,
      status,
      priority,
      search,
    });

  const items = useMemo(() => complaints || [], [complaints]);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Department Complaints
        </h1>
        <div className="text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          {total} total
        </div>
      </header>

      <DeptControls
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        priority={priority}
        onPriorityChange={(val) => {
          setPriority(val);
          setPage(1);
        }}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        onNext={() => setPage((p) => (p < totalPages ? p + 1 : p))}
        total={total}
      />

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm">
          Failed to load complaints. Please try again.
        </div>
      ) : loading ? (
        <div className="rounded-xl border border-emerald-100 bg-white/80 p-6 text-gray-600">
          Loading complaints…
        </div>
      ) : (
        <DeptTable items={items} />
      )}
    </div>
  );
};

export default DepartmentComplaintsList;
