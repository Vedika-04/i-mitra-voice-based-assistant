import React from "react";

const CitizenInfoCard = ({ citizen }) => {
  if (!citizen) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5">
        <h3 className="text-lg font-semibold mb-3">Citizen Information</h3>
        <div className="text-sm text-gray-600">
          Citizen information not available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-3">
      <h3 className="text-lg font-semibold">Citizen Information</h3>

      <div className="space-y-2">
        <div>
          <div className="text-xs text-gray-500">Full Name</div>
          <div className="text-sm font-medium text-gray-800">
            {citizen.fullName || "—"}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Phone Number</div>
          <div className="text-sm font-medium text-gray-800">
            📱 {citizen.phone || "—"}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Zone</div>
          <div className="text-sm font-medium text-gray-800">
            📍 {citizen.zone || "—"}
          </div>
        </div>

        {citizen.address && (
          <div>
            <div className="text-xs text-gray-500">Address</div>
            <div className="text-sm text-gray-800 break-words">
              {citizen.address}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenInfoCard;
