import React from "react";

const DeptMediaGallery = ({ images = [], videos = [] }) => {
  const hasAny = (images?.length || 0) > 0 || (videos?.length || 0) > 0;

  if (!hasAny) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 text-sm text-gray-600">
        No media attachments found for this complaint.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-4">
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
                className="group block overflow-hidden rounded-xl border border-emerald-100 bg-white"
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
                className="w-full rounded-xl border border-emerald-100 bg-black"
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

export default DeptMediaGallery;
