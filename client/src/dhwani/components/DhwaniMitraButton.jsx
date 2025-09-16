import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DhwaniMitraLauncherRedirect() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [hasNewFeature, setHasNewFeature] = useState(false);

  // Show "NEW" badge only for first-time users
  useEffect(() => {
    const hasSeenDhwani = localStorage.getItem("dhwani_mitra_seen");
    if (!hasSeenDhwani) {
      setHasNewFeature(true);
      setTimeout(() => {
        setHasNewFeature(false);
        localStorage.setItem("dhwani_mitra_seen", "true");
      }, 10000); // 10s highlight
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      {/* New Feature Intro Tooltip */}
      {hasNewFeature && (
        <div className="absolute bottom-full right-0 mb-4 w-64 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-xl shadow-xl animate-bounce">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg">
              🎙️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">NEW: Dhwani-Mitra!</h3>
              <p className="text-xs text-green-100 leading-relaxed">
                Voice assistant for complaints • Hindi/English support • Instant
                status tracking
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600 transform translate-y-full"></div>
        </div>
      )}

      {/* Main Launcher Button */}
      <button
        onClick={() => navigate("/dhwani-mitra")}
        className={`relative w-20 h-20 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex flex-col items-center justify-center
          ${
            hasNewFeature
              ? "bg-gradient-to-br from-amber-500 to-orange-600 animate-pulse"
              : "bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          }`}
        title="Open Dhwani-Mitra Voice Assistant"
      >
        {/* Ripple Hover Effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-active:opacity-30 transition-opacity"></div>

        {/* Mic Icon */}
        <div className="text-white text-2xl animate-bounce">🎙️</div>

        {/* Blinking Text */}
        <span className="mt-1 text-[10px] font-semibold text-white animate-pulse">
          Open Dhwani Mitra
        </span>

        {/* "NEW" Badge */}
        {hasNewFeature && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold animate-pulse">
              NEW
            </span>
          </div>
        )}

        {/* Floating Particles */}
        {hasNewFeature && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-100"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-300"></div>
            <div className="absolute top-0 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-500"></div>
          </>
        )}
      </button>

      {/* Hover Label */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
          Dhwani-Mitra
          <div className="absolute top-full right-3 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      {/* Hover Quick Actions */}
      <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
        <div className="flex flex-col gap-2 items-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/dhwani-mitra");
            }}
            className="flex items-center gap-2 bg-white text-gray-700 px-3 py-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors text-sm"
          >
            📝 File Complaint
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/dhwani-mitra");
            }}
            className="flex items-center gap-2 bg-white text-gray-700 px-3 py-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors text-sm"
          >
            🔍 Check Status
          </button>
        </div>
      </div>
    </div>
  );
}
