import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:4000/api/v1/complaint";

export function useMyComplaints({ page = 1, limit = 10, status } = {}) {
  const [data, setData] = useState({
    complaints: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useMemo(() => {
    const p = { page, limit };
    if (status && status !== "all") p.status = status;
    return p;
  }, [page, limit, status]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    axios
      .get(`${BASE}/my`, { params, withCredentials: true })
      .then((res) => {
        if (!active) return;
        setData({
          complaints: res?.data?.complaints || [],
          total: res?.data?.total ?? 0,
          page: res?.data?.page ?? 1,
          totalPages: res?.data?.totalPages ?? 1,
        });
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
  }, [params]);

  return { ...data, loading, error };
}

export async function fetchCountByStatus(status) {
  // Helper for accurate counts via small calls
  try {
    const res = await axios.get(`${BASE}/my`, {
      params: { page: 1, limit: 1, status },
      withCredentials: true,
    });
    return res?.data?.total ?? 0;
  } catch {
    return 0;
  }
}
