import { Complaint } from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import mongoose from "mongoose";
import { Mitra } from "../models/mitra.model.js";
// ======================= List Assigned Complaints =======================
export async function listAssignedComplaints(req, res) {
  try {
    const mitraId = req.mitraId;
    const { status, priority, limit = 50, page = 1 } = req.query;
    console.log("hitted");

    const query = { assignedMitraId: mitraId };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select(
        "assignedMitraId title category status priority zone createdAt resolvedAt location.location location.gmapLink"
      )
      .lean();

    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getComplaintDetail(req, res) {
  try {
    const mitraId = req.mitraId;
    const { complaintId } = req.params;

    console.log("hitting : ", complaintId);
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaintId",
      });
    }
    const complaint = await Complaint.findOne({
      _id: complaintId,
      assignedMitraId: mitraId,
    })
      .populate("citizenId", "fullName phone zone address profileimg email")
      .lean();

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found or not assigned to you",
      });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function addTimelineEntry(req, res) {
  try {
    const mitraId = req.mitraId;
    console.log("No prob:", typeof mitraId);

    const { complaintId } = req.params;
    const { caption } = req.body;

    // Multer files
    const files = req.files; // array of uploaded files
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one media item is required",
      });
    }

    // Upload to Cloudinary
    const uploadedMedia = [];
    for (const file of files) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded?.secure_url) uploadedMedia.push(uploaded.secure_url);
    }

    if (uploadedMedia.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload media",
      });
    }
    const mitra = await Mitra.findById(mitraId).select("fullName");
    if (!mitra) {
      return res.status(404).json({
        success: false,
        message: "Mitra not found",
      });
    }
    const complaint = await Complaint.findOne({
      _id: complaintId,
      assignedMitraId: mitraId,
    });
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found or not assigned to you",
      });
    }

    // Add timeline entry
    complaint.timeline.push({
      addedByType: "mitra",
      addedBy: mitra.fullName,
      caption: caption || "",
      media: uploadedMedia,
      at: new Date(),
    });

    if (complaint.status === "pending") complaint.status = "in_progress";

    await complaint.save();
    res.json({ success: true, message: "Timeline entry added", complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
