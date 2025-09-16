import express from "express";
import { requireDepartmentAuth } from "../middlewares/departmentSession.js";
import {
  listDepartmentComplaints,
  getDepartmentComplaintDetail,
  assignMitraToComplaint,
  updateComplaintStatus,
  addDepartmentNote,
  getZoneStatusCounts,
  getRecentComplaints,
  getMonthlyTrends,
} from "../controllers/departmentComplaints.controller.js";

const router = express.Router();

// List complaints (with filters, pagination)
router.get("/", requireDepartmentAuth, listDepartmentComplaints);

//zone stats
router.get("/status-by-zone", requireDepartmentAuth, getZoneStatusCounts);

router.get("/recent", requireDepartmentAuth, getRecentComplaints);
router.get("/monthly-trends", requireDepartmentAuth, getMonthlyTrends);

// Get complaint details by id (securely scoped)
router.get("/:id", requireDepartmentAuth, getDepartmentComplaintDetail);

// Assign mitra to complaint
router.patch("/:id/assign", requireDepartmentAuth, assignMitraToComplaint);

// Update complaint status
router.patch("/:id/status", requireDepartmentAuth, updateComplaintStatus);

// Add department note/timeline (no media)
router.patch("/:id/note", requireDepartmentAuth, addDepartmentNote);

export default router;
