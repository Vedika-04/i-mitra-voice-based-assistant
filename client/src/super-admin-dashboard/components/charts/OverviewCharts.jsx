import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Status Distribution Bar Chart
export const StatusBarChart = ({ data }) => {
  const chartData = {
    labels: data?.status?.map((s) => s.status.toUpperCase()) || [],
    datasets: [
      {
        label: "Complaints by Status",
        data: data?.status?.map((s) => s.count) || [],
        backgroundColor: [
          "#FFA726", // pending - orange
          "#42A5F5", // in_progress - blue
          "#66BB6A", // resolved - green
          "#EF5350", // rejected - red
          "#FF7043", // escalated - deep orange
        ],
        borderColor: ["#FB8C00", "#1E88E5", "#4CAF50", "#F44336", "#FF5722"],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Complaints by Status",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
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
      y: {
        beginAtZero: true,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Priority Distribution Doughnut Chart
export const PriorityDoughnutChart = ({ data }) => {
  const chartData = {
    labels: data?.priority?.map((p) => p.priority.toUpperCase()) || [],
    datasets: [
      {
        data: data?.priority?.map((p) => p.count) || [],
        backgroundColor: [
          "#81C784", // low - light green
          "#FFB74D", // medium - orange
          "#FF8A65", // high - red orange
          "#E57373", // urgent - red
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          color: "#374151",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Priority Distribution",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
  };

  return (
    <div className="h-80 flex items-center justify-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// Department Performance Pie Chart
export const DepartmentPieChart = ({ data }) => {
  const chartData = {
    labels: data?.items?.slice(0, 6).map((d) => d.departmentName) || [],
    datasets: [
      {
        data: data?.items?.slice(0, 6).map((d) => d.totals.total) || [],
        backgroundColor: [
          "#3B82F6", // blue
          "#10B981", // emerald
          "#F59E0B", // amber
          "#EF4444", // red
          "#8B5CF6", // violet
          "#06B6D4", // cyan
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 15,
          usePointStyle: true,
          color: "#374151",
          font: {
            size: 11,
          },
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ${value}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: "Top Departments by Complaints",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-80 flex items-center justify-center">
      <Pie data={chartData} options={options} />
    </div>
  );
};
