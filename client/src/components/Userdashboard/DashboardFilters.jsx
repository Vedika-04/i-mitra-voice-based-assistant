import React, { useState } from "react";

const DashboardFilters = ({ onFilter }) => {
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    onFilter({
      status,
      department,
      startDate,
      endDate,
    });
  };

  const handleReset = () => {
    setStatus("");
    setDepartment("");
    setStartDate("");
    setEndDate("");
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end mb-4">
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Department</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department"
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block border rounded px-2 py-1"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DashboardFilters;
