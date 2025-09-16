export default function FilterBar({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: "",
      department: "",
      fromDate: "",
      toDate: "",
      page: 1,
      limit: 10,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, status: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={localFilters.department}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, department: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">All Departments</option>
            <option value="Public Works">Public Works</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={localFilters.fromDate}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, fromDate: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={localFilters.toDate}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, toDate: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
