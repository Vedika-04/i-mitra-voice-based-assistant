import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../main.jsx";

const ComplaintsTable = () => {
  const { user } = useContext(Context);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({}); // store live SLA timers

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/complaint/my",
          {
            params: { page: 1, limit: 1000 },
            withCredentials: true,
          }
        );
        setComplaints(res.data.complaints || []);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Live SLA timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = {};
      complaints.forEach((c) => {
        const slaHours = 48; // SLA 48 hours
        const endTime =
          new Date(c.createdAt).getTime() + slaHours * 60 * 60 * 1000;
        const diff = endTime - Date.now();

        if (diff <= 0) {
          newTimeLeft[c._id] = "SLA expired";
        } else {
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeft[c._id] = `${hrs.toString().padStart(2, "0")}h ${mins
            .toString()
            .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [complaints]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      case "escalated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p>Loading complaints...</p>;
  if (complaints.length === 0) return <p>No complaints found.</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-semibold text-green-700 mb-4">
        My Complaints
      </h2>
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-green-600 text-white rounded-lg">
          <tr>
            <th className="px-4 py-2 rounded-tl-lg">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">SLA Timer</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c, idx) => (
            <tr
              key={c._id}
              className="hover:bg-green-50 transition-colors duration-200"
            >
              <td className="border px-4 py-2 text-center">{idx + 1}</td>
              <td className="border px-4 py-2 font-medium">{c.title}</td>
              <td className="border px-4 py-2">{c.departmentName || "-"}</td>
              <td
                className={`border px-4 py-2 text-center rounded-full ${getStatusColor(
                  c.status
                )}`}
              >
                {c.status}
              </td>
              <td className="border px-4 py-2 text-center">
                {new Date(c.createdAt).toLocaleString()}
              </td>
              <td className="border px-4 py-2 text-center font-mono text-sm text-green-700">
                {timeLeft[c._id]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsTable;
