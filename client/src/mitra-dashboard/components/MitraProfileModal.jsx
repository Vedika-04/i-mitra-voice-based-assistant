import React from "react";
import { Phone, Building2, MapPin, BadgeCheck, IdCard, X } from "lucide-react"; // modern icons

const MitraProfileModal = ({
  isOpen,
  onClose,
  mitra,
  imageError,
  setImageError,
}) => {
  if (!isOpen) return null;

  const ProfileImageLarge = () => {
    if (mitra?.profileImg && !imageError) {
      return (
        <img
          src={mitra.profileImg}
          alt={mitra.fullName || "Mitra"}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md"
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-3xl sm:text-4xl shadow-md border-4 border-white">
        {mitra?.fullName?.charAt(0)?.toUpperCase() || "M"}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 py-6 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-100 to-blue-100 rounded-t-3xl p-6 flex flex-col items-center">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-600 hover:bg-gray-200 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Image */}
          <ProfileImageLarge />
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Name & Role */}
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {mitra?.fullName || "Mitra User"}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Field Executive
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <InfoCard
              icon={<Phone className="text-blue-500 w-5 h-5" />}
              label="Mobile Number"
              value={mitra?.mobile || "—"}
              bg="from-blue-50 to-indigo-50"
            />

            <InfoCard
              icon={<Building2 className="text-green-500 w-5 h-5" />}
              label="Department"
              value={mitra?.departmentName || "—"}
              bg="from-green-50 to-emerald-50"
            />

            <InfoCard
              icon={<MapPin className="text-amber-500 w-5 h-5" />}
              label="Service Zone"
              value={mitra?.zone || "—"}
              bg="from-amber-50 to-orange-50"
            />

            <InfoCard
              icon={<IdCard className="text-purple-500 w-5 h-5" />}
              label="Mitra ID"
              value={
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {mitra?.mitraId || "—"}
                </span>
              }
              bg="from-purple-50 to-indigo-50"
            />

            <InfoCard
              icon={<BadgeCheck className="text-teal-500 w-5 h-5" />}
              label="Status"
              value={<span className="text-green-600">✅ Active & Online</span>}
              bg="from-green-50 to-teal-50"
            />
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-xs text-gray-500">
              Last login: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔹 Reusable InfoCard Component */
const InfoCard = ({ icon, label, value, bg }) => (
  <div
    className={`bg-gradient-to-r ${bg} rounded-xl p-4 border shadow-sm flex items-center gap-3`}
  >
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

export default MitraProfileModal;
