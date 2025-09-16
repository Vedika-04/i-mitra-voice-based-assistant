import { Complaint } from "../models/complaint.model.js";
import { getDeptAndCatJSON } from "../utils/aiClassifier.js";

class ComplaintTools {
  async submitComplaint(req, args) {
    try {
      const userId = req.user._id;
      const userZone = req.user.zone;

      // AI-powered categorization
      const aiResult = await getDeptAndCatJSON({
        title: args.title || args.description.slice(0, 50),
        description: args.description,
      });

      // Create complaint data
      const complaintData = {
        citizenId: userId,
        zone: userZone,
        title: args.title || args.description.slice(0, 50) + "...",
        description: args.description,
        category: args.category || aiResult.category || "Other",
        departmentName: args.departmentName || aiResult.department || "Other",
        priority: args.priority || "medium",
        location: {
          lat: args.location?.lat || null,
          lng: args.location?.lng || null,
          gmapLink: args.location?.gmapLink || "",
          location: args.location?.address || "",
        },
        media: {
          images: [], // Voice complaints typically don't have initial media
          videos: [],
        },
      };

      const complaint = await Complaint.create(complaintData);

      // Add initial timeline entry
      complaint.timeline.push({
        addedByType: "system",
        addedBy: "dhwani-mitra",
        media: [],
        caption: "Complaint filed via Dhwani-Mitra voice assistant",
        at: new Date(),
      });

      await complaint.save();

      return {
        success: true,
        complaint: {
          id: complaint._id,
          shortId: complaint._id.toString().slice(-6),
          title: complaint.title,
          category: complaint.category,
          department: complaint.departmentName,
          status: complaint.status,
          priority: complaint.priority,
          createdAt: complaint.createdAt,
          eta: this.calculateETA(complaint),
        },
        message: `Complaint successfully filed! Ticket ID: ${complaint._id
          .toString()
          .slice(-6)}`,
      };
    } catch (error) {
      console.error("Submit complaint error:", error);
      return {
        success: false,
        error: error.message || "Failed to create complaint",
        message: "Technical problem आई है। कृपया कुछ देर बाद try करें।",
      };
    }
  }

  async getComplaintDetails(req, args) {
    try {
      const userId = req.user._id;
      let complaintId = args.complaintId;

      // Handle short ID (last 6 digits)
      if (complaintId.length === 6) {
        const complaints = await Complaint.find({
          citizenId: userId,
          _id: { $regex: complaintId + "$" },
        }).limit(1);

        if (complaints.length === 0) {
          return {
            success: false,
            error: "Complaint not found with this ID",
            message: "यह ticket ID valid नहीं है। कृपया पूरा ID check करें।",
          };
        }
        complaintId = complaints[0]._id;
      }

      const complaint = await Complaint.findOne({
        _id: complaintId,
        citizenId: userId,
      });

      if (!complaint) {
        return {
          success: false,
          error: "Complaint not found or access denied",
          message: "Complaint नहीं मिली या आपकी access नहीं है।",
        };
      }

      return {
        success: true,
        complaint: {
          id: complaint._id,
          shortId: complaint._id.toString().slice(-6),
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          department: complaint.departmentName,
          status: complaint.status,
          priority: complaint.priority,
          createdAt: complaint.createdAt,
          resolvedAt: complaint.resolvedAt,
          eta: this.calculateETA(complaint),
          timeline: complaint.timeline.map((entry) => ({
            addedBy: entry.addedBy,
            addedByType: entry.addedByType,
            caption: entry.caption,
            at: entry.at,
            mediaCount: entry.media?.length || 0,
          })),
          location: complaint.location,
          escalation: complaint.escalation,
          feedback: complaint.feedback,
        },
        message: `Ticket ${complaint._id
          .toString()
          .slice(-6)} का detailed status`,
      };
    } catch (error) {
      console.error("Get complaint details error:", error);
      return {
        success: false,
        error: error.message,
        message: "Complaint details fetch करने में problem। कृपया try again।",
      };
    }
  }

  async getUserComplaints(req, args) {
    try {
      const userId = req.user._id;
      const query = { citizenId: userId };

      if (args.status) {
        query.status = args.status;
      }

      const complaints = await Complaint.find(query)
        .sort({ createdAt: -1 })
        .limit(args.limit || 5)
        .select(
          "_id title category departmentName status priority createdAt resolvedAt timeline"
        );

      if (complaints.length === 0) {
        return {
          success: true,
          complaints: [],
          message: args.status
            ? `कोई ${args.status} complaints नहीं मिली।`
            : "आपकी कोई complaints नहीं हैं।",
        };
      }

      const formattedComplaints = complaints.map((c) => ({
        id: c._id,
        shortId: c._id.toString().slice(-6),
        title: c.title,
        category: c.category,
        department: c.departmentName,
        status: c.status,
        priority: c.priority,
        createdAt: c.createdAt,
        resolvedAt: c.resolvedAt,
        eta: this.calculateETA(c),
        lastUpdate:
          c.timeline?.length > 0
            ? c.timeline[c.timeline.length - 1].at
            : c.createdAt,
      }));

      return {
        success: true,
        complaints: formattedComplaints,
        count: complaints.length,
        message: `आपकी ${complaints.length} complaints मिली।`,
      };
    } catch (error) {
      console.error("Get user complaints error:", error);
      return {
        success: false,
        error: error.message,
        message: "Complaints list fetch करने में problem। कृपया try again।",
      };
    }
  }

  calculateETA(complaint) {
    if (complaint.status === "resolved") return "Completed";
    if (complaint.status === "rejected") return "Rejected";

    if (!complaint.sla?.dueAt) return "ETA not available";

    const now = new Date();
    const due = new Date(complaint.sla.dueAt);
    const diffHours = Math.ceil((due - now) / (1000 * 60 * 60));

    if (diffHours < 0) return "Overdue";
    if (diffHours < 24) return `${diffHours} घंटे में expected`;

    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays} दिन में expected`;
  }
}

export default new ComplaintTools();
