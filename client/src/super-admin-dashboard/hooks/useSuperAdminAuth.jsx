import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";

const SuperAdminContext = createContext();

export const useSuperAdminAuth = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error("useSuperAdminAuth must be used within SuperAdminProvider");
  }
  return context;
};

export const SuperAdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setAdmin(response);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setAdmin(response);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAdmin(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    isAuthenticated,
    admin,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};
