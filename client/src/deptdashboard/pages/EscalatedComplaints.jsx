import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDeptContext } from "../DeptContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const EscalatedComplaints = () => {
  const [escalatedComplaints, setEscalatedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEscalated = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/api/v1/department/complaints?status=escalated",
          { withCredentials: true }
        );
        setEscalatedComplaints(res.data.complaints || []);
      } catch (error) {
        console.error("Error fetching escalated complaints:", error);
        setEscalatedComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEscalated();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Escalated Complaints
            </h2>
            <p className="text-blue-700 mt-1 font-medium">
              {escalatedComplaints.length} complaint(s) requiring attention
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-lg border border-blue-300">
            <span className="text-blue-600">📋</span>
            <span className="text-sm font-semibold text-blue-800">
              Priority Review
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {escalatedComplaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Escalated Complaints
          </h3>
          <p className="text-gray-600">
            Excellent! All complaints are being handled efficiently.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Complaint Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Escalation Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Priority Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Escalation Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {escalatedComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-sm">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {complaint.title}
                          </div>
                          <div className="text-sm text-gray-600 truncate mt-1">
                            {complaint.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            complaint.escalation?.type === "system"
                              ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {complaint.escalation?.type === "system"
                            ? "🕒 SLA Breach"
                            : "👤 Manual Review"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            complaint.priority === "urgent"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : complaint.priority === "high"
                              ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : complaint.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {complaint.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {complaint.escalation?.at
                            ? new Date(
                                complaint.escalation.at
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Not specified"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {complaint.escalation?.at
                            ? new Date(
                                complaint.escalation.at
                              ).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/department/complaints/${complaint._id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {escalatedComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
                    {complaint.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      complaint.priority === "urgent"
                        ? "bg-red-100 text-red-700"
                        : complaint.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : complaint.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {complaint.priority.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {complaint.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.escalation?.type === "system"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {complaint.escalation?.type === "system"
                      ? "🕒 SLA Breach"
                      : "👤 Manual Review"}
                  </span>

                  <div className="bg-gray-50 px-2 py-1 rounded text-xs text-gray-700">
                    <span className="font-medium">Escalated: </span>
                    {complaint.escalation?.at
                      ? new Date(complaint.escalation.at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        ) +
                        " at " +
                        new Date(complaint.escalation.at).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Not specified"}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to={`/department/complaints/${complaint._id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EscalatedComplaints;
