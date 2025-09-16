// client/src/dhwani/components/LocationCapture.jsx
import React, { useState, useEffect } from "react";

const LocationCapture = ({
  complaintData,
  updateComplaintData,
  nextState,
  states,
}) => {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    gmapLink: "",
    location: "",
  });
  const [address, setAddress] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    // Auto-request location on component mount
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError("");

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const gmapLink = `https://maps.google.com/?q=${latitude},${longitude}`;

        const locationData = {
          lat: latitude,
          lng: longitude,
          gmapLink: gmapLink,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        };

        setLocation(locationData);
        setIsLoadingLocation(false);

        // Try to get readable address
        getAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access denied. Please enable location services."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError(
              "An unknown error occurred while retrieving location."
            );
            break;
        }
      },
      options
    );
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      // Using a reverse geocoding service (you might want to use Google Maps API)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();

      if (data.locality || data.city) {
        const fullAddress = `${data.locality || data.city}, ${
          data.principalSubdivision || ""
        }, ${data.countryName || ""}`;
        setAddress(fullAddress);
        setLocation((prev) => ({
          ...prev,
          location: fullAddress,
        }));
      }
    } catch (error) {
      console.error("Error getting address:", error);
      // Keep the coordinates as location if address fetch fails
    }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    // Update location data with custom address if provided
    if (newAddress.trim()) {
      setLocation((prev) => ({
        ...prev,
        location: newAddress,
      }));
    } else if (location.lat && location.lng) {
      // Fallback to coordinates if address is cleared
      setLocation((prev) => ({
        ...prev,
        location: `${prev.lat.toFixed(6)}, ${prev.lng.toFixed(6)}`,
      }));
    }
  };

  const handleContinue = () => {
    if (!location.lat || !location.lng) {
      alert("Please enable location access or manually enter your address");
      return;
    }

    updateComplaintData({ location });
    nextState(states.CONFIRMATION);
  };

  const handleManualLocation = () => {
    const userAddress = prompt("Please enter your address:");
    if (userAddress) {
      setLocation({
        lat: 0, // Will be updated by backend if needed
        lng: 0,
        gmapLink: "",
        location: userAddress,
      });
      setAddress(userAddress);
      setLocationError("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-white">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
          📍 Location Information
        </h2>
        <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
          We need your location to route the complaint to the right department
          and ensure quick resolution
        </p>
      </div>

      {/* Main Location Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 mb-8 sm:mb-12">
        {isLoadingLocation ? (
          // Loading State
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <svg
                className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-lg sm:text-xl font-medium text-blue-300 animate-pulse">
              🛰️ Getting your location...
            </p>
            <p className="text-sm sm:text-base opacity-80 mt-2">
              Please allow location access when prompted
            </p>
          </div>
        ) : locationError ? (
          // Error State
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
              <span className="text-3xl sm:text-4xl">⚠️</span>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-red-300 mb-6">
              {locationError}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={getCurrentLocation}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                🔄 Try Again
              </button>
              <button
                onClick={handleManualLocation}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                📝 Enter Manually
              </button>
            </div>
          </div>
        ) : location.lat ? (
          // Success State
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <span className="text-3xl sm:text-4xl">✅</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-300 mb-4">
                Location Captured Successfully!
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                  <span className="mr-2">🌐</span>
                  Coordinates
                </h4>
                <div className="space-y-2 text-sm sm:text-base font-mono">
                  <p>
                    <span className="text-green-300">Latitude:</span>{" "}
                    {location.lat.toFixed(6)}
                  </p>
                  <p>
                    <span className="text-blue-300">Longitude:</span>{" "}
                    {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                  <span className="mr-2">🗺️</span>
                  Map Link
                </h4>
                {location.gmapLink && (
                  <a
                    href={location.gmapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    🗺️ View on Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Initial State
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
              <span className="text-3xl sm:text-4xl">📍</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-6">
              Enable Location Access
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={getCurrentLocation}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg"
              >
                📍 Get My Location
              </button>
              <div className="text-gray-300 font-semibold">or</div>
              <button
                onClick={handleManualLocation}
                className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg"
              >
                📝 Enter Address Manually
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Address Input Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 mb-8 sm:mb-12">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-400 flex items-center">
          <span className="mr-3">🏠</span>
          Address Details (Optional)
        </h3>
        <p className="text-base sm:text-lg opacity-90 mb-6 leading-relaxed">
          You can provide a more specific address, landmark, or additional
          location details to help us locate the issue precisely
        </p>
        <textarea
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter specific address, landmark, or additional location details..."
          className="w-full p-4 sm:p-5 border-2 border-white/30 focus:border-white/60 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 resize-vertical min-h-[100px] text-base sm:text-lg"
          rows={4}
        />
      </div>

      {/* Location Preview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 mb-8 sm:mb-12">
        <h3 className="text-xl sm:text-2xl font-bold mb-6 text-yellow-400 flex items-center">
          <span className="mr-3">📋</span>
          Final Location Summary
        </h3>
        <div className="bg-white/5 border-l-4 border-green-400 rounded-xl p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-semibold text-green-300 block mb-1">
                Location Address:
              </span>
              <p className="text-base sm:text-lg font-medium">
                {location.location || (
                  <span className="text-gray-400 italic">
                    Location not set yet
                  </span>
                )}
              </p>
            </div>

            {location.lat && location.lng && (
              <div>
                <span className="text-sm font-semibold text-blue-300 block mb-1">
                  Coordinates:
                </span>
                <p className="text-base font-mono">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
        <button
          onClick={() => nextState(states.MEDIA_UPLOAD)}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[200px] border-2 border-white/20"
        >
          ← Back to Media
        </button>

        <button
          onClick={handleContinue}
          disabled={!location.lat && !location.location}
          className={`w-full sm:w-auto px-8 py-4 text-white font-bold rounded-full text-lg transition-all duration-300 transform min-w-[200px] border-2 ${
            location.lat || location.location
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-xl border-white/30"
              : "bg-gray-600 opacity-50 cursor-not-allowed border-gray-500"
          }`}
        >
          {location.lat || location.location
            ? "✅ Continue →"
            : "📍 Set Location First"}
        </button>
      </div>

      {/* Location Tips */}
      <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10">
        <h4 className="text-lg sm:text-xl font-bold text-yellow-400 mb-6 flex items-center">
          <span className="mr-3">💡</span>
          Location Tips for Faster Resolution
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base">
          <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl">
            <span className="text-xl sm:text-2xl">🎯</span>
            <div>
              <h5 className="font-semibold text-green-300 mb-2">Be Precise</h5>
              <p className="opacity-90">
                Provide exact location for quicker department routing
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl">
            <span className="text-xl sm:text-2xl">🏠</span>
            <div>
              <h5 className="font-semibold text-blue-300 mb-2">
                Add Landmarks
              </h5>
              <p className="opacity-90">
                Mention nearby shops, buildings, or recognizable places
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl">
            <span className="text-xl sm:text-2xl">🔒</span>
            <div>
              <h5 className="font-semibold text-purple-300 mb-2">
                Privacy Safe
              </h5>
              <p className="opacity-90">
                Your location is only used for complaint routing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCapture;
