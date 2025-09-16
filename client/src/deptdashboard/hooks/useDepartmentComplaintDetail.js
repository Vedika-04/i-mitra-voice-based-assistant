import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE = "http://localhost:4000/api/v1/department";

export function useDepartmentComplaintDetail(complaintId) {
  const [complaint, setComplaint] = useState(null);
  const [mitras, setMitras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!complaintId) return;
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [complaintRes, mitraRes] = await Promise.all([
          axios.get(`${BASE}/complaints/${complaintId}`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/mitra`, { withCredentials: true }),
        ]);

        if (!active) return;

        setComplaint(complaintRes?.data?.complaint || null);
        setMitras(mitraRes?.data?.mitras || []);
      } catch (err) {
        if (!active) return;
        setError(err);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [complaintId]);

  const assignMitra = async (mitraId) => {
    try {
      await axios.patch(
        `${BASE}/complaints/${complaintId}/assign`,
        { mitraId },
        { withCredentials: true }
      );

      // Update local state
      const assignedMitra = mitras.find((m) => m._id === mitraId);
      setComplaint((prev) => ({ ...prev, assignedMitraId: assignedMitra }));

      toast.success("Mitra assigned successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Error assigning Mitra";
      toast.error(msg);
      throw error;
    }
  };

  const updateStatus = async (statusData) => {
    try {
      const response = await axios.patch(
        `${BASE}/complaints/${complaintId}/status`,
        statusData,
        { withCredentials: true }
      );

      // Update local state
      setComplaint((prev) => ({
        ...prev,
        status: statusData.status,
        timeline: response.data?.timeline || prev.timeline,
      }));

      toast.success("Status updated successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Error updating status";
      toast.error(msg);
      throw error;
    }
  };

  const addNote = async (noteText) => {
    try {
      const response = await axios.patch(
        `${BASE}/complaints/${complaintId}/note`,
        { note: noteText },
        { withCredentials: true }
      );

      // Update local state
      setComplaint((prev) => ({
        ...prev,
        timeline: response.data?.timeline || prev.timeline,
      }));

      toast.success("Note added successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Error adding note";
      toast.error(msg);
      throw error;
    }
  };

  return {
    complaint,
    mitras,
    loading,
    error,
    setComplaint,
    assignMitra,
    updateStatus,
    addNote,
  };
}
