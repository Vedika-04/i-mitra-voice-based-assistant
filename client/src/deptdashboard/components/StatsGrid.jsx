// components/StatsGrid.jsx
import StatsCard from "./StatsCard.jsx";

const StatsGrid = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const resolvedPercentage =
    stats?.totalComplaints > 0
      ? Math.round((stats.resolved / stats.totalComplaints) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Complaints"
        count={stats?.totalComplaints || 0}
        icon="📊"
        color="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200"
        trend="+12% from last month"
        trendColor="text-green-600"
      />
      <StatsCard
        title="In Progress"
        count={stats?.in_progress || 0}
        icon="🔄"
        color="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 border-amber-200"
        trend="Active processing"
        trendColor="text-blue-600"
      />
      <StatsCard
        title="Resolved"
        count={stats?.resolved || 0}
        icon="✅"
        color="bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200"
        trend={`${resolvedPercentage}% success rate`}
        trendColor="text-emerald-600"
      />
      <StatsCard
        title="Escalated"
        count={stats?.escalated || 0}
        icon="⚠️"
        color="bg-gradient-to-br from-red-50 to-red-100 text-red-700 border-red-200"
        trend={stats?.escalated > 0 ? "Needs attention" : "All clear"}
        trendColor={stats?.escalated > 0 ? "text-red-600" : "text-green-600"}
      />
    </div>
  );
};

export default StatsGrid;
