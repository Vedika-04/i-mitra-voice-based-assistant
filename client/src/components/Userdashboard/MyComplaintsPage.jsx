import React, { useEffect, useState, useContext } from "react";
import Header from "./layout/Header.jsx";
import Navbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";
import axios from "axios";
import { Context } from "../../main.jsx";
import ComplaintsTable from "./ComplaintsTable.jsx";

const MyComplaintsPage = () => {
  const { user } = useContext(Context);
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({ status: "all", department: "all" });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/complaint/my",
          {
            params: { page: 1, limit: 1000 },
            withCredentials: true,
          }
        );
        setComplaints(res.data.complaints || []);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const statusMatch = filters.status === "all" || c.status === filters.status;
    const deptMatch =
      filters.department === "all" || c.departmentName === filters.department;
    return statusMatch && deptMatch;
  });

  // get unique departments for filter dropdown
  const departments = [...new Set(complaints.map((c) => c.departmentName))];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">My Complaints</h1>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <select
              className="border rounded p-2"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>

            <select
              className="border rounded p-2"
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <ComplaintsTable
            complaints={filteredComplaints}
            title="All Complaints"
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MyComplaintsPage;
