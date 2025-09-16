// import ErrorHandler from "../middlewares/error.js";
// import { catchAsyncError } from "../middlewares/catchAsyncError.js";
// import { Complaint } from "../models/complaint.model.js";
// import { Mitra } from "../models/mitra.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";

// /* ================= Helpers ================= */

// // Upload images/videos from multipart or accept already-uploaded secure_url
// async function extractAndUploadMedia(req) {
//   const images = [];
//   const videos = [];

//   const imageFiles = Array.isArray(req.files?.images) ? req.files.images : [];
//   const videoFiles = Array.isArray(req.files?.videos) ? req.files.videos : [];

//   for (const f of imageFiles) {
//     if (f.secure_url) {
//       images.push(f.secure_url);
//     } else if (f.path) {
//       const up = await uploadOnCloudinary(f.path);
//       if (up?.secure_url) images.push(up.secure_url);
//     }
//   }

//   for (const f of videoFiles) {
//     if (f.secure_url) {
//       videos.push(f.secure_url);
//     } else if (f.path) {
//       const up = await uploadOnCloudinary(f.path);
//       if (up?.secure_url) videos.push(up.secure_url);
//     }
//   }

//   return { images, videos };
// }

// function hideRawCoords(complaintObj) {
//   if (complaintObj?.location) {
//     delete complaintObj.location.lat;
//     delete complaintObj.location.lng;
//   }
//   return complaintObj;
// }

// function clampConfidence(x) {
//   return typeof x === "number" ? Math.max(0, Math.min(1, x)) : null;
// }

// /* ================= Controllers ================= */

// // POST /api/v1/complaints
// // Citizen: File a complaint (department/category come from client AI suggestion)
// // NOTE: Do not accept priority from user; always "medium"
// export const createComplaint = catchAsyncError(async (req, res, next) => {
//   const userId = req.user?._id;
//   if (!userId) return next(new ErrorHandler("Unauthorized", 401));

//   const { title, description } = req.body;

//   if (!title?.trim() || !description?.trim()) {
//     return next(new ErrorHandler("Title and description are required.", 400));
//   }

//   // Parse optional nested location fields (from FormData or JSON)
//   const loc = req.body?.location || {};
//   const lat = Number.isFinite(+loc.lat) ? +loc.lat : null;
//   const lng = Number.isFinite(+loc.lng) ? +loc.lng : null;
//   const addressManual = loc?.addressManual?.trim?.() || "";
//   const gmapLink = loc?.gmapLink?.trim?.() || "";

//   // Upload media (if provided)
//   const { images, videos } = await extractAndUploadMedia(req);

//   // Read client-side AI suggestion (stringified JSON in FormData or raw JSON)
//   let aiSuggestion = null;
//   if (req.body?.aiSuggestion) {
//     try {
//       aiSuggestion =
//         typeof req.body.aiSuggestion === "string"
//           ? JSON.parse(req.body.aiSuggestion)
//           : req.body.aiSuggestion;
//     } catch {
//       // ignore parse error; will fallback below
//     }
//   }

//   // Directly trust client (as per your decision) with defensive fallbacks
//   const departmentName =
//     typeof aiSuggestion?.department === "string" &&
//     aiSuggestion.department.trim()
//       ? aiSuggestion.department.trim()
//       : "Other";

//   const category =
//     typeof aiSuggestion?.category === "string" && aiSuggestion.category.trim()
//       ? aiSuggestion.category.trim().slice(0, 60)
//       : "Other";

//   const confidence = clampConfidence(aiSuggestion?.confidence);

//   // Generate readable complaintId
//   const complaintId = await Complaint.generateComplaintId();

//   // Create complaint
//   const doc = await Complaint.create({
//     complaintId,
//     citizenId: userId,
//     title: title.trim(),
//     description: description.trim(),
//     priority: "medium", // never from client
//     media: { images, videos },
//     location: { lat, lng, addressManual, gmapLink },
//     departmentName, // from client AI
//     category, // from client AI
//     ai: {
//       modelVersion: "gemini-2.5-flash-client",
//       predictedDepartment: departmentName,
//       predictedCategory: category,
//       confidence,
//       // raw omitted intentionally
//     },
//     // status defaults to "pending"
//     // SLA dueAt auto-set by pre-validate hook
//   });

//   const out = hideRawCoords(doc.toObject());

//   res.status(201).json({
//     success: true,
//     message: "Complaint filed successfully.",
//     complaint: out,
//   });
// });

// // GET /api/v1/complaints/my
// // Citizen: Track previous complaints (list + pagination/filters)
// export const listMyComplaints = catchAsyncError(async (req, res, next) => {
//   const userId = req.user?._id;
//   if (!userId) return next(new ErrorHandler("Unauthorized", 401));

//   const data = await Complaint.listForCitizen(userId, {
//     status: req.query.status,
//     from: req.query.from,
//     to: req.query.to,
//     page: req.query.page,
//     limit: req.query.limit,
//     sort: req.query.sort,
//   });

//   res.status(200).json({
//     success: true,
//     ...data,
//   });
// });

// // GET /api/v1/complaints/:complaintId
// // Citizen: Complaint details (with timeline and optional Mitra info)
// export const getComplaintDetails = catchAsyncError(async (req, res, next) => {
//   const userId = req.user?._id;
//   if (!userId) return next(new ErrorHandler("Unauthorized", 401));

//   const { complaintId } = req.params;

//   const complaint = await Complaint.findByComplaintId(complaintId, {
//     populateMitra: true,
//   });

//   if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));
//   if (String(complaint.citizenId) !== String(userId)) {
//     return next(new ErrorHandler("Forbidden", 403));
//   }

//   const out = hideRawCoords(complaint.toObject());

//   res.status(200).json({
//     success: true,
//     complaint: out,
//   });
// });

// // PATCH /api/v1/complaints/:complaintId/start
// // Officer-only: Assign Mitra and mark complaint in_progress
// export const startComplaintWithMitra = catchAsyncError(
//   async (req, res, next) => {
//     const { complaintId } = req.params;
//     const { mitraId } = req.body;

//     if (!mitraId) return next(new ErrorHandler("mitraId is required.", 400));

//     const complaint = await Complaint.findByComplaintId(complaintId);
//     if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

//     const mitra = await Mitra.findById(mitraId);
//     if (!mitra || !mitra.isActive) {
//       return next(new ErrorHandler("Invalid or inactive Mitra.", 400));
//     }

//     await complaint.startWithMitra(mitra._id);
//     await mitra.assignComplaint(complaint.complaintId, {
//       updateTimestamp: true,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Complaint marked in-progress and Mitra assigned.",
//       complaintId: complaint.complaintId,
//     });
//   }
// );

// // PATCH /api/v1/complaints/:complaintId/resolve
// // Officer-only: Resolve complaint
// export const resolveComplaint = catchAsyncError(async (req, res, next) => {
//   const { complaintId } = req.params;

//   const complaint = await Complaint.findByComplaintId(complaintId);
//   if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

//   await complaint.resolve();

//   // Free Mitra workload
//   if (complaint.assignedMitraId) {
//     const mitra = await Mitra.findById(complaint.assignedMitraId);
//     if (mitra) await mitra.unassignComplaint(complaint.complaintId);
//   }

//   res.status(200).json({
//     success: true,
//     message: "Complaint resolved.",
//     complaintId: complaint.complaintId,
//   });
// });

// // POST /api/v1/complaints/:complaintId/timeline
// // Mitra-only: Add timeline entry (media required, caption optional)
// export const addTimelineByMitra = catchAsyncError(async (req, res, next) => {
//   const { complaintId } = req.params;

//   const complaint = await Complaint.findByComplaintId(complaintId);
//   if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

//   const mitraId = req.user?._id; // Mitra auth should set this
//   if (!mitraId) return next(new ErrorHandler("Unauthorized", 401));

//   // Accept either URLs in body or uploaded files
//   let mediaUrls = [];
//   if (Array.isArray(req.body?.media) && req.body.media.length > 0) {
//     mediaUrls = req.body.media.filter(Boolean);
//   } else {
//     const mediaFiles = Array.isArray(req.files?.media) ? req.files.media : [];
//     for (const f of mediaFiles) {
//       if (f.secure_url) mediaUrls.push(f.secure_url);
//       else if (f.path) {
//         const up = await uploadOnCloudinary(f.path);
//         if (up?.secure_url) mediaUrls.push(up.secure_url);
//       }
//     }
//   }

//   const caption = req.body?.caption || "";

//   const updated = await complaint.addTimelineByMitra(
//     mitraId,
//     mediaUrls,
//     caption
//   );

//   res.status(201).json({
//     success: true,
//     message: "Timeline updated.",
//     timeline: updated.timeline.slice(-1)[0],
//   });
// });

// // PATCH /api/v1/complaints/:complaintId/escalate/system
// // System/Admin: SLA breach escalation
// export const escalateSystem = catchAsyncError(async (req, res, next) => {
//   const { complaintId } = req.params;

//   const complaint = await Complaint.findByComplaintId(complaintId);
//   if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

//   await complaint.escalateSystem();

//   res.status(200).json({
//     success: true,
//     message: "Complaint escalated to admin (system).",
//     complaintId: complaint.complaintId,
//   });
// });

// // PATCH /api/v1/complaints/:complaintId/escalate/officer
// // Officer-only: Manual escalation with reason
// export const escalateOfficer = catchAsyncError(async (req, res, next) => {
//   const { complaintId } = req.params;
//   const { reason } = req.body;

//   const complaint = await Complaint.findByComplaintId(complaintId);
//   if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

//   await complaint.escalateOfficer(reason);

//   res.status(200).json({
//     success: true,
//     message: "Complaint escalated to admin (officer).",
//     complaintId: complaint.complaintId,
//   });
// });

// // GET /api/v1/complaints/my/summary
// // Citizen: Quick counts for dashboard cards
// export const myComplaintsSummary = catchAsyncError(async (req, res, next) => {
//   const userId = req.user?._id;
//   if (!userId) return next(new ErrorHandler("Unauthorized", 401));

//   const rows = await Complaint.aggregate([
//     { $match: { citizenId: req.user._id } },
//     { $group: { _id: "$status", count: { $sum: 1 } } },
//   ]);

//   const summary = { total: 0, open: 0, resolved: 0, escalated: 0 };
//   for (const r of rows) {
//     summary.total += r.count;
//     if (r._id === "resolved") summary.resolved = r.count;
//     if (r._id === "escalated") summary.escalated = r.count;
//     if (["pending", "in_progress"].includes(r._id)) summary.open += r.count;
//   }

//   res.status(200).json({
//     success: true,
//     summary,
//   });
// });

import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Complaint } from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ================= CREATE COMPLAINT =================
export const createComplaint = catchAsyncError(async (req, res, next) => {
  const { title, description, category, departmentName, location } = req.body;
  const citizenId = req.user._id;
  const zone = req.user.zone;

  if (!title || !description) {
    return next(new ErrorHandler("Title and description are required.", 400));
  }

  if (!req.files || (!req.files.images && !req.files.videos)) {
    return next(
      new ErrorHandler(
        "At least one media file (image/video) is required.",
        400
      )
    );
  }

  const images = req.files.images || [];
  const videos = req.files.videos || [];

  if (images.length > 5)
    return next(new ErrorHandler("Max 5 images allowed.", 400));
  if (videos.length > 2)
    return next(new ErrorHandler("Max 2 videos allowed.", 400));

  const totalSize = [...images, ...videos].reduce(
    (acc, file) => acc + file.size,
    0
  );
  if (totalSize > 50 * 1024 * 1024) {
    return next(
      new ErrorHandler("Total media size should not exceed 50 MB.", 400)
    );
  }

  const uploadPromises = [...images, ...videos].map((file) =>
    uploadOnCloudinary(file.path)
  );
  const uploadedMedia = await Promise.all(uploadPromises);

  const uploadedImages = uploadedMedia
    .slice(0, images.length)
    .map((m) => m.secure_url);
  const uploadedVideos = uploadedMedia
    .slice(images.length)
    .map((m) => m.secure_url);

  const complaint = await Complaint.create({
    citizenId,
    zone,
    title,
    description,
    category,
    departmentName,
    media: { images: uploadedImages, videos: uploadedVideos },
    location: {
      lat: location?.lat || null,
      lng: location?.lng || null,
      gmapLink: location?.gmapLink || "",
      location: location?.location || "",
    },
  });

  res.status(201).json({
    success: true,
    message: "Complaint created successfully.",
    complaint,
  });
});

// ================= GET CITIZEN COMPLAINTS =================
export const getComplaintDetails = catchAsyncError(async (req, res, next) => {
  const { complaintId } = req.params;
  const citizenId = req.user._id;

  const complaint = await Complaint.findOne({ _id: complaintId, citizenId });
  if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

  res.status(200).json({
    success: true,
    complaint,
  });
});

// ================= LIST MY COMPLAINTS =================
export const listMyComplaints = catchAsyncError(async (req, res, next) => {
  const citizenId = req.user._id;
  const { status, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { citizenId };
  if (status) query.status = status;

  // Pagination options
  const skip = (page - 1) * limit;

  // Fetch complaints directly
  const complaints = await Complaint.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Complaint.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    complaints,
    total,
    page: Number(page),
    totalPages,
  });
});

// ================= ADD TIMELINE BY MITRA =================
export const addTimelineByMitra = catchAsyncError(async (req, res, next) => {
  const { complaintId } = req.params;
  const mitraId = req.user._id;
  const { caption } = req.body;

  if (!req.files || (!req.files.images && !req.files.videos)) {
    return next(
      new ErrorHandler("At least one media file is required for timeline.", 400)
    );
  }

  const images = req.files.images || [];
  const videos = req.files.videos || [];

  const totalSize = [...images, ...videos].reduce(
    (acc, file) => acc + file.size,
    0
  );
  if (totalSize > 50 * 1024 * 1024) {
    return next(
      new ErrorHandler("Total media size should not exceed 50 MB.", 400)
    );
  }

  const uploadPromises = [...images, ...videos].map((file) =>
    uploadOnCloudinary(file.path)
  );
  const uploadedMedia = await Promise.all(uploadPromises);
  const mediaUrls = uploadedMedia.map((m) => m.secure_url);

  const complaint = await Complaint.findOne({ _id: complaintId });
  if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

  await complaint.addTimelineByMitra(mitraId, mediaUrls, caption);

  res.status(200).json({
    success: true,
    message: "Timeline updated successfully.",
    timeline: complaint.timeline,
  });
});

// ================= RESOLVE COMPLAINT =================
export const resolveComplaint = catchAsyncError(async (req, res, next) => {
  const { complaintId } = req.params;

  const complaint = await Complaint.findOne({ _id: complaintId });
  if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

  await complaint.resolve();

  res.status(200).json({
    success: true,
    message: "Complaint resolved successfully.",
    status: complaint.status,
    resolvedAt: complaint.resolvedAt,
  });
});

// ================= ESCALATE SYSTEM =================
export const escalateSystem = catchAsyncError(async (req, res, next) => {
  const { complaintId } = req.params;

  const complaint = await Complaint.findOne({ _id: complaintId });
  if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

  await complaint.escalateSystem();

  res.status(200).json({
    success: true,
    message: "Complaint escalated by system.",
    status: complaint.status,
    escalation: complaint.escalation,
  });
});

// ================= ESCALATE OFFICER =================
export const escalateOfficer = catchAsyncError(async (req, res, next) => {
  const { complaintId } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim())
    return next(new ErrorHandler("Reason is required.", 400));

  const complaint = await Complaint.findOne({ _id: complaintId });
  if (!complaint) return next(new ErrorHandler("Complaint not found.", 404));

  await complaint.escalateOfficer(reason);

  res.status(200).json({
    success: true,
    message: "Complaint escalated by officer.",
    status: complaint.status,
    escalation: complaint.escalation,
  });
});

//Citizen only

// For feedback
export const submitFeedback = catchAsyncError(async (req, res, next) => {
  const { complaintId } = req.params;
  const { rating, comment } = req.body;

  const complaint = await Complaint.findOne({
    _id: complaintId,
    citizenId: req.user._id,
    status: "resolved",
  });

  if (!complaint) {
    return next(
      new ErrorHandler("Complaint not found or not eligible for feedback", 404)
    );
  }

  complaint.feedback = { rating, comment, at: new Date() };
  await complaint.save();

  res.status(200).json({
    success: true,
    message: "Feedback submitted!",
  });
});

//getzone stats
export const getZoneStats = catchAsyncError(async (req, res, next) => {
  const { zone } = req.user.zone; // From JWT

  const stats = await Complaint.aggregate([
    { $match: { "location.zone": zone } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        latest: { $max: "$createdAt" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    stats,
  });
});

//getFilteredComplaints Controller

export const getFilteredComplaints = catchAsyncError(async (req, res, next) => {
  const { status, department, fromDate, toDate } = req.query;
  const query = { citizenId: req.user._id };

  if (status) query.status = status;
  if (department) query.departmentName = department;
  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = new Date(fromDate);
    if (toDate) query.createdAt.$lte = new Date(toDate);
  }

  const complaints = await Complaint.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    complaints,
  });
});
