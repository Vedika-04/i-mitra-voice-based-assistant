import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatsCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color = "blue",
  subtitle,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    red: "bg-red-50 border-red-200 text-red-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  const getTrendIcon = () => {
    if (changeType === "increase") return <TrendingUp className="w-4 h-4" />;
    if (changeType === "decrease") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (changeType === "increase") return "text-green-600";
    if (changeType === "decrease") return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

          {subtitle && <p className="text-sm text-gray-500 mb-2">{subtitle}</p>}

          {change && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{change}</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
