import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Complaint311 } from "../models/Complaint311.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ---------------- CREATE COMPLAINT ----------------
export const createComplaint = catchAsyncError(async (req, res, next) => {
  const { title, description, category, departmentName, location } = req.body;

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

  // Upload media to Cloudinary
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

  // Create complaint
  const complaint = await Complaint311.create({
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

// ---------------- GET ALL COMPLAINTS ----------------
export const getAllComplaints = catchAsyncError(async (req, res, next) => {
  const complaints = await Complaint311.find().sort({ createdAt: -1 }).lean();

  if (!complaints || complaints.length === 0) {
    return next(new ErrorHandler("No complaints found.", 404));
  }

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints,
  });
});

// ---------------- GET DEPARTMENT COMPLAINTS ----------------
export const getDepartmentComplaints = catchAsyncError(
  async (req, res, next) => {
    const departmentName = req.deptContext || req.query.department;
    if (!departmentName)
      return next(new ErrorHandler("Department context not found", 400));

    const complaints = await Complaint311.find({ departmentName })
      .sort({ createdAt: -1 })
      .lean();

    if (!complaints || complaints.length === 0) {
      return next(
        new ErrorHandler("No complaints found for this department.", 404)
      );
    }

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  }
);

// ---------------- GET COMPLAINT BY ID ----------------
export const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const departmentName = req.deptContext;

    const complaint = await Complaint311.findById(complaintId)
      .select("title description category departmentName media")
      .lean();

    if (!complaint || complaint.departmentName !== departmentName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: complaint does not belong to department",
      });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(404).json({ success: false, message: "Complaint not found" });
  }
};
