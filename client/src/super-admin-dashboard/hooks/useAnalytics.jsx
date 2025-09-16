import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const useAnalytics = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${endpoint}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await axios.get(url, { withCredentials: true });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useOverviewAnalytics = (filters = {}) => {
  return useAnalytics("/analytics/overview", filters);
};

export const useDepartmentAnalytics = (filters = {}) => {
  return useAnalytics("/analytics/departments", filters);
};

export const useZoneAnalytics = (filters = {}) => {
  return useAnalytics("/analytics/zones", filters);
};

export const useTrends = (filters = {}) => {
  return useAnalytics("/analytics/trends", filters);
};

export const useEscalationAnalytics = (filters = {}) => {
  return useAnalytics("/analytics/escalations", filters);
};

export const useComplaints = (filters = {}) => {
  return useAnalytics("/complaints", filters);
};
