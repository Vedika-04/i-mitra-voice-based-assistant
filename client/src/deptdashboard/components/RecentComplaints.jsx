// components/RecentComplaints.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RecentComplaints = () => {
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/department/complaints/recent",
          { withCredentials: true }
        );
        setRecentComplaints(res.data.complaints || []);
      } catch (error) {
        console.error("Error fetching recent complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-emerald-100 text-emerald-800",
      escalated: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "text-red-600",
      high: "text-orange-600",
      medium: "text-blue-600",
      low: "text-gray-600",
    };
    return colors[priority] || "text-gray-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Complaints
        </h3>
        <Link
          to="/department/complaints"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : recentComplaints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No recent complaints</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentComplaints.slice(0, 5).map((complaint) => (
            <div
              key={complaint._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <Link to={`/department/complaints/${complaint._id}`}>
                  <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-600">
                    {complaint.title}
                  </p>
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status.replace("_", " ")}
                  </span>
                  <span
                    className={`text-xs font-medium ${getPriorityColor(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-4">
                {new Date(complaint.createdAt).toLocaleDateString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentComplaints;
