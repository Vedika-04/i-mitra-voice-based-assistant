import React from "react";
import { Navigate } from "react-router-dom";
import { useSuperAdminAuth } from "../../hooks/useSuperAdminAuth";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProtectedSuperAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSuperAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Verifying credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
};

export default ProtectedSuperAdminRoute;
