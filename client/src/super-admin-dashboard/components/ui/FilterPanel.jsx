import React from "react";
import {
  Filter,
  X,
  Calendar,
  Building2,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { DEPARTMENTS, ZONES } from "../../utils/constants";

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
    { value: "escalated", label: "Escalated" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            From Date
          </label>
          <input
            type="date"
            value={filters.from || ""}
            onChange={(e) => onFilterChange("from", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            To Date
          </label>
          <input
            type="date"
            value={filters.to || ""}
            onChange={(e) => onFilterChange("to", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={filters.priority || ""}
            onChange={(e) => onFilterChange("priority", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-1" />
            Department
          </label>
          <select
            value={filters.departmentName || ""}
            onChange={(e) => onFilterChange("departmentName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Zone
          </label>
          <select
            value={filters.zone || ""}
            onChange={(e) => onFilterChange("zone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Zones</option>
            {ZONES.slice(0, 10).map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Quick Filters:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onFilterChange(
                "breachedOnly",
                filters.breachedOnly === "true" ? "" : "true"
              )
            }
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              filters.breachedOnly === "true"
                ? "bg-red-100 text-red-800 border-red-300"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            SLA Breached Only
          </button>

          <button
            onClick={() =>
              onFilterChange(
                "escalatedOnly",
                filters.escalatedOnly === "true" ? "" : "true"
              )
            }
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              filters.escalatedOnly === "true"
                ? "bg-orange-100 text-orange-800 border-orange-300"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            Escalated Only
          </button>

          <button
            onClick={() =>
              onFilterChange(
                "withMediaOnly",
                filters.withMediaOnly === "true" ? "" : "true"
              )
            }
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              filters.withMediaOnly === "true"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            With Media Only
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
