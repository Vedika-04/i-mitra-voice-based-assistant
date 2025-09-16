import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:4000/api/v1/complaint";

export function useComplaintDetail(complaintId) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!complaintId) return;
    let active = true;
    setLoading(true);
    setError(null);
    axios
      .get(`${BASE}/${complaintId}`, { withCredentials: true })
      .then((res) => {
        if (!active) return;
        setComplaint(res?.data?.complaint || null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [complaintId]);

  return { complaint, loading, error, setComplaint };
}

export async function submitFeedbackApi(complaintId, payload) {
  const BASE = "http://localhost:4000/api/v1/complaint";
  const res = await axios.post(`${BASE}/${complaintId}/feedback`, payload, {
    withCredentials: true,
  });
  return res?.data;
}
