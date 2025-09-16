// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { X, MapPin, Filter, Building2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Fix for default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// // Custom colored marker icons
// const greenIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const redIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const blueIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const orangeIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// // Component to fix map size issues
// const MapSizer = () => {
//   const map = useMap();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       map.invalidateSize();
//     }, 100);
//     return () => clearTimeout(timer);
//   }, [map]);

//   return null;
// };

// const HeatMapView = () => {
//   const navigate = useNavigate();
//   const [markers, setMarkers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     departmentName: "",
//     status: "",
//     priority: "",
//   });
//   const [stats, setStats] = useState({
//     total: 0,
//     resolved: 0,
//     escalated: 0,
//     pending: 0,
//     inProgress: 0,
//   });

//   // Fetch heat map data
//   const fetchHeatMapData = async () => {
//     try {
//       setLoading(true);

//       // Build query parameters
//       const params = new URLSearchParams();
//       params.append("limit", "1000");
//       if (filters.departmentName)
//         params.append("departmentName", filters.departmentName);
//       if (filters.status) params.append("status", filters.status);
//       if (filters.priority) params.append("priority", filters.priority);

//       console.log(
//         "Fetching from:",
//         `http://localhost:4000/api/v1/superadmin/getheatmap?${params}`
//       );

//       const response = await axios.get(
//         `http://localhost:4000/api/v1/superadmin/getheatmap?${params}`,
//         { withCredentials: true }
//       );

//       console.log("Heat Map API Response:", response.data);

//       if (response.data.success) {
//         const complaints = response.data.complaints || [];
//         console.log(
//           `Received ${complaints.length} complaints with location data`
//         );

//         // Create markers from complaints
//         const mapMarkers = complaints.map((complaint) => {
//           // Determine icon color based on status
//           let icon = blueIcon; // default for pending
//           switch (complaint.status) {
//             case "resolved":
//               icon = greenIcon;
//               break;
//             case "escalated":
//               icon = redIcon;
//               break;
//             case "in_progress":
//               icon = orangeIcon;
//               break;
//             default:
//               icon = blueIcon;
//           }

//           return {
//             id: complaint._id,
//             position: [
//               parseFloat(complaint.location.lat),
//               parseFloat(complaint.location.lng),
//             ],
//             icon: icon,
//             title: complaint.title || "No Title",
//             status: complaint.status || "pending",
//             priority: complaint.priority || "medium",
//             department: complaint.departmentName || "Unknown",
//             createdAt: complaint.createdAt,
//             gmapLink:
//               complaint.location.gmapLink ||
//               `https://maps.google.com/?q=${complaint.location.lat},${complaint.location.lng}`,
//           };
//         });

//         console.log(`Created ${mapMarkers.length} markers for map`);
//         setMarkers(mapMarkers);

//         // Calculate stats
//         setStats({
//           total: complaints.length,
//           resolved: complaints.filter((c) => c.status === "resolved").length,
//           escalated: complaints.filter((c) => c.status === "escalated").length,
//           pending: complaints.filter((c) => c.status === "pending").length,
//           inProgress: complaints.filter((c) => c.status === "in_progress")
//             .length,
//         });

//         toast.success(
//           `Heat map loaded with ${mapMarkers.length} complaint locations`
//         );
//       } else {
//         console.error("API returned error:", response.data.message);
//         toast.error(response.data.message || "Failed to load heat map data");
//         setMarkers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching heat map data:", error);

//       if (error.response?.status === 401) {
//         toast.error("Authentication required. Please login again.");
//         navigate("/superadmin/login");
//       } else if (error.response?.status === 403) {
//         toast.error("Access denied. Insufficient permissions.");
//       } else {
//         toast.error("Failed to load heat map data");
//       }

//       setMarkers([]);
//       setStats({
//         total: 0,
//         resolved: 0,
//         escalated: 0,
//         pending: 0,
//         inProgress: 0,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load data on component mount and filter changes
//   useEffect(() => {
//     fetchHeatMapData();
//   }, [filters]);

//   // Handle filter changes
//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   // Close heat map and go back
//   const handleClose = () => {
//     navigate(-1);
//   };

//   // Map center - Indore, Madhya Pradesh
//   const mapCenter = [22.7196, 75.8577];

//   return (
//     <div
//       style={{ height: "100vh", width: "100vw" }}
//       className="fixed inset-0 z-50 bg-white"
//     >
//       {/* Header */}
//       <div className="bg-gradient-to-r from-slate-900 to-gray-900 text-white p-4 shadow-lg">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//               <MapPin className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold">i-Mitra Heat Map 🔥</h1>
//               <p className="text-sm text-slate-300">
//                 All Department Complaints - Geographic View
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleClose}
//             className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
//           <div className="bg-slate-800 rounded-lg p-3 text-center">
//             <div className="text-2xl font-bold text-white">{stats.total}</div>
//             <div className="text-xs text-slate-300">Total</div>
//           </div>
//           <div className="bg-green-600 rounded-lg p-3 text-center">
//             <div className="text-2xl font-bold text-white">
//               {stats.resolved}
//             </div>
//             <div className="text-xs text-green-100">Resolved ✅</div>
//           </div>
//           <div className="bg-red-600 rounded-lg p-3 text-center">
//             <div className="text-2xl font-bold text-white">
//               {stats.escalated}
//             </div>
//             <div className="text-xs text-red-100">Escalated 🔥</div>
//           </div>
//           <div className="bg-orange-600 rounded-lg p-3 text-center">
//             <div className="text-2xl font-bold text-white">
//               {stats.inProgress}
//             </div>
//             <div className="text-xs text-orange-100">In Progress ⚠️</div>
//           </div>
//           <div className="bg-blue-600 rounded-lg p-3 text-center">
//             <div className="text-2xl font-bold text-white">{stats.pending}</div>
//             <div className="text-xs text-blue-100">Pending 📋</div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white border-b border-gray-200 p-4">
//         <div className="flex items-center space-x-4 flex-wrap">
//           <Filter className="w-5 h-5 text-gray-400" />

//           <select
//             value={filters.departmentName}
//             onChange={(e) =>
//               handleFilterChange("departmentName", e.target.value)
//             }
//             className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">All Departments</option>
//             <option value="Education">Education</option>
//             <option value="Health and Medical">Health and Medical</option>
//             <option value="Road and Transport">Road and Transport</option>
//             <option value="Sanitation">Sanitation</option>
//             <option value="Electricity">Electricity</option>
//             <option value="Other">Other</option>
//           </select>

//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange("status", e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="in_progress">In Progress</option>
//             <option value="resolved">Resolved</option>
//             <option value="escalated">Escalated</option>
//           </select>

//           <select
//             value={filters.priority}
//             onChange={(e) => handleFilterChange("priority", e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">All Priority</option>
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//             <option value="urgent">Urgent</option>
//           </select>

//           <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
//             <span className="text-sm font-medium text-gray-700">
//               {markers.length} locations shown
//             </span>
//           </div>

//           <button
//             onClick={fetchHeatMapData}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="bg-gray-50 border-b border-gray-200 p-4">
//         <div className="flex flex-wrap items-center gap-6">
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-green-500 rounded-full"></div>
//             <span className="text-sm text-gray-700">Resolved</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//             <span className="text-sm text-gray-700">Escalated</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//             <span className="text-sm text-gray-700">In Progress</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//             <span className="text-sm text-gray-700">Pending</span>
//           </div>
//         </div>
//       </div>

//       {/* Map Container */}
//       <div style={{ height: "calc(100vh - 280px)" }} className="relative">
//         {loading ? (
//           <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-50 z-10">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
//             <p className="text-gray-700 text-lg font-medium">
//               Loading Heat Map...
//             </p>
//             <p className="text-gray-500 text-sm">
//               Fetching complaint locations from all departments
//             </p>
//           </div>
//         ) : markers.length === 0 ? (
//           <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-50">
//             <MapPin className="w-16 h-16 text-gray-400 mb-4" />
//             <p className="text-gray-600 text-lg font-medium">
//               No Complaint Locations Found
//             </p>
//             <p className="text-gray-500 text-sm">
//               Try adjusting your filters or check if complaints have location
//               data
//             </p>
//           </div>
//         ) : (
//           <MapContainer
//             center={mapCenter}
//             zoom={12}
//             scrollWheelZoom={true}
//             style={{ height: "100%", width: "100%" }}
//             className="leaflet-container"
//           >
//             <MapSizer />
//             <TileLayer
//               attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />

//             {markers.map((marker) => (
//               <Marker
//                 key={marker.id}
//                 position={marker.position}
//                 icon={marker.icon}
//               >
//                 <Popup maxWidth={300} className="complaint-popup">
//                   <div className="p-2">
//                     <div className="font-bold text-gray-900 mb-2 text-base leading-tight">
//                       {marker.title}
//                     </div>

//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Department:</span>
//                         <span className="font-medium text-indigo-600 flex items-center">
//                           <Building2 className="w-3 h-3 mr-1" />
//                           {marker.department}
//                         </span>
//                       </div>

//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Status:</span>
//                         <span
//                           className={`font-medium px-2 py-1 rounded-full text-xs ${
//                             marker.status === "resolved"
//                               ? "bg-green-100 text-green-800"
//                               : marker.status === "escalated"
//                               ? "bg-red-100 text-red-800"
//                               : marker.status === "in_progress"
//                               ? "bg-orange-100 text-orange-800"
//                               : "bg-blue-100 text-blue-800"
//                           }`}
//                         >
//                           {marker.status.replace("_", " ").toUpperCase()}
//                         </span>
//                       </div>

//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Priority:</span>
//                         <span className="font-medium capitalize text-gray-900">
//                           {marker.priority}
//                         </span>
//                       </div>

//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Created:</span>
//                         <span className="text-gray-700 text-xs">
//                           {new Date(marker.createdAt).toLocaleDateString(
//                             "en-IN"
//                           )}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="mt-3 pt-2 border-t border-gray-200 flex space-x-2">
//                       <button
//                         onClick={() =>
//                           navigate(`/superadmin/complaints/${marker.id}`)
//                         }
//                         className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
//                       >
//                         <MapPin className="w-4 h-4 mr-1" />
//                         View Details
//                       </button>

//                       {marker.gmapLink && (
//                         <a
//                           href={marker.gmapLink}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
//                         >
//                           <svg
//                             className="w-4 h-4 mr-1"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//                             />
//                           </svg>
//                           Google Maps
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 </Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HeatMapView;

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, MapPin, Filter, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom colored marker icons
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to fix map size issues
const MapSizer = () => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

const HeatMapView = () => {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    departmentName: "",
    status: "",
    priority: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    escalated: 0,
    pending: 0,
    inProgress: 0,
  });

  // Fetch heat map data
  const fetchHeatMapData = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append("limit", "1000");
      if (filters.departmentName)
        params.append("departmentName", filters.departmentName);
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);

      console.log(
        "Fetching from:",
        `http://localhost:4000/api/v1/superadmin/getheatmap?${params}`
      );

      const response = await axios.get(
        `http://localhost:4000/api/v1/superadmin/getheatmap?${params}`,
        { withCredentials: true }
      );

      console.log("Heat Map API Response:", response.data);

      if (response.data.success) {
        const complaints = response.data.complaints || [];
        console.log(
          `Received ${complaints.length} complaints with location data`
        );

        // Create markers from complaints
        const mapMarkers = complaints.map((complaint) => {
          // Determine icon color based on status
          let icon = blueIcon; // default for pending
          switch (complaint.status) {
            case "resolved":
              icon = greenIcon;
              break;
            case "escalated":
              icon = redIcon;
              break;
            case "in_progress":
              icon = orangeIcon;
              break;
            default:
              icon = blueIcon;
          }

          return {
            id: complaint._id,
            position: [
              parseFloat(complaint.location.lat),
              parseFloat(complaint.location.lng),
            ],
            icon: icon,
            title: complaint.title || "No Title",
            status: complaint.status || "pending",
            priority: complaint.priority || "medium",
            department: complaint.departmentName || "Unknown",
            createdAt: complaint.createdAt,
            gmapLink:
              complaint.location.gmapLink ||
              `https://maps.google.com/?q=${complaint.location.lat},${complaint.location.lng}`,
          };
        });

        console.log(`Created ${mapMarkers.length} markers for map`);
        setMarkers(mapMarkers);

        // Calculate stats
        setStats({
          total: complaints.length,
          resolved: complaints.filter((c) => c.status === "resolved").length,
          escalated: complaints.filter((c) => c.status === "escalated").length,
          pending: complaints.filter((c) => c.status === "pending").length,
          inProgress: complaints.filter((c) => c.status === "in_progress")
            .length,
        });

        toast.success(
          `Heat map loaded with ${mapMarkers.length} complaint locations`
        );
      } else {
        console.error("API returned error:", response.data.message);
        toast.error(response.data.message || "Failed to load heat map data");
        setMarkers([]);
      }
    } catch (error) {
      console.error("Error fetching heat map data:", error);

      if (error.response?.status === 401) {
        toast.error("Authentication required. Please login again.");
        navigate("/superadmin/login");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Insufficient permissions.");
      } else {
        toast.error("Failed to load heat map data");
      }

      setMarkers([]);
      setStats({
        total: 0,
        resolved: 0,
        escalated: 0,
        pending: 0,
        inProgress: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchHeatMapData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Close heat map and go back
  const handleClose = () => {
    navigate(-1);
  };

  // Map center - Indore, Madhya Pradesh
  const mapCenter = [22.7196, 75.8577];

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="fixed inset-0 z-50 bg-white"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-900 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">i-Mitra Heat Map 🔥</h1>
              <p className="text-sm text-slate-300">
                All Department Complaints - Geographic View
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4 flex-wrap">
          <Filter className="w-5 h-5 text-gray-400" />

          <select
            value={filters.departmentName}
            onChange={(e) =>
              handleFilterChange("departmentName", e.target.value)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            <option value="Education">Education</option>
            <option value="Health and Medical">Health and Medical</option>
            <option value="Road and Transport">Road and Transport</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              {markers.length} locations shown
            </span>
          </div>

          <button
            onClick={fetchHeatMapData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Resolved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Escalated</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Pending</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height: "calc(100vh - 200px)" }} className="relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-50 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-gray-700 text-lg font-medium">
              Loading Heat Map...
            </p>
            <p className="text-gray-500 text-sm">
              Fetching complaint locations from all departments
            </p>
          </div>
        ) : markers.length === 0 ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-50">
            <MapPin className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              No Complaint Locations Found
            </p>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or check if complaints have location
              data
            </p>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-container"
          >
            <MapSizer />
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={marker.icon}
              >
                <Popup maxWidth={300} className="complaint-popup">
                  <div className="p-2">
                    <div className="font-bold text-gray-900 mb-2 text-base leading-tight">
                      {marker.title}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium text-indigo-600 flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {marker.department}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium px-2 py-1 rounded-full text-xs ${
                            marker.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : marker.status === "escalated"
                              ? "bg-red-100 text-red-800"
                              : marker.status === "in_progress"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {marker.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className="font-medium capitalize text-gray-900">
                          {marker.priority}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-700 text-xs">
                          {new Date(marker.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/superadmin/complaints/${marker.id}`)
                        }
                        className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        View Details
                      </button>

                      {marker.gmapLink && (
                        <a
                          href={marker.gmapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default HeatMapView;
