import { useEffect, useState } from "react";
import axios from "axios";
import { useDeptContext } from "../DeptContext.jsx";
import DashboardHeader from "../layout/DeptHeader.jsx";
import StatsGrid from "../components/StatsGrid.jsx";
import RecentComplaints from "../components/RecentComplaints.jsx";
import ZoneChart from "../components/ZoneChart.jsx";
import MonthlyTrendsChart from "../components/MonthlyTrendsChart.jsx";
import MapView from "../components/MapView.jsx"; // 🆕 Add this import

const DashboardHome = () => {
  const { department } = useDeptContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/department/complaints?stats=true",
          { withCredentials: true }
        );
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Professional Header */}
      {/* <DashboardHeader /> */}

      {/* Enhanced Stats Grid */}
      <StatsGrid stats={stats} loading={loading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Complaints + Map */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Complaints Widget */}
          <RecentComplaints />

          {/* 🆕 Map View Component */}
          <MapView />
        </div>

        {/* Right Column - Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Trends Chart */}
          <MonthlyTrendsChart />

          {/* Zone Analysis Chart */}
          <ZoneChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
