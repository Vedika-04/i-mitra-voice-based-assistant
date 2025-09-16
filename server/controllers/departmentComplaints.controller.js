import "dotenv/config";
import { Complaint } from "../models/complaint.model.js";
import { Mitra } from "../models/mitra.model.js";
import { User } from "../models/userModel.js";

// Twilio setup (use your env variables)
import twilio from "twilio";
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// List complaints belonging to this department
export const listDepartmentComplaints = async (req, res) => {
  try {
    const {
      status,
      search,
      priority,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      stats, // <- support for stats parameter
    } = req.query;
    const departmentName = req.deptContext;

    const query = { departmentName };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(toDate);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add this block: STATS QUERY
    if (stats === "true") {
      const [statusStats, zoneStats] = await Promise.all([
        // Status counts
        Complaint.aggregate([
          { $match: { departmentName } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        // Zone-wise counts (and escalated)
        Complaint.aggregate([
          { $match: { departmentName } },
          {
            $group: {
              _id: "$zone",
              total: { $sum: 1 },
              escalated: {
                $sum: { $cond: [{ $eq: ["$status", "escalated"] }, 1, 0] },
              },
            },
          },
          { $project: { zone: "$_id", total: 1, escalated: 1, _id: 0 } },
        ]),
      ]);

      // Format stats
      const statsObj = {
        totalComplaints: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        rejected: 0,
        escalated: 0,
      };
      statusStats.forEach((stat) => {
        statsObj[stat._id] = stat.count;
        statsObj.totalComplaints += stat.count;
      });

      return res.json({
        success: true,
        stats: statsObj,
        zoneStats,
      });
    }

    // Regular paginated complaints list
    const skip = (page - 1) * limit;
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Complaint.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      complaints,
      total,
      page: Number(page),
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get detailed info for a single complaint (with assigned Mitra and citizen info)
export const getDepartmentComplaintDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const departmentName = req.deptContext;

    const complaint = await Complaint.findById(id)
      .populate(
        "assignedMitraId",
        "fullName mobile profileImg departmentName zone"
      )
      .populate("citizenId", "fullName phone zone address profileimg email")
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

//Actions
// Assign Mitra to a complaint
// assignMitraToComplaint.js
export const assignMitraToComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { mitraId } = req.body;
    const departmentName = req.deptContext;

    const complaint = await Complaint.findById(id);
    if (!complaint || complaint.departmentName !== departmentName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: complaint does not belong to department",
      });
    }

    // ✅ Check if already assigned
    if (complaint.assignedMitraId) {
      return res.status(400).json({
        success: false,
        message: "This complaint is already assigned to a Mitra",
      });
    }

    const mitra = await Mitra.findById(mitraId);
    if (!mitra || mitra.departmentName !== departmentName) {
      return res.status(400).json({
        success: false,
        message: "Mitra not valid for this department",
      });
    }

    // assign mitra
    complaint.assignedMitraId = mitra._id;

    // push timeline entry 👇
    complaint.timeline.push({
      addedByType: "department",
      addedBy: departmentName, // 👈 ab yehi dept ka naam save hoga
      media: [],
      caption: `Complaint assigned to Mitra: ${mitra.fullName}`,
      at: new Date(),
    });

    await complaint.save();

    // optional workload update
    if (typeof mitra.assignComplaint === "function") {
      await mitra.assignComplaint(complaint._id.toString());
    } else {
      mitra.complaints.push(complaint._id);
      await mitra.save();
    }

    res.json({
      success: true,
      message: "Mitra assigned successfully",
      assignedMitraId: mitra._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Change status of complaint (with validation)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote, rejectReason, escalationReason } = req.body;
    const departmentName = req.deptContext;

    const complaint = await Complaint.findById(id);
    if (!complaint || complaint.departmentName !== departmentName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: complaint does not belong to department",
      });
    }

    // ❌ Already final status
    if (["resolved", "rejected", "escalated"].includes(complaint.status)) {
      return res.status(400).json({
        success: false,
        message: `Complaint already ${complaint.status}, further updates are not allowed`,
      });
    }

    // ✅ pending -> in_progress
    if (status === "in_progress") {
      if (!complaint.assignedMitraId) {
        return res.status(400).json({
          success: false,
          message: "Assign a Mitra before moving to in_progress",
        });
      }
      if (complaint.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Only pending complaints can be moved to in_progress",
        });
      }

      complaint.status = "in_progress";
      complaint.timeline.push({
        addedByType: "department",
        addedBy: departmentName,
        media: [],
        caption: "Marked as in progress",
        at: new Date(),
      });
    }

    // ✅ in_progress -> resolved
    else if (status === "resolved") {
      if (!resolutionNote) {
        return res.status(400).json({
          success: false,
          message: "Resolution note is required",
        });
      }
      if (complaint.status !== "in_progress") {
        return res.status(400).json({
          success: false,
          message: "Only in_progress complaints can be resolved",
        });
      }

      complaint.status = "resolved";
      complaint.resolvedAt = new Date();
      complaint.timeline.push({
        addedByType: "department",
        addedBy: departmentName,
        media: [],
        caption: `Resolved: ${resolutionNote}`,
        at: new Date(),
      });

      // Unassign Mitra after resolution
      if (complaint.assignedMitraId) {
        const mitra = await Mitra.findById(complaint.assignedMitraId);
        if (mitra && typeof mitra.unassignComplaint === "function") {
          await mitra.unassignComplaint(complaint._id.toString());
        }
      }
    }

    // ✅ pending/in_progress -> rejected
    else if (status === "rejected") {
      if (!rejectReason) {
        return res.status(400).json({
          success: false,
          message: "Reject reason is required",
        });
      }
      if (!["pending", "in_progress"].includes(complaint.status)) {
        return res.status(400).json({
          success: false,
          message: "Only pending or in_progress complaints can be rejected",
        });
      }

      complaint.status = "rejected";
      complaint.timeline.push({
        addedByType: "department",
        addedBy: departmentName,
        media: [],
        caption: `Rejected: ${rejectReason}`,
        at: new Date(),
      });

      // Unassign Mitra after rejection
      if (complaint.assignedMitraId) {
        const mitra = await Mitra.findById(complaint.assignedMitraId);
        if (mitra && typeof mitra.unassignComplaint === "function") {
          await mitra.unassignComplaint(complaint._id.toString());
        }
      }
    }

    // ✅ pending/in_progress -> escalated
    else if (status === "escalated") {
      if (!["pending", "in_progress"].includes(complaint.status)) {
        return res.status(400).json({
          success: false,
          message: "Only pending or in_progress complaints can be escalated",
        });
      }
      if (!escalationReason) {
        return res.status(400).json({
          success: false,
          message: "Escalation reason is required",
        });
      }

      complaint.status = "escalated";
      complaint.escalation = {
        isEscalated: true,
        type: "officer",
        to: "admin",
        reason: escalationReason,
        fromDeptName: departmentName,
        at: new Date(),
      };
      complaint.timeline.push({
        addedByType: "department",
        addedBy: departmentName,
        media: [],
        caption: `Escalated: ${escalationReason}`,
        at: new Date(),
      });

      // Unassign Mitra after escalation
      if (complaint.assignedMitraId) {
        const mitra = await Mitra.findById(complaint.assignedMitraId);
        if (mitra && typeof mitra.unassignComplaint === "function") {
          await mitra.unassignComplaint(complaint._id.toString());
        }
      }
    }

    // ❌ Invalid status
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid status transition",
      });
    }

    await complaint.save();
    const citizen = await User.findById(complaint.citizenId);
    if (!citizen) {
      return res
        .status(404)
        .json({ success: false, message: "Citizen not found" });
    }
try {
  console.log("About to send SMS to:", citizen.phone);
  const smsMessage = `Dear ${citizen.fullName}, your complaintId: ${complaint._id} is marked as ${complaint.status} by ${complaint.departmentName} department. Please check dashboard for more details`;

  if (complaint.status === "in_progress" || complaint.status === "resolved") {
    // ---------- SMS ----------
    await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: citizen.phone,
    });
    console.log("SMS SENT:", smsMessage, citizen.phone);

    // ---------- CALL ----------
    const callMessage = `Hello ${citizen.fullName}, your complaint with ID ${complaint._id} is marked as ${complaint.status} by ${complaint.departmentName} department. Please check dashboard for more details.`;

    await client.calls.create({
      twiml: `<Response><Say voice="alice" language="en-US">${callMessage}</Say></Response>`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: citizen.phone,
    });
    console.log("CALL INITIATED:", callMessage, citizen.phone);
  }
} catch (twilioErr) {
  console.error("Twilio error:", twilioErr);
}


    res.json({
      success: true,
      status: complaint.status,
      resolvedAt: complaint.resolvedAt,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a department note/timeline entry (no media)
export const addDepartmentNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const departmentName = req.deptContext;

    if (!note || !note.trim())
      return res
        .status(400)
        .json({ success: false, message: "Note text required" });

    const complaint = await Complaint.findById(id);
    if (!complaint || complaint.departmentName !== departmentName)
      return res.status(403).json({
        success: false,
        message: "Forbidden: complaint does not belong to department",
      });

    complaint.timeline.push({
      addedByType: "department",
      addedBy: departmentName, // can use officer/admin id if you want
      media: [],
      caption: `Dept note: ${note}`,
      at: new Date(),
    });

    await complaint.save();
    res.json({ success: true, message: "Note added to timeline" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Register new Mitra (by department officer)
export const registerMitra = async (req, res) => {
  try {
    const { fullName, mobile, zone, profileImg } = req.body;
    const departmentName = req.deptContext;

    if (!fullName || !mobile || !zone)
      return res
        .status(400)
        .json({ success: false, message: "Full name, mobile, zone required" });

    // Duplicate check
    const exists = await Mitra.findOne({ mobile });
    if (exists)
      return res.status(409).json({
        success: false,
        message: "Mitra with this mobile already exists",
      });

    const mitra = await Mitra.create({
      fullName,
      mobile,
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

//zone stats of that department
export const getZoneStatusCounts = async (req, res) => {
  try {
    const { zone } = req.query;
    const departmentName = req.deptContext;

    if (!zone) {
      return res.status(400).json({
        success: false,
        message: "Zone parameter is required",
      });
    }

    // Aggregate complaints by status for the selected zone and department
    const statusCounts = await Complaint.aggregate([
      {
        $match: {
          departmentName,
          zone,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format response - ensure all statuses are included with 0 count if not present
    const statusMap = {
      pending: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
      escalated: 0,
    };

    statusCounts.forEach((item) => {
      if (statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      zone,
      counts: statusMap,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// In departmentComplaints.controller.js
export const getRecentComplaints = async (req, res) => {
  console.log("Hitt");

  try {
    const departmentName = req.deptContext;
    console.log(departmentName);

    const recentComplaints = await Complaint.find({ departmentName })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("citizenId", "fullName zone")
      .select("title status priority createdAt")
      .lean();

    res.json({ success: true, complaints: recentComplaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// In departmentComplaints.controller.js
export const getMonthlyTrends = async (req, res) => {
  try {
    const departmentName = req.deptContext;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Complaint.aggregate([
      { $match: { departmentName, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalComplaints: { $sum: 1 },
          resolvedComplaints: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ success: true, monthlyData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
