import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMitraAuth } from "../hooks/useMitraAuth";
import { toast } from "react-toastify";

const MitraLogin = () => {
  const { isAuthenticated, login } = useMitraAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/mitra/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        toast.success("Login successful!");
        // Navigation will happen automatically via isAuthenticated change
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-3xl text-white">👷</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mitra Portal
          </h1>
          <p className="text-gray-600">Sign in to manage assigned complaints</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Mobile Number
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Home Button - positioned separately below form */}
          <div className="mt-4">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 shadow-sm"
            >
              Home
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Use your registered mobile number and shared password to access
              the portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitraLogin;
