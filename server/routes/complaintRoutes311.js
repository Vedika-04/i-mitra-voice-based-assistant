// routes/complaint311.routes.js
import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getDepartmentComplaints,
  getComplaintById,
  // updateComplaint,
  // deleteComplaint,
} from "../controllers/complaint311.controller.js";

import { upload } from "../middlewares/multerformedia.js";
import { requireDepartmentAuth } from "../middlewares/departmentSession.js";
const router = express.Router();
// ---------------- CITIZEN ----------------

router.get("/department", requireDepartmentAuth, getDepartmentComplaints);
router.get("/:complaintId", requireDepartmentAuth, getComplaintById);

// Create a complaint (supports images[] and videos[])
router.post(
  "/filecomplaint",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  createComplaint
);

export default router;

// // Create a complaint (supports images[] and videos[])
// router.post(
//   "/filecomplaint",
//   upload.fields([
//     { name: "images", maxCount: 5 },
//     { name: "videos", maxCount: 2 },
//   ]),
//   createComplaint
// );

// Get all complaints (for demo, can show citizen's own complaints)
// router.get("/all", getAllComplaints);

// // // Get complaint details by ID
// router.get("/:complaintId", getComplaintById);

// // Update complaint by ID
// // router.patch("/:complaintId", updateComplaint);

// // // Delete complaint by ID
// // router.delete("/:complaintId", deleteComplaint);
