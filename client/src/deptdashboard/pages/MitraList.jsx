import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MitraRow from "../components/MitraRow.jsx";

const MitraList = () => {
  const [mitras, setMitras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");

  useEffect(() => {
    const fetchMitras = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (zoneFilter) params.append("zone", zoneFilter);

        const res = await axios.get(
          `http://localhost:4000/api/v1/department/mitra?${params.toString()}`,
          { withCredentials: true }
        );
        setMitras(res.data.mitras || []);
      } catch (error) {
        console.error("Error fetching mitras:", error);
        setMitras([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMitras();
  }, [searchTerm, zoneFilter]);

  const ZONES = [
    "Dr. Hedgewar (Kila Maidan) Zone",
    "Lal Bahadur Shastri (Raj Mohalla) Zone",
    "Shaheed Bhagat Singh (Nagar Nigam) Zone",
    "Maharana Pratap (Sangam Nagar) Zone",
    "Chandragupta Maurya (Sukhaliya) Zone",
    "Subhash Chandra Bose (Subhash Nagar) Zone",
    "Atal Bihari Vajpayee (Scheme No. 54) Zone",
    "Chandrashekhar Azad (Vijay Nagar) Zone",
    "Dr. Bhimrao Ambedkar (Pancham ki fel) Zone",
    "Dr. Shyamaprasad Mukherjee (Saket Nagar) Zone",
    "Rajmata Scindia (Stadium) Zone",
    "Harsiddhi Zone",
    "Pt. Deendayal Upadhyay (Bilawali) Zone",
    "Rajendra Dharkar (Hawa Bungalow) Zone",
    "Laxman Singh Gaud (David Nagar) Zone",
    "Kushabhau Thackeray (Aerodrome Road) Zone",
    "Mahatma Gandhi (Narwal) Zone",
    "Chhatrapati Shivaji (Krishi Vihar) Zone",
    "Sardar Vallabhbhai Patel (Scheme No. 94) Zone",
    "Rajmata Jeejabai Zone",
    "Swatantra Veer Vinayak Damodar Sawarkar (Pragati Nagar Zone)",
    "Gen. Harisingh Nalwa (Bombay Hospital Water tank zone)",
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Department Mitras</h2>
        <Link
          to="/department/mitras/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Register New Mitra
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Mitras
            </label>
            <input
              type="text"
              placeholder="Search by name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Zone
            </label>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Zones</option>
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mitras List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : mitras.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Mitras Found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || zoneFilter
              ? "Try adjusting your filters"
              : "Register the first Mitra for your department"}
          </p>
          <Link
            to="/department/mitras/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Register New Mitra
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mitra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mitras.map((mitra) => (
                <MitraRow key={mitra._id} mitra={mitra} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MitraList;
