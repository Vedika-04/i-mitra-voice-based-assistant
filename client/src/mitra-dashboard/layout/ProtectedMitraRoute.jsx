import React from "react";
import { Navigate } from "react-router-dom";
import { useMitraAuth } from "../hooks/useMitraAuth";

const ProtectedMitraRoute = ({ children }) => {
  const { isAuthenticated, loading } = useMitraAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/mitra/login" replace />;
  }

  return children;
};

export default ProtectedMitraRoute;
