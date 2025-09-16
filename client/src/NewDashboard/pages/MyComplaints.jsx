import React, { useMemo, useState } from "react";
import { useMyComplaints } from "../hooks/useMyComplaints";
import Controls from "../components/MyComplaints/Controls";
import Table from "../components/MyComplaints/Table";

const MyComplaints = () => {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { complaints, total, totalPages, loading, error } = useMyComplaints({
    page,
    limit,
    status,
  });

  const items = useMemo(() => complaints || [], [complaints]);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          My Complaints
        </h1>
      </header>
      <Controls
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
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
        <Table items={items} />
      )}
    </div>
  );
};

export default MyComplaints;
