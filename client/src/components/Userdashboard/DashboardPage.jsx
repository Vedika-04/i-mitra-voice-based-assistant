import React, { useEffect, useState, useContext } from "react";
import Header from "./layout/Header.jsx";
import Navbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";
import StateCard from "./cards/StateCard.jsx";
import axios from "axios";
import { Context } from "../../main.jsx";
import ComplaintsTable from "./ComplaintsTable.jsx";

const DashboardPage = () => {
  const { user } = useContext(Context);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    escalated: 0,
  });
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/complaint/my",
          {
            params: { page: 1, limit: 1000 },
            withCredentials: true,
          }
        );
        const allComplaints = res.data.complaints || [];

        const pending = allComplaints.filter(
          (c) => c.status === "pending"
        ).length;
        const resolved = allComplaints.filter(
          (c) => c.status === "resolved"
        ).length;
        const escalated = allComplaints.filter(
          (c) => c.escalation?.length > 0
        ).length;
        const total = allComplaints.length;

        setStats({ total, pending, resolved, escalated });
        setComplaints(allComplaints);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  // Filter for unresolved top 5 complaints
  const unresolvedTop5 = complaints
    .filter((c) => c.status !== "resolved")
    .slice(0, 5);

  const resolvedComplaints = complaints.filter((c) => c.status === "resolved");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* State Cards */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <StateCard
              title="Total Complaints"
              count={stats.total}
              color="border-green-600"
            />
            <StateCard
              title="Pending"
              count={stats.pending}
              color="border-yellow-500"
            />
            <StateCard
              title="Resolved"
              count={stats.resolved}
              color="border-blue-500"
            />
            <StateCard
              title="Escalated"
              count={stats.escalated}
              color="border-red-500"
            />
          </div>

          {/* Top 5 Unresolved Complaints */}
          <ComplaintsTable
            complaints={unresolvedTop5}
            title="Top 5 Unresolved Complaints"
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
