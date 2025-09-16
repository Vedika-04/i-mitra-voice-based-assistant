import { Mitra } from "../models/mitra.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Register new Mitra (by department officer)
export const registerMitra = async (req, res) => {
  try {
    let { fullName, mobile, zone } = req.body;
    const departmentName = req.deptContext;
    console.log("controller Hit");

    if (!fullName || !mobile || !zone) {
      return res
        .status(400)
        .json({ success: false, message: "Full name, mobile, zone required" });
    }

    // Validate mobile number (10 digits only)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile must be 10 digits only" });
    }

    // Format to +91XXXXXXXXXX
    mobile = `+91${mobile}`;

    // Duplicate check with formatted mobile
    const exists = await Mitra.findOne({ mobile });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Mitra with this mobile already exists",
      });
    }

    // Check profile image file
    if (!req.file || !req.file.path) {
      return res
        .status(400)
        .json({ success: false, message: "Profile image is required" });
    }

    const cloudRes = await uploadOnCloudinary(req.file.path);
    if (!cloudRes || !cloudRes.secure_url) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to upload profile image" });
    }

    const profileImg = cloudRes.secure_url;

    const mitra = await Mitra.create({
      fullName,
      mobile, // already formatted
      departmentName,
      zone,
      profileImg: profileImg || "",
    });

    res.status(201).json({ success: true, mitra });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// List assignable Mitras of this department (filtered)
export const listDepartmentMitras = async (req, res) => {
  try {
    const departmentName = req.deptContext;
    const { zone, activeOnly = "true", search } = req.query;

    const filters = { departmentName };
    if (zone) filters.zone = zone;
    if (activeOnly === "true") filters.isActive = true;
    let query = Mitra.find(filters);

    // Search/filter by name or mobile if provided
    if (search) {
      query = query.find({
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
        ],
      });
    }
    const mitras = await query
      .select(
        "fullName mobile profileImg zone isActive assignedComplaints lastAssignedAt"
      )
      .lean();
    res.json({ success: true, mitras });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
