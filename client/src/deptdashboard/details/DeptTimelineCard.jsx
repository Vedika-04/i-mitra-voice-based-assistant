import React from "react";

const DeptTimelineCard = ({ timeline = [] }) => {
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
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5">
      <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>

      {items.length === 0 ? (
        <div className="text-sm text-gray-600">No timeline activities yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((t, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {/* Timeline dot */}
              <div className="mt-1 h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0" />

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

export default DeptTimelineCard;
