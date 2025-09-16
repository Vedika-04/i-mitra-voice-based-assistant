import React from "react";

const DeptLocationCard = ({ location }) => {
  const hasAny =
    location?.location ||
    location?.gmapLink ||
    (location?.lat && location?.lng);

  if (!hasAny) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5">
        <h3 className="text-lg font-semibold mb-3">Location</h3>
        <div className="text-sm text-gray-600">
          No location information available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-3">
      <h3 className="text-lg font-semibold">Complaint Location</h3>

      {location?.location && (
        <div>
          <div className="text-xs text-gray-500">Address</div>
          <div className="text-sm text-gray-800">{location.location}</div>
        </div>
      )}

      {location?.gmapLink && (
        <a
          className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-900 underline"
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

export default DeptLocationCard;
