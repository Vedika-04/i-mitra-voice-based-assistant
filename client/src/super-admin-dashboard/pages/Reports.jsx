import React, { useState } from "react";
import { SuperAdminLayout } from "../components/layout";
import { LoadingSpinner } from "../components/ui";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Sparkles,
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { DEPARTMENTS } from "../utils/constants";
import axios from "axios";
import { toast } from "react-toastify";

const Reports = () => {
  const [filters, setFilters] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T"),
    departmentName: "",
    zone: "",
  });

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const exportReport = async (type, format = "csv") => {
    try {
      const params = new URLSearchParams({ ...filters, format });
      const url = `http://localhost:4000/api/v1/superadmin/reports/${type}?${params}`;

      if (format === "csv") {
        window.open(url, "_blank");
        toast.success(`${type} report downloaded successfully!`);
      } else {
        const response = await axios.get(url, { withCredentials: true });
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: "application/json",
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${type}-report.json`;
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        toast.success(`${type} JSON report downloaded successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to download ${type} report`);
    }
  };

  const generateAIAnalysis = async () => {
    if (!selectedDepartment) {
      toast.error("Please select a department for AI analysis");
      return;
    }

    setAiLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        departmentName: selectedDepartment,
      });
      const response = await axios.get(
        `http://localhost:4000/api/v1/superadmin/analytics/ai/department?${params}`,
        { withCredentials: true }
      );

      setAiAnalysis(response.data);
      toast.success("AI analysis generated successfully!");
    } catch (error) {
      toast.error("Failed to generate AI analysis");
      console.error("AI Analysis error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const reportTypes = [
    {
      id: "complaints",
      title: "Complaints Report",
      description: "Detailed list of all complaints with filters",
      icon: FileText,
      color: "blue",
    },
    {
      id: "departments",
      title: "Department Analytics",
      description: "Performance metrics by department",
      icon: Building2,
      color: "green",
    },
    {
      id: "zones",
      title: "Zone Analytics",
      description: "Geographic performance analysis",
      icon: MapPin,
      color: "purple",
    },
    {
      id: "escalations",
      title: "Escalation Report",
      description: "All escalated complaints with details",
      icon: AlertTriangle,
      color: "red",
    },
    {
      id: "resolutions",
      title: "Resolution Report",
      description: "Resolved complaints with timings",
      icon: CheckCircle,
      color: "emerald",
    },
  ];

  return (
    <SuperAdminLayout title="Reports & AI Analysis">
      <div className="space-y-6">
        {/* Filters Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Report Filters
            </h3>
            <button
              onClick={() =>
                setFilters({
                  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                  to: new Date().toISOString().split("T"),
                  departmentName: "",
                  zone: "",
                })
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                From Date
              </label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                To Date
              </label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                Department
              </label>
              <select
                value={filters.departmentName}
                onChange={(e) =>
                  handleFilterChange("departmentName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Format
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              >
                <option value="csv">CSV Format</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div
                      className={`p-2 rounded-lg bg-${report.color}-50 border border-${report.color}-200`}
                    >
                      <report.icon
                        className={`w-5 h-5 text-${report.color}-600`}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 ml-3">
                      {report.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {report.description}
                  </p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => exportReport(report.id, "csv")}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>CSV</span>
                    </button>

                    <button
                      onClick={() => exportReport(report.id, "json")}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 border border-purple-300">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-800">
                  AI-Powered Department Analysis
                </h3>
                <p className="text-gray-600">
                  Get intelligent insights and recommendations for department
                  performance
                </p>
              </div>
            </div>
          </div>

          {/* AI Controls */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Department for Analysis
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose Department...</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={generateAIAnalysis}
                  disabled={aiLoading || !selectedDepartment}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white font-medium ${
                    aiLoading || !selectedDepartment
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Results */}
          {aiAnalysis && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  AI Analysis: {aiAnalysis.department}
                </h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {aiAnalysis.aiEnabled ? "AI Powered" : "Data Driven"}
                </span>
              </div>

              {/* Key Findings */}
              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-700 mb-3">
                  Key Findings
                </h5>
                <div className="space-y-2">
                  {aiAnalysis.keyFindings?.map((finding, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-600">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-700 mb-3">
                  Department Metrics
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium">
                      Total Complaints
                    </p>
                    <p className="text-lg font-bold text-blue-800">
                      {aiAnalysis.metrics?.total || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <p className="text-xs text-red-600 font-medium">
                      SLA Breached
                    </p>
                    <p className="text-lg font-bold text-red-800">
                      {aiAnalysis.metrics?.sla?.breached || 0}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <p className="text-xs text-orange-600 font-medium">
                      Escalated
                    </p>
                    <p className="text-lg font-bold text-orange-800">
                      {aiAnalysis.metrics?.escalations?.total || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 font-medium">
                      Sample Size
                    </p>
                    <p className="text-lg font-bold text-green-800">
                      {aiAnalysis.sampleSize || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div>
                <h5 className="text-md font-semibold text-gray-700 mb-3">
                  AI Analysis Summary
                </h5>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {aiAnalysis.aiSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Reports;
