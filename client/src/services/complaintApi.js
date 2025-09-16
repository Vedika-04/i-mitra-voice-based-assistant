import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

// Dashboard summary cards
export const getMySummary = () =>
  api.get("/complaints/my/summary").then((r) => r.data);

// List my complaints with filters/pagination
export const getMyComplaints = (params) =>
  api.get("/complaints/my", { params }).then((r) => r.data);

// Single complaint details
export const getComplaintDetails = (complaintId) =>
  api.get(`/complaints/${complaintId}`).then((r) => r.data);

// Create complaint (multipart)
export const createComplaint = (formData) =>
  api
    .post("/complaints", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
