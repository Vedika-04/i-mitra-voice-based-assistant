import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:4000/api/v1/complaint";

const ZoneSnapshot = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    axios
      .get(`${BASE}/stats/zone`, { withCredentials: true })
      .then((res) => {
        if (!active) return;
        setStats(res?.data?.stats || []);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) return null; // Gracefully hide if zone stats unavailable

  const pending = stats.find((s) => s._id === "pending")?.count || 0;
  const resolved = stats.find((s) => s._id === "resolved")?.count || 0;
  const latest = stats.reduce(
    (max, s) => (new Date(s.latest) > new Date(max) ? s.latest : max),
    stats[0]?.latest || ""
  );

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-emerald-800">
          Zone Activity
        </h3>
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
          Community
        </span>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading zone stats...</div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pending in zone:</span>
            <span className="font-semibold text-amber-700">{pending}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Resolved in zone:</span>
            <span className="font-semibold text-sky-700">{resolved}</span>
          </div>
          {latest && (
            <div className="text-xs text-gray-500 pt-2 border-t border-emerald-100">
              Last activity: {new Date(latest).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZoneSnapshot;
