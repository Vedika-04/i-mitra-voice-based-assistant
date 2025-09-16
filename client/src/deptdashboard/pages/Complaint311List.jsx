import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Complaint311List = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:4000/api/v1/complaint311/department",
          { withCredentials: true }
        );
        setComplaints(response.data.complaints || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load 311 complaints"
        );
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const formattedComplaints = useMemo(() => {
    return complaints.map((complaint, index) => ({
      sNo: index + 1,
      id: complaint._id,
      title: complaint.title,
      departmentName: complaint.departmentName || "-",
      category: complaint.category || "-",
      description: complaint.description || "-",
      createdAt: complaint.createdAt
        ? new Date(complaint.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
    }));
  }, [complaints]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              311 Complaints
            </h2>
            <p className="text-gray-600 mt-1">
              All complaints submitted through 311 system for your department
            </p>
          </div>
          {!loading && (
            <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-800">
                {complaints.length} complaint(s)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 311 complaints...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Complaints
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No 311 Complaints Found
          </h3>
          <p className="text-gray-600">
            No complaints submitted through 311 system yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Mobile View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {formattedComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        #{complaint.sNo}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {complaint.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {complaint.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {complaint.departmentName}
                    </p>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {complaint.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {complaint.createdAt}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      to={`/department/complaint311/${complaint.id}`}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formattedComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {complaint.sNo}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      <div
                        className="max-w-xs truncate"
                        title={complaint.title}
                      >
                        {complaint.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {complaint.departmentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div
                        className="max-w-md truncate"
                        title={complaint.description}
                      >
                        {complaint.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {complaint.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/department/complaint311/${complaint.id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
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
      )}
    </div>
  );
};

export default Complaint311List;
