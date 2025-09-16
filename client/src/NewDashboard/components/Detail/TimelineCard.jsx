import React from "react";

const TimelineCard = ({ timeline = [] }) => {
  const items = Array.isArray(timeline) ? timeline : [];

  const handleMediaClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Same icon logic from DeptTimelineCard
  const getTimelineIcon = (item) => {
    if (item.addedByType === "department") return "🏢";
    if (item.addedByType === "mitra") return "👷";
    return "👤"; // default citizen
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5">
      <h2 className="text-lg font-semibold mb-3">Timeline</h2>
      {items.length === 0 ? (
        <div className="text-sm text-gray-600">No timeline available yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((t, idx) => (
            <li key={idx} className="flex items-start gap-3">
              {/* Left dot */}
              <div className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />

              {/* Right content */}
              <div className="flex flex-col gap-1">
                {/* Caption + Icon */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getTimelineIcon(t)}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {t?.caption || "Update"}
                  </span>
                </div>

                {/* Added by */}
                {t?.addedBy && (
                  <div className="text-xs text-gray-600">By: {t.addedBy}</div>
                )}

                {/* Media (photos/videos) */}
                {Array.isArray(t?.media) && t.media.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {t.media.map((m, i) => {
                      if (typeof m === "string") {
                        return (
                          <div
                            key={i}
                            className="cursor-pointer"
                            onClick={() => handleMediaClick(m)}
                          >
                            <img
                              src={m}
                              alt="timeline media"
                              className="h-20 w-20 object-cover rounded-lg border"
                            />
                          </div>
                        );
                      }

                      if (m.type === "image") {
                        return (
                          <div
                            key={i}
                            className="cursor-pointer"
                            onClick={() => handleMediaClick(m.url)}
                          >
                            <img
                              src={m.url}
                              alt="timeline media"
                              className="h-20 w-20 object-cover rounded-lg border"
                            />
                          </div>
                        );
                      }

                      if (m.type === "video") {
                        return (
                          <div
                            key={i}
                            className="cursor-pointer"
                            onClick={() => handleMediaClick(m.url)}
                          >
                            <video
                              src={m.url}
                              controls
                              className="h-24 w-32 rounded-lg border"
                            />
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}

                {/* Time */}
                {t?.at && (
                  <div className="text-xs text-gray-500">
                    {new Date(t.at).toLocaleString()}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimelineCard;
