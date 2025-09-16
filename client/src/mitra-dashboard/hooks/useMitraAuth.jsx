import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

const MitraAuthContext = createContext();

export const useMitraAuth = () => {
  const context = useContext(MitraAuthContext);
  if (!context) {
    throw new Error("useMitraAuth must be used within MitraAuthProvider");
  }
  return context;
};

export const MitraAuthProvider = ({ children }) => {
  const [mitra, setMitra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/mitra/auth/me",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMitra(response.data.mitra);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setMitra(null);
      document.cookie =
        "mitra_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/mitra/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMitra(response.data.mitra);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/mitra/auth/logout", {
        withCredentials: true,
      });
    } catch (error) {
      // Continue with logout even if request fails
    } finally {
      setMitra(null);
      setIsAuthenticated(false);
      // Clear cookie
      document.cookie =
        "mitra_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
  };

  const value = {
    mitra,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <MitraAuthContext.Provider value={value}>
      {children}
    </MitraAuthContext.Provider>
  );
};
