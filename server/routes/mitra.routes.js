import express from "express";
import { requireMitraAuth } from "../middlewares/mitraSession.js";
import { upload } from "../middlewares/multerformedia.js";
import {
  listAssignedComplaints,
  getComplaintDetail,
  addTimelineEntry,
} from "../controllers/mitraComplaint.controller.js";

const router = express.Router();

// ✅ Get all complaints assigned to this Mitra
router.get("/complaints", requireMitraAuth, listAssignedComplaints);

router.get("/complaints/:complaintId", requireMitraAuth, getComplaintDetail);

router.post(
  "/:complaintId/timeline",
  requireMitraAuth,
  upload.array("media", 10), // Accept up to 10 files, field name = "media"
  addTimelineEntry
);

export default router;
