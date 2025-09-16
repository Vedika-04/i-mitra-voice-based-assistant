import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useMitraComplaints = (filters = {}) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.page) params.append("page", filters.page);

      const response = await axios.get(
        `http://localhost:4000/api/v1/mitra/complaints?${params}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setComplaints(response.data.complaints);
      } else {
        setError("Failed to fetch complaints");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load complaints";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filters.status, filters.priority, filters.page]);

  return {
    complaints,
    loading,
    error,
    refetch: fetchComplaints,
  };
};

export const useMitraComplaintDetail = (complaintId) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaint = async () => {
    if (!complaintId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/mitra/complaints/${complaintId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setComplaint(response.data.complaint);
      } else {
        setError("Complaint not found");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load complaint details";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const addTimelineEntry = async (formData) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/mitra/${complaintId}/timeline`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setComplaint(response.data.complaint);
        toast.success("Update added successfully!");
        return { success: true };
      } else {
        throw new Error(response.data.message || "Failed to add update");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add timeline entry";
      toast.error(message);
      return { success: false, message };
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  return {
    complaint,
    loading,
    error,
    addTimelineEntry,
    refetch: fetchComplaint,
  };
};
