// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BASE = "http://localhost:4000/api/v1/complaint";

// const Card = ({ label, value, gradient }) => (
//   <div
//     className={`rounded-2xl border border-emerald-100 p-4 sm:p-5 bg-gradient-to-br ${gradient}`}
//   >
//     {" "}
//     <div className="text-sm text-gray-500">{label}</div>{" "}
//     <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>{" "}
//   </div>
// );
// const StatsCards = () => {
//   const [counts, setCounts] = useState({
//     total: "—",
//     pending: "—",
//     resolved: "—",
//     escalated: "—",
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let active = true;
//     setLoading(true);
//     const getAccurateCounts = async () => {
//       try {
//         // Accurate totals by making small requests with limit=1 (reads total from response)
//         const [totalRes, pendingRes, resolvedRes] = await Promise.all([
//           axios.get(`${BASE}/my`, {
//             params: { page: 1, limit: 1 },
//             withCredentials: true,
//           }),
//           axios.get(`${BASE}/my`, {
//             params: { page: 1, limit: 1, status: "pending" },
//             withCredentials: true,
//           }),
//           axios.get(`${BASE}/my`, {
//             params: { page: 1, limit: 1, status: "resolved" },
//             withCredentials: true,
//           }),
//         ]);

//         if (!active) return;

//         const total = totalRes?.data?.total ?? 0;
//         const pending = pendingRes?.data?.total ?? 0;
//         const resolved = resolvedRes?.data?.total ?? 0;

//         // Escalated: backend status not yet confirmed in /my; keep placeholder “—” or 0 if you prefer
//         setCounts({ total, pending, resolved, escalated: 0 });
//       } catch {
//         if (!active) return;
//         setCounts({ total: 0, pending: 0, resolved: 0, escalated: 0 });
//       } finally {
//         if (!active) return;
//         setLoading(false);
//       }
//     };

//     getAccurateCounts();
//     return () => {
//       active = false;
//     };
//   }, []);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//       <Card
//         label="Total Complaints"
//         value={loading ? "…" : counts.total}
//         gradient="from-emerald-50 to-white"
//       />
//       <Card
//         label="Pending"
//         value={loading ? "…" : counts.pending}
//         gradient="from-amber-50 to-white"
//       />
//       <Card
//         label="Resolved"
//         value={loading ? "…" : counts.resolved}
//         gradient="from-sky-50 to-white"
//       />
//       <Card
//         label="Escalated"
//         value={counts.escalated}
//         gradient="from-rose-50 to-white"
//       />
//     </div>
//   );
// };

// export default StatsCards;

import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:4000/api/v1/complaint";

const Card = ({ label, value, gradient }) => (
  <div
    className={`rounded-2xl border border-emerald-100 p-4 sm:p-5 bg-gradient-to-br ${gradient}`}
  >
    {" "}
    <div className="text-sm text-gray-500">{label}</div>{" "}
    <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>{" "}
  </div>
);

const StatsCards = () => {
  const [counts, setCounts] = useState({
    total: "—",
    pending: "—",
    resolved: "—",
    escalated: "—",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const getAccurateCounts = async () => {
      try {
        // Accurate totals by making small requests with limit=1 (reads total from response)
        const [totalRes, pendingRes, resolvedRes, escalatedRes] =
          await Promise.all([
            axios.get(`${BASE}/my`, {
              params: { page: 1, limit: 1 },
              withCredentials: true,
            }),
            axios.get(`${BASE}/my`, {
              params: { page: 1, limit: 1, status: "pending" },
              withCredentials: true,
            }),
            axios.get(`${BASE}/my`, {
              params: { page: 1, limit: 1, status: "resolved" },
              withCredentials: true,
            }),
            axios.get(`${BASE}/my`, {
              params: { page: 1, limit: 1, status: "escalated" },
              withCredentials: true,
            }),
          ]);

        if (!active) return;

        const total = totalRes?.data?.total ?? 0;
        const pending = pendingRes?.data?.total ?? 0;
        const resolved = resolvedRes?.data?.total ?? 0;
        const escalated = escalatedRes?.data?.total ?? 0;

        setCounts({ total, pending, resolved, escalated });
      } catch {
        if (!active) return;
        setCounts({ total: 0, pending: 0, resolved: 0, escalated: 0 });
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    getAccurateCounts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card
        label="Total Complaints"
        value={loading ? "…" : counts.total}
        gradient="from-emerald-50 to-white"
      />
      <Card
        label="Pending"
        value={loading ? "…" : counts.pending}
        gradient="from-amber-50 to-white"
      />
      <Card
        label="Resolved"
        value={loading ? "…" : counts.resolved}
        gradient="from-sky-50 to-white"
      />
      <Card
        label="Escalated"
        value={loading ? "…" : counts.escalated}
        gradient="from-rose-50 to-white"
      />
    </div>
  );
};

export default StatsCards;
