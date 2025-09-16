import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminLayout } from "../components/layout";
import { DataTable, FilterPanel } from "../components/ui";
import { useComplaints } from "../hooks/useAnalytics";
import {
  MessageSquare,
  Eye,
  Download,
  RefreshCw,
  Search,
  Building2,
  AlertTriangle,
} from "lucide-react";
import {
  formatDate,
  formatDateTime,
  getStatusBadgeColor,
  formatNumber,
} from "../utils/helpers";
import { toast } from "react-toastify";

const ComplaintsList = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
    status: "",
    priority: "",
    departmentName: "",
    breachedOnly: "",
    escalatedOnly: "",
    withMediaOnly: "",
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    data: complaintsData,
    loading,
    error,
    refetch,
  } = useComplaints(filters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      to: new Date().toISOString().split("T")[0],
      status: "",
      priority: "",
      departmentName: "",
      breachedOnly: "",
      escalatedOnly: "",
      withMediaOnly: "",
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSort = (sortBy, sortOrder) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const handleViewComplaint = (complaintId) => {
    if (!complaintId) return;
    navigate(`/superadmin/complaints/${complaintId}`);
  };

  const exportComplaints = async () => {
    try {
      const params = new URLSearchParams({ ...filters, format: "csv" });
      const url = `http://localhost:4000/api/v1/superadmin/reports/complaints?${params}`;
      window.open(url, "_blank");
      toast.success("Complaints exported successfully!");
    } catch {
      toast.error("Failed to export complaints");
    }
  };

  // Table columns configuration (SLA & Zone removed, no priority color)
  const columns = [
    {
      key: "title",
      title: "Complaint",
      sortable: true,
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">{value}</div>
          <div className="text-sm text-gray-500 truncate">{row.category}</div>
        </div>
      ),
    },
    {
      key: "departmentName",
      title: "Department",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
            value
          )}`}
        >
          {value.replace("_", " ").toUpperCase()}
        </span>
      ),
    },
    {
      key: "priority",
      title: "Priority",
      sortable: true,
      render: (value) => <span className="text-xs">{value.toUpperCase()}</span>,
    },
    {
      key: "createdAt",
      title: "Created",
      sortable: true,
      render: (value) => (
        <div>
          <div className="text-sm text-gray-900">{formatDateTime(value)}</div>
          <div className="text-xs text-gray-500"></div>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (value, row) => (
        <button
          onClick={() => handleViewComplaint(row._id || row.id)}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </button>
      ),
    },
  ];

  if (error) {
    return (
      <SuperAdminLayout title="All Complaints">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700">
              Error loading complaints: {error}
            </span>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout title="All Complaints" onRefresh={refetch}>
      <div className="space-y-6">
        {/* Filters Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Complaints List ({formatNumber(complaintsData?.total || 0)} total)
          </h2>

          <div className="flex items-center space-x-2">
            <button
              onClick={refetch}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportComplaints}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table (responsive) */}
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={complaintsData?.items || []}
            currentPage={complaintsData?.page || 1}
            totalPages={Math.ceil(
              (complaintsData?.total || 0) / (complaintsData?.limit || 20)
            )}
            totalItems={complaintsData?.total || 0}
            itemsPerPage={complaintsData?.limit || 20}
            onPageChange={handlePageChange}
            onSort={handleSort}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            loading={loading}
          />
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ComplaintsList;
