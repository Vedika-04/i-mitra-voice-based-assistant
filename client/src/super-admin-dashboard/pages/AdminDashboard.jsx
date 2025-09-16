import React, { useState } from "react";
import { SuperAdminLayout } from "../components/layout";
import { StatsCard, LoadingSpinner } from "../components/ui";
import {
  StatusBarChart,
  PriorityDoughnutChart,
  DepartmentPieChart,
  TrendsLineChart,
  SLAAreaChart,
} from "../components/charts";
import {
  useOverviewAnalytics,
  useDepartmentAnalytics,
  useTrends,
} from "../hooks/useAnalytics";
import {
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Activity,
  FileText, // Added this missing import
} from "lucide-react";
import { formatNumber, formatPercentage } from "../utils/helpers";

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T"),
  });

  const {
    data: overviewData,
    loading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useOverviewAnalytics(dateRange);

  const { data: departmentData, loading: departmentLoading } =
    useDepartmentAnalytics(dateRange);

  const { data: trendsData, loading: trendsLoading } = useTrends({
    ...dateRange,
    interval: "day",
  });

  const handleRefresh = () => {
    refetchOverview();
  };

  if (overviewLoading) {
    return (
      <SuperAdminLayout title="Dashboard">
        <LoadingSpinner size="xl" text="Loading dashboard data..." />
      </SuperAdminLayout>
    );
  }

  if (overviewError) {
    return (
      <SuperAdminLayout title="Dashboard">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading dashboard: {overviewError}
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout title="Dashboard Overview" onRefresh={handleRefresh}>
      <div className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Complaints"
            value={formatNumber(overviewData?.totals || 0)}
            change="+12.5%"
            changeType="increase"
            icon={MessageSquare}
            color="blue"
            subtitle="All time complaints"
          />

          <StatsCard
            title="Resolved"
            value={formatNumber(
              overviewData?.status?.find((s) => s.status === "resolved")
                ?.count || 0
            )}
            change="+8.2%"
            changeType="increase"
            icon={CheckCircle}
            color="green"
            subtitle={`${formatPercentage(
              ((overviewData?.status?.find((s) => s.status === "resolved")
                ?.count || 0) /
                (overviewData?.totals || 1)) *
                100
            )} resolution rate`}
          />

          <StatsCard
            title="SLA Breached"
            value={formatNumber(overviewData?.sla?.breached || 0)}
            change="-3.1%"
            changeType="decrease"
            icon={AlertTriangle}
            color="orange"
            subtitle={`${overviewData?.sla?.breachRate || 0}% breach rate`}
          />

          <StatsCard
            title="Escalated"
            value={formatNumber(overviewData?.escalations?.total || 0)}
            change="+2.4%"
            changeType="increase"
            icon={Clock}
            color="red"
            subtitle="Require attention"
          />
        </div>

        {/* Charts Grid - Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Status Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Status Distribution
              </h3>
            </div>
            {overviewLoading ? (
              <LoadingSpinner text="Loading chart..." />
            ) : (
              <StatusBarChart data={overviewData} />
            )}
          </div>

          {/* Chart 2: Priority Doughnut Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Priority Breakdown
              </h3>
            </div>
            {overviewLoading ? (
              <LoadingSpinner text="Loading chart..." />
            ) : (
              <PriorityDoughnutChart data={overviewData} />
            )}
          </div>
        </div>

        {/* Charts Grid - Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: Department Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Department Performance
              </h3>
            </div>
            {departmentLoading ? (
              <LoadingSpinner text="Loading chart..." />
            ) : (
              <DepartmentPieChart data={departmentData} />
            )}
          </div>

          {/* Chart 4: Trends Line Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Daily Trends
              </h3>
            </div>
            {trendsLoading ? (
              <LoadingSpinner text="Loading chart..." />
            ) : (
              <TrendsLineChart data={trendsData} />
            )}
          </div>
        </div>

        {/* Charts Grid - Bottom Row */}
        <div className="grid grid-cols-1 gap-6">
          {/* Chart 5: SLA Area Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                SLA Performance Analysis
              </h3>
              <div className="text-sm text-gray-500">
                Last 30 days performance tracking
              </div>
            </div>
            {trendsLoading ? (
              <LoadingSpinner text="Loading chart..." />
            ) : (
              <SLAAreaChart data={trendsData} />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  View Analytics
                </p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  Generate Report
                </p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  View All Complaints
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminDashboard;
