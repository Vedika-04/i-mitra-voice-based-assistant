import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [data, setData] = useState({
    active: [],
    resolved: [],
    stats: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const [active, resolved, stats] = await Promise.all([
        axios.get("/api/v1/complaint/my?status!=resolved&limit=5", {
          withCredentials: true,
        }),
        axios.get("/api/v1/complaint/my?status=resolved&limit=3", {
          withCredentials: true,
        }),
        axios.get("/api/v1/complaint/stats/zone", {
          withCredentials: true,
        }),
      ]);

      setData({
        active: active.data?.complaints || [],
        resolved: resolved.data?.complaints || [],
        stats: stats.data?.stats || null,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("API Error:", err);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Failed to load data",
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data.loading) return <div>Loading...</div>;
  if (data.error) return <div>Error: {data.error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Citizen Dashboard</h1>

      <div className="mb-6">
        <Link
          to="/filecomplaint"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          File New Complaint
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Active Complaints</h2>
        {data.active.length > 0 ? (
          data.active.map((item) => (
            <div key={item._id} className="p-3 border mb-2">
              <h3>{item.title}</h3>
              <p className="text-sm text-gray-600">{item.department}</p>
            </div>
          ))
        ) : (
          <p>No active complaints</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Resolved Complaints</h2>
        {data.resolved.length > 0 ? (
          data.resolved.map((item) => (
            <div key={item._id} className="p-3 border mb-2">
              <h3>{item.title}</h3>
              <p className="text-sm text-gray-600">
                Resolved on {new Date(item.resolvedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No resolved complaints</p>
        )}
      </div>
    </div>
  );
}
