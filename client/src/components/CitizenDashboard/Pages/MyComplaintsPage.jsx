import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ComplaintCard from "../components/ComplaintCard";
import ComplaintDetails from "../components/ComplaintDetails";
import FilterBar from "../components/FilterBar";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    department: "",
    fromDate: "",
    toDate: "",
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await axios.get(
        `/api/v1/complaint/my?${params.toString()}`,
        { withCredentials: true }
      );

      setComplaints(data.complaints);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 }); // Reset to page 1 when filters change
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Complaints</h1>
        <button
          onClick={() => navigate("/filecomplaint")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          File New Complaint
        </button>
      </div>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      <div className="space-y-4 mt-6">
        {complaints.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No complaints found matching your filters
            </p>
          </div>
        ) : (
          complaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onClick={() => setSelectedComplaint(complaint)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  filters.page === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <ComplaintDetails
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onFeedbackSubmit={fetchComplaints}
        />
      )}
    </div>
  );
}
