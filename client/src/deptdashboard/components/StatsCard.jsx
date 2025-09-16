// components/StatsCard.jsx
const StatsCard = ({ title, count, icon, color, trend, trendColor }) => {
  return (
    <div
      className={`${color} rounded-xl shadow-sm p-6 border hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{count}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trendColor} font-medium`}>{trend}</p>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
