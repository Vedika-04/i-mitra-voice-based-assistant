import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const STATUS_COLORS = {
  pending: "#fbbf24", // yellow-400
  in_progress: "#3b82f6", // blue-500
  resolved: "#22c55e", // green-500
  rejected: "#6b7280", // gray-500
  escalated: "#ef4444", // red-500
};

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
  escalated: "Escalated",
};

const ZoneChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [zonesData, setZonesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopZonesData = async () => {
      try {
        setLoading(true);

        // First get the top 4 zones by total complaints
        const statsRes = await axios.get(
          "http://localhost:4000/api/v1/department/complaints?stats=true",
          { withCredentials: true }
        );

        const allZones = statsRes.data.zoneStats || [];

        // ✅ FILTER OUT zones with null, empty, or whitespace-only names
        const validZones = allZones.filter((zoneStat) => {
          const zoneName = zoneStat.zone;
          return (
            zoneName &&
            zoneName.trim() !== "" &&
            zoneName.toLowerCase() !== "null" &&
            zoneName.toLowerCase() !== "undefined"
          );
        });

        const top4Zones = validZones
          .sort((a, b) => b.total - a.total)
          .slice(0, 4);

        // Now fetch detailed status breakdown for each of these top 4 zones
        const detailedZonesPromises = top4Zones.map(async (zone) => {
          try {
            const zoneStatusRes = await axios.get(
              `http://localhost:4000/api/v1/department/complaints/status-by-zone?zone=${encodeURIComponent(
                zone.zone
              )}`,
              { withCredentials: true }
            );

            return {
              zone: zone.zone,
              ...zoneStatusRes.data.counts,
            };
          } catch (error) {
            // If individual zone fetch fails, return zone with zero counts
            return {
              zone: zone.zone,
              pending: 0,
              in_progress: 0,
              resolved: 0,
              rejected: 0,
              escalated: 0,
            };
          }
        });

        const detailedZones = await Promise.all(detailedZonesPromises);
        setZonesData(detailedZones);
      } catch (error) {
        console.error("Error fetching zones data:", error);
        setZonesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopZonesData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || zonesData.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext("2d");

    // Prepare zone labels (shorten if too long)
    const zoneLabels = zonesData.map((zone) => {
      const zoneName = zone.zone || "Unknown Zone";
      return zoneName.length > 20
        ? zoneName.substring(0, 20) + "..."
        : zoneName;
    });

    // Create datasets for each status
    const statuses = Object.keys(STATUS_COLORS);
    const datasets = statuses.map((status) => ({
      label: STATUS_LABELS[status],
      data: zonesData.map((zone) => zone[status] || 0),
      backgroundColor: STATUS_COLORS[status],
      borderColor: STATUS_COLORS[status],
      borderWidth: 1,
      borderRadius: 4,
    }));

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: zoneLabels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12,
                weight: "500",
              },
            },
          },
          title: {
            display: true,
            text: "Complaint Status Breakdown - Top 4 Zones",
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              font: {
                size: 11,
              },
            },
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: {
                size: 11,
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [zonesData]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading top zones analysis...</p>
        </div>
      ) : zonesData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Valid Zone Data
          </h3>
          <p className="text-gray-500">
            No complaints found with valid zone information.
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Zone-wise Complaint Analysis
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Status breakdown for top {zonesData.length} zones by complaint
                volume
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-blue-800">
                  Valid Zones: {zonesData.length}
                </span>
              </div>
            </div>
          </div>

          {/* Stacked Bar Chart */}
          <div className="relative">
            <div style={{ height: "400px" }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          {/* Zone Summary */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {zonesData.map((zone, index) => {
              const total = Object.keys(STATUS_COLORS).reduce(
                (sum, status) => sum + (zone[status] || 0),
                0
              );
              const escalatedPercent =
                total > 0 ? Math.round((zone.escalated / total) * 100) : 0;

              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-blue-600">
                      #{index + 1}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        escalatedPercent > 10
                          ? "bg-red-100 text-red-800"
                          : escalatedPercent > 5
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {escalatedPercent}% escalated
                    </span>
                  </div>
                  <h4
                    className="font-medium text-gray-900 text-sm mb-2 truncate"
                    title={zone.zone}
                  >
                    {zone.zone}
                  </h4>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-semibold">{total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolved:</span>
                      <span className="font-semibold text-green-600">
                        {zone.resolved || 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ZoneChart;
