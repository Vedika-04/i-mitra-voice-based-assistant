import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import axios from "axios";

const BASE = "http://localhost:4000/api/v1/complaint";

const STATUS_COLORS = {
  pending: "#f59e0b", // amber-500
  in_progress: "#3b82f6", // blue-500
  resolved: "#10b981", // emerald-500
  rejected: "#ef4444", // red-500
  escalated: "#8b5cf6", // violet-500
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatusChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    axios
      .get(`${BASE}/my`, { withCredentials: true })
      .then((res) => {
        if (!active) return;
        const complaints = res?.data?.complaints || [];

        // Count each status
        const counts = {};
        complaints.forEach((c) => {
          const status = (c.status || "unknown").toLowerCase();
          counts[status] = (counts[status] || 0) + 1;
        });

        // Create chart data
        const chartData = Object.keys(STATUS_COLORS).map((status) => ({
          name: status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          value: counts[status] || 0,
          color: STATUS_COLORS[status],
        }));

        setData(chartData.filter((d) => d.value > 0));
      })
      .catch(() => {
        if (!active) return;
        setError(true);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Status Overview</h3>
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Status Overview</h3>
        <div className="flex h-64 items-center justify-center text-red-500">
          Failed to load complaint data
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Status Overview</h3>
        <div className="flex h-64 items-center justify-center text-gray-500">
          No complaints found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Status Overview</h3>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
          Distribution
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              animationDuration={500}
              animationBegin={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} complaints`, "Count"]}
              labelFormatter={(label) => `Status: ${label}`}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value, entry, index) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center text-xs text-gray-500">
        Hover over segments for details
      </div>
    </div>
  );
};

export default StatusChart;
