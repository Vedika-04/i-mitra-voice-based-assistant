// import express from "express";
// import {
//   createComplaint,
//   listMyComplaints,
//   getComplaintDetails,
//   startComplaintWithMitra,
//   resolveComplaint,
//   addTimelineByMitra,
//   escalateSystem,
//   escalateOfficer,
//   myComplaintsSummary,
// } from "../controllers/complaint.controller.js";
// import { isAuthenticated } from "../middlewares/auth.js";
// import { upload } from "../middlewares/multer.middleware.js";

// const router = express.Router();

// /**
//  * Citizen routes
//  * Note: Using multipart for create to support images/videos; timeline also supports media uploads.
//  */

// // Create complaint (multipart: images[], videos[])
// router.post(
//   "/complaints",
//   isAuthenticated,
//   upload.fields([
//     { name: "images", maxCount: 10 },
//     { name: "videos", maxCount: 5 },
//   ]),
//   createComplaint
// );

// // List my complaints (filters via query)
// router.get("/complaints/my", isAuthenticated, listMyComplaints);

// // Quick summary for dashboard cards
// router.get("/complaints/my/summary", isAuthenticated, myComplaintsSummary);

// // Get details for a specific complaint (owned by the user)
// router.get("/complaints/:complaintId", isAuthenticated, getComplaintDetails);

// /**
//  * Officer routes
//  * Add your role guard middleware (e.g., authorizeOfficer) before handlers if available.
//  */

// // Assign Mitra and start (in_progress)
// router.patch(
//   "/complaints/:complaintId/start",
//   isAuthenticated,
//   // authorizeOfficer,
//   startComplaintWithMitra
// );

// // Resolve complaint
// router.patch(
//   "/complaints/:complaintId/resolve",
//   isAuthenticated,
//   // authorizeOfficer,
//   resolveComplaint
// );

// // Officer-triggered escalation with reason
// router.patch(
//   "/complaints/:complaintId/escalate/officer",
//   isAuthenticated,
//   // authorizeOfficer,
//   escalateOfficer
// );

// /**
//  * System/Admin routes
//  * Add your admin/cron guard middleware if available.
//  */

// // System-triggered escalation (SLA breach)
// router.patch(
//   "/complaints/:complaintId/escalate/system",
//   isAuthenticated,
//   // authorizeAdminOrCron,
//   escalateSystem
// );

// /**
//  * Mitra routes
//  * Add your Mitra auth guard if available (ensuring req.user._id is Mitra id).
//  */

// // Add timeline entry (supports media[] uploads or URLs in body)
// router.post(
//   "/complaints/:complaintId/timeline",
//   isAuthenticated,
//   upload.fields([{ name: "media", maxCount: 10 }]),
//   addTimelineByMitra
// );

// export default router;

import express from "express";
import {
  createComplaint,
  getComplaintDetails,
  listMyComplaints,
  addTimelineByMitra,
  resolveComplaint,
  escalateSystem,
  escalateOfficer,
  submitFeedback,
  getZoneStats,
  getFilteredComplaints,
} from "../controllers/complaint.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/multerformedia.js";

const router = express.Router();

// ---------------- CITIZEN ----------------

// Create complaint (multipart: images[], videos[])
router.post(
  "/filecomplaint",
  isAuthenticated,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  createComplaint
);

// List my complaints
router.get("/my", isAuthenticated, listMyComplaints);

// Get complaint details
router.get("/:complaintId", isAuthenticated, getComplaintDetails);

// ---------------- MITRA ----------------

// Add timeline entry (supports media uploads)
router.post(
  "/:complaintId/timeline",
  isAuthenticated,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  addTimelineByMitra
);

// ---------------- OFFICER ----------------

// Resolve complaint
router.patch("/:complaintId/resolve", isAuthenticated, resolveComplaint);

// Escalate by officer with reason
router.patch(
  "/:complaintId/escalate/officer",
  isAuthenticated,
  escalateOfficer
);

// ---------------- SYSTEM / ADMIN ----------------

// System escalation (SLA breach)
router.patch("/:complaintId/escalate/system", isAuthenticated, escalateSystem);

//For citizen only
//feedback
router.post("/:complaintId/feedback", isAuthenticated, submitFeedback);

//zone wise stats
router.get("/stats/zone", isAuthenticated, getZoneStats);

//Complaint Filters
router.get("/my/filtered", isAuthenticated, getFilteredComplaints);

export default router;
