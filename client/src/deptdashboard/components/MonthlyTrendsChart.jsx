// components/MonthlyTrendsChart.jsx
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const MonthlyTrendsChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/department/complaints/monthly-trends",
          { withCredentials: true }
        );
        setMonthlyData(res.data.monthlyData || []);
      } catch (error) {
        console.error("Error fetching trends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading || monthlyData.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const months = monthlyData.map((item) =>
      new Date(item._id.year, item._id.month - 1).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      })
    );

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Complaints Received",
            data: monthlyData.map((item) => item.totalComplaints),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Complaints Resolved",
            data: monthlyData.map((item) => item.resolvedComplaints),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "6-Month Complaint Trends",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyData, loading]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance Trends
      </h3>
      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div style={{ height: "320px" }}>
          <canvas ref={chartRef}></canvas>
        </div>
      )}
    </div>
  );
};

export default MonthlyTrendsChart;
