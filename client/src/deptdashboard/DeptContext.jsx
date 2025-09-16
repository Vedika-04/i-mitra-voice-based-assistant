import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DeptContext = createContext();

export const useDeptContext = () => {
  const context = useContext(DeptContext);
  if (!context) {
    throw new Error("useDeptContext must be used within DeptProvider");
  }
  return context;
};

export const DeptProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if department is already logged in
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:4000/api/v1/department/auth/me", {
        withCredentials: true,
      })
      .then((res) => {
        setIsAuthenticated(true);
        setDepartment(res.data.department);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setDepartment(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/department/auth/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        setDepartment(response.data.department);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/department/auth/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setDepartment(null);
    }
  };

  const value = {
    isAuthenticated,
    department,
    loading,
    login,
    logout,
  };

  return <DeptContext.Provider value={value}>{children}</DeptContext.Provider>;
};
