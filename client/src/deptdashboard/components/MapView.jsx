import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useDeptContext } from "../DeptContext.jsx";

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

const MapView = () => {
  const [markers, setMarkers] = useState([]);
  const { department } = useDeptContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/api/v1/department/complaints?limit=100",
          { withCredentials: true }
        );

        // Filter complaints with valid location data and map them to markers
        const complaintMarkers = res.data.complaints
          .filter(
            (complaint) =>
              complaint.location &&
              complaint.location.lat &&
              complaint.location.lng &&
              !isNaN(complaint.location.lat) &&
              !isNaN(complaint.location.lng)
          )
          .map((complaint) => {
            // Determine marker color based on complaint status
            let icon = blueIcon; // Default for pending/in_progress
            if (complaint.status === "resolved") {
              icon = greenIcon;
            } else if (complaint.status === "escalated") {
              icon = redIcon;
            }

            return {
              id: complaint._id,
              position: [complaint.location.lat, complaint.location.lng],
              icon,
              title: complaint.title,
              status: complaint.status,
              priority: complaint.priority,
              createdAt: complaint.createdAt,
              gmapLink: complaint.location.gmapLink || "",
            };
          });

        setMarkers(complaintMarkers);
      } catch (error) {
        console.error("Error fetching complaints for map:", error);
        setMarkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [department]);

  // Center map on Indore, Madhya Pradesh
  const mapCenter = [22.7196, 75.8577];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Complaint Locations
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Geographic distribution of complaints in {department} department
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-4">
          <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-800">
              {markers.length} locations
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Resolved</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Escalated</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-700">In Progress</span>
        </div>
      </div>

      {/* Map Container */}
      <div
        style={{ height: "400px" }}
        className="rounded-lg overflow-hidden border border-gray-300"
      >
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading complaint locations...</p>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
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
                <Popup>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 mb-2">
                      {marker.title}
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium capitalize ${
                            marker.status === "resolved"
                              ? "text-green-600"
                              : marker.status === "escalated"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {marker.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className="font-medium capitalize">
                          {marker.priority}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-700">
                          {new Date(marker.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 space-y-2">
                      <a
                        href={`/department/complaints/${marker.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Details
                      </a>

                      {marker.gmapLink && (
                        <a
                          href={marker.gmapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium ml-4"
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

      {/* Map Stats */}
      {!loading && markers.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-green-800 text-sm font-medium">
              Resolved Locations
            </div>
            <div className="text-green-900 text-xl font-bold">
              {markers.filter((m) => m.status === "resolved").length}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="text-red-800 text-sm font-medium">
              Escalated Locations
            </div>
            <div className="text-red-900 text-xl font-bold">
              {markers.filter((m) => m.status === "escalated").length}
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-blue-800 text-sm font-medium">
              Active Locations
            </div>
            <div className="text-blue-900 text-xl font-bold">
              {
                markers.filter(
                  (m) => !["resolved", "escalated"].includes(m.status)
                ).length
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
