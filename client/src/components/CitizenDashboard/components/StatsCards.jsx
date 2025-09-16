export default function StatsCards({ stats }) {
  const resolvedCount = stats.find((s) => s._id === "resolved")?.count || 0;
  const pendingCount = stats.find((s) => s._id === "pending")?.count || 0;
  const inProgressCount =
    stats.find((s) => s._id === "in_progress")?.count || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-gray-500 text-sm">Total Complaints</h3>
        <p className="text-2xl font-bold mt-1">
          {resolvedCount + pendingCount + inProgressCount}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-gray-500 text-sm">Resolved</h3>
        <p className="text-2xl font-bold text-green-600 mt-1">
          {resolvedCount}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-gray-500 text-sm">Pending Resolution</h3>
        <p className="text-2xl font-bold text-yellow-600 mt-1">
          {pendingCount + inProgressCount}
        </p>
      </div>
    </div>
  );
}
