import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMitraComplaintDetail } from "../hooks/useMitraComplaints";
import SummaryCard from "../components/SummaryCard";
import CitizenInfoCard from "../components/CitizenInfoCard";
import AddTimelineEntryModal from "../components/AddTimelineEntryModal";

const LocationCard = ({ location }) => {
  const hasAny =
    location?.location ||
    location?.gmapLink ||
    (location?.lat && location?.lng);

  if (!hasAny) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 sm:p-5">
        <h3 className="text-lg font-semibold mb-3">Location</h3>
        <div className="text-sm text-gray-600">
          No location information available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 sm:p-5 space-y-3">
      <h3 className="text-lg font-semibold">Complaint Location</h3>

      {location?.location && (
        <div>
          <div className="text-xs text-gray-500">Address</div>
          <div className="text-sm text-gray-800">{location.location}</div>
        </div>
      )}

      {location?.gmapLink && (
        <a
          className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900 underline"
          href={location.gmapLink}
          target="_blank"
          rel="noreferrer"
        >
          🗺️ Open in Google Maps
        </a>
      )}

      {location?.lat && location?.lng && (
        <div>
          <div className="text-xs text-gray-500">Coordinates</div>
          <div className="text-xs text-gray-600">
            {location.lat}, {location.lng}
          </div>
        </div>
      )}
    </div>
  );
};

const MediaGallery = ({ images = [], videos = [] }) => {
  const hasAny = (images?.length || 0) > 0 || (videos?.length || 0) > 0;

  if (!hasAny) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 sm:p-5 text-sm text-gray-600">
        No media attachments found for this complaint.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold">Evidence & Media</h2>

      {images?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((src, idx) => (
              <a
                key={idx}
                href={src}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-xl border border-blue-100 bg-white"
                title="Click to view full size"
              >
                <img
                  src={src}
                  alt={`Evidence ${idx + 1}`}
                  className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {videos?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Videos ({videos.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map((src, idx) => (
              <video
                key={idx}
                controls
                className="w-full rounded-xl border border-blue-100 bg-black"
                src={src}
                title={`Video Evidence ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TimelineCard = ({ timeline = [] }) => {
  const items = Array.isArray(timeline) ? timeline : [];

  const getTimelineIcon = (item) => {
    if (item.addedByType === "department") return "🏢";
    if (item.addedByType === "mitra") return "👷";
    return "👤";
  };

  const getTimelineContext = (item) => {
    if (item.addedByType === "department") return "Department";
    if (item.addedByType === "mitra") return "Mitra";
    return "Citizen";
  };

  const handleMediaClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 sm:p-5">
      <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>

      {items.length === 0 ? (
        <div className="text-sm text-gray-600">No timeline activities yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((t, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {/* Timeline dot */}
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header with icon and context */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{getTimelineIcon(t)}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {t?.caption || "Update"}
                  </span>
                  <span className="text-xs text-gray-500">
                    by {getTimelineContext(t)}
                  </span>
                </div>

                {/* Added by name if available */}
                {t?.addedBy && (
                  <div className="text-xs text-gray-600 mb-2">{t.addedBy}</div>
                )}

                {/* Media attachments */}
                {Array.isArray(t?.media) && t.media.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {t.media.map((m, i) => {
                      // Handle string URLs (assume images)
                      if (typeof m === "string") {
                        return (
                          <div
                            key={i}
                            className="cursor-pointer"
                            onClick={() => handleMediaClick(m)}
                          >
                            <img
                              src={m}
                              alt="Timeline attachment"
                              className="h-16 w-16 object-cover rounded-lg border border-gray-200 hover:opacity-75 transition-opacity"
                            />
                          </div>
                        );
                      }

                      // Handle object with type/url
                      if (m.type === "image") {
                        return (
                          <div
                            key={i}
                            className="cursor-pointer"
                            onClick={() => handleMediaClick(m.url)}
                          >
                            <img
                              src={m.url}
                              alt="Timeline attachment"
                              className="h-16 w-16 object-cover rounded-lg border border-gray-200 hover:opacity-75 transition-opacity"
                            />
                          </div>
                        );
                      }

                      if (m.type === "video") {
                        return (
                          <video
                            key={i}
                            controls
                            className="h-20 w-28 rounded-lg border border-gray-200"
                            src={m.url}
                          />
                        );
                      }

                      return null;
                    })}
                  </div>
                )}

                {/* Timestamp */}
                {t?.at && (
                  <div className="text-xs text-gray-500">
                    {new Date(t.at).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MitraComplaintDetail = () => {
  const { complaintId } = useParams();
  const { complaint, loading, error, addTimelineEntry } =
    useMitraComplaintDetail(complaintId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingUpdate, setAddingUpdate] = useState(false);

  const handleAddUpdate = async (formData) => {
    setAddingUpdate(true);
    try {
      const result = await addTimelineEntry(formData);
      return result;
    } finally {
      setAddingUpdate(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Complaint
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/mitra/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !complaint) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const images = complaint?.media?.images || [];
  const videos = complaint?.media?.videos || [];
  const location = complaint?.location;

  const canAddUpdate =
    complaint.status !== "resolved" && complaint.status !== "rejected";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/mitra/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {canAddUpdate && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Update
          </button>
        )}
      </div>

      {/* Summary Card */}
      <SummaryCard complaint={complaint} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-3 space-y-6">
          <MediaGallery images={images} videos={videos} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CitizenInfoCard citizen={complaint?.citizenId} />
            <LocationCard location={location} />
          </div>

          <TimelineCard timeline={complaint?.timeline} />
        </div>

        {/* Right Column - Status Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 sm:p-5">
            <h3 className="text-lg font-semibold mb-3">Current Status</h3>

            <div className="space-y-3">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="text-2xl mb-2">
                  {complaint.status === "pending" && "⏳"}
                  {complaint.status === "in_progress" && "🔄"}
                  {complaint.status === "resolved" && "✅"}
                  {complaint.status === "rejected" && "❌"}
                  {complaint.status === "escalated" && "⚡"}
                </div>
                <div className="text-lg font-semibold text-gray-900 capitalize">
                  {complaint.status?.replace("_", " ") || "Unknown"}
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <span className="font-medium">Priority:</span>{" "}
                  <span className="capitalize">
                    {complaint.priority || "Medium"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Department:</span>{" "}
                  {complaint.departmentName}
                </div>
                <div>
                  <span className="font-medium">Zone:</span> {complaint.zone}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5">
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>📸 Document your progress with photos/videos</p>
              <p>📝 Add clear descriptions of work done</p>
              <p>📍 Verify location details are accurate</p>
              <p>⏰ Update regularly to keep citizens informed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Timeline Entry Modal */}
      <AddTimelineEntryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUpdate}
        loading={addingUpdate}
      />
    </div>
  );
};

export default MitraComplaintDetail;
