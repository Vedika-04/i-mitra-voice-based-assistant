import React from "react";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";

// Trends Line Chart
export const TrendsLineChart = ({ data }) => {
  const chartData = {
    labels:
      data?.created?.map((item) => {
        // Format based on interval
        const date = new Date(item.bucket);
        return format(date, "MMM dd");
      }) || [],
    datasets: [
      {
        label: "Created",
        data: data?.created?.map((item) => item.count) || [],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Resolved",
        data: data?.resolved?.map((item) => item.count) || [],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#10B981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Escalated",
        data: data?.escalated?.map((item) => item.count) || [],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#EF4444",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: "Complaint Trends Over Time",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
      },
      legend: {
        position: "top",
        labels: {
          color: "#374151",
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

// SLA Performance Area Chart
export const SLAAreaChart = ({ data }) => {
  const chartData = {
    labels:
      data?.created?.map((item) => {
        const date = new Date(item.bucket);
        return format(date, "MMM dd");
      }) || [],
    datasets: [
      {
        label: "Total Complaints",
        data: data?.created?.map((item) => item.count) || [],
        borderColor: "#06B6D4",
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#06B6D4",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: "SLA Breached",
        data: data?.slaBreached?.map((item) => item.count) || [],
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.3)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#F59E0B",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: "SLA Performance Trends",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
      },
      legend: {
        position: "top",
        labels: {
          color: "#374151",
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
      filler: {
        propagate: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
        stacked: false,
      },
    },
    elements: {
      line: {
        fill: true,
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};
