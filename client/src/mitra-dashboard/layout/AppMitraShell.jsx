import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMitraAuth } from "../hooks/useMitraAuth";
import MitraProfileModal from "../components/MitraProfileModal";
import { toast } from "react-toastify";

const AppMitraShell = ({ children }) => {
  const { mitra, logout } = useMitraAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/mitra/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path;

  // Profile image with fallback - Make it clickable
  const ProfileImage = ({
    size = "w-10 h-10",
    className = "",
    clickable = false,
  }) => {
    const imageContent = () => {
      if (mitra?.profileImg && !imageError) {
        return (
          <img
            src={mitra.profileImg}
            alt={mitra.fullName || "Mitra"}
            className={`${size} rounded-xl object-cover border-2 border-white shadow-lg ${className} ${
              clickable
                ? "cursor-pointer hover:scale-105 transition-transform"
                : ""
            }`}
            onError={() => setImageError(true)}
            onClick={clickable ? () => setShowProfileModal(true) : undefined}
          />
        );
      }

      return (
        <div
          className={`${size} bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border-2 border-white ${className} ${
            clickable
              ? "cursor-pointer hover:scale-105 transition-transform"
              : ""
          }`}
          onClick={clickable ? () => setShowProfileModal(true) : undefined}
        >
          <span className={size === "w-10 h-10" ? "text-sm" : "text-xs"}>
            {mitra?.fullName?.charAt(0)?.toUpperCase() || "M"}
          </span>
        </div>
      );
    };

    return imageContent();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-blue-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl text-white">👷</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mitra Portal
                </h1>
                <p className="text-xs text-gray-500">Field Operations</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-blue-600">Mitra</h1>
              </div>
            </div>

            {/* Desktop User Profile Section */}
            <div className="hidden md:flex items-center gap-4">
              {/* User Info Card - Make profile image clickable */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-4 py-2">
                <ProfileImage clickable={true} />
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {mitra?.fullName || "Mitra User"}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {mitra?.departmentName}
                  </div>
                  <div className="text-xs text-gray-500">📍 {mitra?.zone}</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-medium rounded-xl hover:from-rose-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>

            {/* Mobile Profile & Menu */}
            <div className="md:hidden flex items-center gap-3">
              {/* Mobile Profile Image - Make it clickable */}
              <ProfileImage size="w-8 h-8" clickable={true} />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-blue-100 py-4">
              <div className="space-y-4">
                {/* User Profile in Mobile Menu */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <ProfileImage clickable={true} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {mitra?.fullName || "Mitra User"}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      {mitra?.departmentName}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      📍 {mitra?.zone}
                    </div>
                    {mitra?.mobile && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        📱 {mitra.mobile}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-red-600 shadow-lg transition-all"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            <Link
              to="/mitra/dashboard"
              className={`flex-shrink-0 px-4 sm:px-6 py-4 font-medium text-sm transition-all ${
                isActive("/mitra/dashboard")
                  ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                📋 <span>My Complaints</span>
                {isActive("/mitra/dashboard") && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </Link>

            <div className="flex-shrink-0 px-4 sm:px-6 py-4 font-medium text-sm text-gray-400 cursor-not-allowed border-b-2 border-transparent">
              <div className="flex items-center gap-2">
                📊 <span>Reports</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Profile Modal */}
      <MitraProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        mitra={mitra}
        imageError={imageError}
        setImageError={setImageError}
      />
    </div>
  );
};

export default AppMitraShell;
