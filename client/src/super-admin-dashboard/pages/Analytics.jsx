import React, { useState } from "react";
import { SuperAdminLayout } from "../components/layout";
import { StatsCard, LoadingSpinner } from "../components/ui";
import { StatusBarChart, PriorityDoughnutChart } from "../components/charts";
import {
  useDepartmentAnalytics,
  useZoneAnalytics,
  useEscalationAnalytics,
} from "../hooks/useAnalytics";
import {
  Building2,
  MapPin,
  AlertTriangle,
  Filter,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { formatNumber, formatPercentage } from "../utils/helpers";
import { DEPARTMENTS, ZONES } from "../utils/constants";

const Analytics = () => {
  const [filters, setFilters] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T"), // Fixed: Added
    departmentName: "",
    zone: "",
  });

  const [activeTab, setActiveTab] = useState("departments");

  const {
    data: departmentData,
    loading: departmentLoading,
    refetch: refetchDepartments,
  } = useDepartmentAnalytics(filters);

  const {
    data: zoneData,
    loading: zoneLoading,
    refetch: refetchZones,
  } = useZoneAnalytics(filters);

  const { data: escalationData, loading: escalationLoading } =
    useEscalationAnalytics(filters);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleRefresh = () => {
    refetchDepartments();
    refetchZones();
  };

  const exportData = async (type) => {
    const params = new URLSearchParams(filters);
    const url = `http://localhost:4000/api/v1/superadmin/reports/${type}?${params}&format=csv`;
    window.open(url, "_blank");
  };

  const tabs = [
    { id: "departments", name: "Departments", icon: Building2 },
    { id: "zones", name: "Zones", icon: MapPin },
    { id: "escalations", name: "Escalations", icon: AlertTriangle },
  ];

  return (
    <SuperAdminLayout title="Advanced Analytics" onRefresh={handleRefresh}>
      <div className="space-y-6">
        {/* Filters Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            <button
              onClick={() =>
                setFilters({
                  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                  to: new Date().toISOString().split("T"), // Fixed: Added
                  departmentName: "",
                  zone: "",
                })
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                Zone
              </label>
              <select
                value={filters.zone}
                onChange={(e) => handleFilterChange("zone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 py-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Departments Tab */}
            {activeTab === "departments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Department Performance
                  </h3>
                  <button
                    onClick={() => exportData("departments")}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {departmentLoading ? (
                  <LoadingSpinner text="Loading department analytics..." />
                ) : (
                  <>
                    {/* Department Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">
                              Active Departments
                            </p>
                            <p className="text-2xl font-bold text-blue-800">
                              {departmentData?.items?.length || 0}
                            </p>
                          </div>
                          <Building2 className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">
                              Best Performer
                            </p>
                            <p className="text-lg font-bold text-green-800">
                              {/* Fixed: Added length check and initial value */}
                              {(() => {
                                if (!departmentData?.items?.length)
                                  return "N/A";

                                // Find department with minimum SLA breach rate
                                const bestDept = departmentData.items.reduce(
                                  (best, current) => {
                                    // If current department has lower breach rate, it's better
                                    return current.sla.breachRate <
                                      best.sla.breachRate
                                      ? current
                                      : best;
                                  }
                                );

                                return bestDept?.departmentName || "N/A";
                              })()}
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-600 text-sm font-medium">
                              Avg SLA Breach
                            </p>
                            <p className="text-2xl font-bold text-orange-800">
                              {/* Fixed: Added length check */}
                              {formatPercentage(
                                departmentData?.items?.length > 0
                                  ? departmentData.items.reduce(
                                      (sum, dept) => sum + dept.sla.breachRate,
                                      0
                                    ) / departmentData.items.length
                                  : 0
                              )}
                            </p>
                          </div>
                          <Clock className="w-8 h-8 text-orange-600" />
                        </div>
                      </div>
                    </div>

                    {/* Department Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Resolved
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Escalated
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SLA Breach
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Avg Resolution
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {departmentData?.items?.map((dept, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                                  <div className="text-sm font-medium text-gray-900">
                                    {dept.departmentName}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatNumber(dept.totals.total)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {formatNumber(dept.totals.resolved)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {formatNumber(dept.totals.escalated)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="text-sm text-gray-900">
                                    {formatPercentage(dept.sla.breachRate)}
                                  </div>
                                  <div
                                    className={`ml-2 w-16 bg-gray-200 rounded-full h-2`}
                                  >
                                    <div
                                      className={`h-2 rounded-full ${
                                        dept.sla.breachRate > 15
                                          ? "bg-red-500"
                                          : dept.sla.breachRate > 10
                                          ? "bg-orange-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          dept.sla.breachRate * 2,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {dept.resolution.avgHours
                                  ? `${dept.resolution.avgHours}h`
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Zones Tab */}
            {activeTab === "zones" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Zone Performance
                  </h3>
                  <button
                    onClick={() => exportData("zones")}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {zoneLoading ? (
                  <LoadingSpinner text="Loading zone analytics..." />
                ) : (
                  <>
                    {/* Zone Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-600 text-sm font-medium">
                              Active Zones
                            </p>
                            <p className="text-2xl font-bold text-purple-800">
                              {zoneData?.items?.length || 0}
                            </p>
                          </div>
                          <MapPin className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">
                              Most Active Zone
                            </p>
                            <p className="text-sm font-bold text-blue-800">
                              {/* Fixed: Added length check and initial value */}
                              {zoneData?.items?.length > 0
                                ? zoneData.items
                                    .reduce(
                                      (max, current) =>
                                        current.totals.total >
                                        (max?.totals.total || 0)
                                          ? current
                                          : max,
                                      zoneData.items[0]
                                    )
                                    ?.zone?.substring(0, 20) + "..." || "N/A"
                                : "N/A"}
                            </p>
                          </div>
                          <BarChart3 className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">
                              Best Zone
                            </p>
                            <p className="text-sm font-bold text-green-800">
                              {/* Fixed: Added length check and initial value */}
                              {zoneData?.items?.length > 0
                                ? zoneData.items
                                    .reduce(
                                      (best, current) =>
                                        current.sla.breachRate <
                                        (best?.sla.breachRate || Infinity)
                                          ? current
                                          : best,
                                      zoneData.items[0]
                                    )
                                    ?.zone?.substring(0, 20) + "..." || "N/A"
                                : "N/A"}
                            </p>
                          </div>
                          <Users className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* Zone Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Zone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Resolved
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Escalated
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SLA Breach Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {zoneData?.items?.map((zone, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                                  <div className="text-sm font-medium text-gray-900">
                                    {zone.zone}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatNumber(zone.totals.total)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {formatNumber(zone.totals.resolved)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {formatNumber(zone.totals.escalated)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="text-sm text-gray-900">
                                    {formatPercentage(zone.sla.breachRate)}
                                  </div>
                                  <div
                                    className={`ml-2 w-16 bg-gray-200 rounded-full h-2`}
                                  >
                                    <div
                                      className={`h-2 rounded-full ${
                                        zone.sla.breachRate > 15
                                          ? "bg-red-500"
                                          : zone.sla.breachRate > 10
                                          ? "bg-orange-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          zone.sla.breachRate * 2,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Escalations Tab */}
            {activeTab === "escalations" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Escalation Analysis
                  </h3>
                  <button
                    onClick={() => exportData("escalations")}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {escalationLoading ? (
                  <LoadingSpinner text="Loading escalation analytics..." />
                ) : (
                  <>
                    {/* Escalation Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <StatsCard
                        title="Total Escalated"
                        value={formatNumber(
                          escalationData?.totals?.escalated || 0
                        )}
                        icon={AlertTriangle}
                        color="red"
                        subtitle={`${formatPercentage(
                          escalationData?.totals?.escalationRate || 0
                        )} escalation rate`}
                      />

                      <StatsCard
                        title="System Escalated"
                        value={formatNumber(
                          escalationData?.totals?.system || 0
                        )}
                        icon={Clock}
                        color="orange"
                        subtitle="Auto-escalated due to SLA"
                      />

                      <StatsCard
                        title="Officer Escalated"
                        value={formatNumber(
                          escalationData?.totals?.officer || 0
                        )}
                        icon={Users}
                        color="blue"
                        subtitle="Manually escalated"
                      />

                      <StatsCard
                        title="Total Complaints"
                        value={formatNumber(escalationData?.totals?.total || 0)}
                        icon={BarChart3}
                        color="green"
                        subtitle="Baseline for calculations"
                      />
                    </div>

                    {/* Department Escalation Table */}
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900">
                          Department Escalation Rates
                        </h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Escalated
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                System
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Officer
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rate
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {escalationData?.byDepartment?.map(
                              (dept, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                                      <div className="text-sm font-medium text-gray-900">
                                        {dept.departmentName}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatNumber(dept.total)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      {formatNumber(dept.escalated)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatNumber(dept.system)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatNumber(dept.officer)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="text-sm text-gray-900">
                                        {formatPercentage(dept.rate)}
                                      </div>
                                      <div
                                        className={`ml-2 w-16 bg-gray-200 rounded-full h-2`}
                                      >
                                        <div
                                          className={`h-2 rounded-full ${
                                            dept.rate > 15
                                              ? "bg-red-500"
                                              : dept.rate > 10
                                              ? "bg-orange-500"
                                              : "bg-green-500"
                                          }`}
                                          style={{
                                            width: `${Math.min(
                                              dept.rate * 2,
                                              100
                                            )}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Analytics;
