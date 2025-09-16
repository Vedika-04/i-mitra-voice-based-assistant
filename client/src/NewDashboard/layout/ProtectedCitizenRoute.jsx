import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../main.jsx";

const ProtectedCitizenRoute = ({ children }) => {
  const { isAuthenticated } = useContext(Context);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};

export default ProtectedCitizenRoute;
