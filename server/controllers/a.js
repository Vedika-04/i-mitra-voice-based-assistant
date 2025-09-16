import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Complaint } from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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
