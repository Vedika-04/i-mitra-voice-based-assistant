import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:4000/api/v1/department";

export function useDepartmentComplaints({
  page = 1,
  limit = 10,
  status = "all",
  priority = "all",
  search = "",
}) {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (status && status !== "all") params.append("status", status);
        if (priority && priority !== "all") params.append("priority", priority);
        if (search.trim()) params.append("search", search.trim());

        const response = await axios.get(
          `${BASE}/complaints?${params.toString()}`,
          {
            withCredentials: true,
          }
        );

        if (!active) return;

        const data = response.data;
        setComplaints(data.complaints || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        if (!active) return;
        setError(err);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchComplaints();

    return () => {
      active = false;
    };
  }, [page, limit, status, priority, search]);

  return { complaints, total, totalPages, loading, error };
}
