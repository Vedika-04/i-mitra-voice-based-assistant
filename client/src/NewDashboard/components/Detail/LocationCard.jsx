import React from "react";

const LocationCard = ({ location }) => {
  const hasAny =
    location?.location ||
    location?.gmapLink ||
    (location?.lat && location?.lng);
  if (!hasAny) return null;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-2">
      <h2 className="text-lg font-semibold">Location</h2>
      {location?.location && (
        <div className="text-sm text-gray-800">{location.location}</div>
      )}
      {location?.gmapLink && (
        <a
          className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-900 underline"
          href={location.gmapLink}
          target="_blank"
          rel="noreferrer"
        >
          Open in Google Maps
        </a>
      )}
      {location?.lat && location?.lng ? (
        <div className="text-xs text-gray-500">
          Coordinates: {location.lat}, {location.lng}
        </div>
      ) : null}
    </div>
  );
};

export default LocationCard;
