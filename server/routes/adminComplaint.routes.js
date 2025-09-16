// routes/adminComplaint.routes.js
import express from "express";
import { requireAdminAuth } from "../middlewares/adminSession.js"; // using your saved middleware name
import {
  getOverviewAnalytics,
  listComplaints,
  getComplaintById,
  getDepartmentAnalytics,
  getZoneAnalytics,
  getTrends,
  getEscalationAnalytics,
  exportComplaints,
  exportDepartments,
  exportZones,
  exportEscalations,
  exportResolutions,
  getAIDepartmentAnalysis,
  getHeatMapData,
} from "../controllers/adminComplaint.controller.js";

const router = express.Router();

// All routes are read-only and protected for superadmin
router.get("/analytics/overview", requireAdminAuth, getOverviewAnalytics);
router.get("/complaints/:id", requireAdminAuth, getComplaintById);
router.get("/complaints", requireAdminAuth, listComplaints);

// Department-wise stats
router.get("/analytics/departments", requireAdminAuth, getDepartmentAnalytics);

// Zone-wise stats
router.get("/analytics/zones", requireAdminAuth, getZoneAnalytics);

// Trends over time
// Query: interval=day|week|month
router.get("/analytics/trends", requireAdminAuth, getTrends);

// Escalation analytics
router.get("/analytics/escalations", requireAdminAuth, getEscalationAnalytics);

// Export routes
router.get("/reports/complaints", requireAdminAuth, exportComplaints);
router.get("/reports/departments", requireAdminAuth, exportDepartments);
router.get("/reports/zones", requireAdminAuth, exportZones);
router.get("/reports/escalations", requireAdminAuth, exportEscalations);
router.get("/reports/resolutions", requireAdminAuth, exportResolutions);

//fetching location
router.get("/getheatmap", requireAdminAuth, getHeatMapData);

// AI Analysis
router.get(
  "/analytics/ai/department",
  requireAdminAuth,
  getAIDepartmentAnalysis
);

export default router;
