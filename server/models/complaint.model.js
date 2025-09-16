import mongoose from "mongoose";

// ======================= Subschemas =======================

// Timeline: Only assigned Mitra can add; media required; caption optional
const complaintTimelineItemSchema = new mongoose.Schema(
  {
    addedByType: {
      type: String,
      enum: ["mitra", "department", "system"],
      required: true,
    },
    addedBy: {
      type: String, // agar mitra hua to ObjectId string, agar dept hua to dept name
      required: true,
    },
    media: [
      {
        type: String,
        trim: true,
      },
    ],
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Escalation: to admin only; by system (SLA breach) or officer (manual)
const escalationSchema = new mongoose.Schema(
  {
    isEscalated: { type: Boolean, default: false },
    type: { type: String, enum: ["system", "officer"], default: undefined },
    to: { type: String, enum: ["admin"], default: undefined }, // current design: always admin
    reason: { type: String, trim: true, default: undefined }, // required if type="officer"
    fromDeptName: { type: String, trim: true, default: undefined },
    at: { type: Date, default: undefined },
  },
  { _id: false }
);

// SLA: dueAt (+2 days from createdAt), breached flag
const slaSchema = new mongoose.Schema(
  {
    dueAt: { type: Date, required: true },
    breached: { type: Boolean, default: false },
  },
  { _id: false }
);

// ======================= Main Schema =======================

const complaintSchema = new mongoose.Schema(
  {
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Core details
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "" }, // frontend sets
    departmentName: { type: String, required: true, trim: true, default: "" }, // frontend sets
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Media at creation
    media: {
      images: [{ type: String, trim: true }],
      videos: [{ type: String, trim: true }],
    },

    // Location
    location: {
      lat: { type: Number, required: true, default: null, min: -90, max: 90 },
      lng: { type: Number, required: true, default: null, min: -180, max: 180 },
      gmapLink: { type: String, required: true, trim: true, default: "" },
      location: { type: String, trim: true, default: "" },
    },

    // Assignment
    assignedMitraId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mitra",
      default: null,
      index: true,
    },

    // Status & progress
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected", "escalated"],
      default: "pending",
      index: true,
    },
    zone: { type: String, required: true }, // Populate from User.zone

    timeline: [complaintTimelineItemSchema],
    sla: slaSchema,
    escalation: escalationSchema,

    // Feedback (post-resolution)
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: undefined },
      comment: { type: String, trim: true, default: undefined },
      at: { type: Date, default: undefined },
    },

    resolvedAt: { type: Date, default: undefined },
  },
  { timestamps: true }
);

// ======================= Hooks =======================

// Auto-set SLA dueAt to createdAt + 2 days if missing
complaintSchema.pre("validate", function (next) {
  if (!this.sla) this.sla = {};
  if (!this.sla.dueAt) {
    const created = this.createdAt ? new Date(this.createdAt) : new Date();
    this.sla.dueAt = new Date(created.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 days
  }
  next();
});

// * System escalation due to SLA breach.
// * - Sets sla.breached = true
// * - Sets status -> "escalated"
// * - Fills escalation object with type="system", to="admin"
// */
complaintSchema.methods.escalateSystem = async function () {
  // SLA breached
  this.sla = this.sla || {};
  this.sla.breached = true;

  // Update status
  this.status = "escalated";

  // Fill escalation subdoc (aligned with schema)
  this.escalation = {
    isEscalated: true,
    type: "system", // enum match ["system", "officer"]
    to: "admin", // enum match ["admin"]
    reason: "Time limit over", // not needed for system
    fromDeptName: this.departmentName || "", // safe fallback
    at: new Date(),
  };
  this.timeline.push({
    addedByType: "system",
    addedBy: "system",
    media: [],
    caption: "Automatically escalated due to SLA breach",
    at: new Date(),
  });

  await this.save();
  return this;
};

// ======================= Export =======================

export const Complaint = mongoose.model("Complaint", complaintSchema);
