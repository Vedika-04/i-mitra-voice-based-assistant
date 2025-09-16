import React from "react";

const CitizenInfoCard = ({ citizen }) => {
  console.log(citizen);

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

  // Phone formatting helper
  const formatPhone = (phone) => {
    if (!phone) return "—";
    const clean = phone.replace(/\D/g, "");
    if (clean.length === 10) {
      return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return phone;
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-3">
      <h3 className="text-lg font-semibold">Citizen Information</h3>

      <div className="flex flex-col sm:flex-row-reverse sm:items-center gap-3">
        {/* Profile Image on Right */}
        <div className="flex-shrink-40">
          {citizen.profileimg ? (
            <img
              src={citizen.profileimg}
              alt="Citizen profile"
              className="h-20 w-20 sm:h-22 sm:w-22 rounded-full object-cover border shadow-sm"
            />
          ) : (
            <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold">
              {citizen.fullName ? citizen.fullName.charAt(0) : "👤"}
            </div>
          )}
        </div>

        {/* Info on Left */}
        <div className="flex-1 space-y-1.5">
          <div>
            <div className="text-xs text-gray-500">Full Name</div>
            <div className="text-sm font-medium text-gray-800">
              {citizen.fullName || "—"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Phone Number</div>
            <div className="text-sm font-medium text-gray-800">
              📱 {formatPhone(citizen.phone)}
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
    </div>
  );
};

export default CitizenInfoCard;
