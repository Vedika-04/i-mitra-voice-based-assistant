// import mongoose from "mongoose";

// const mitraSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // Store normalized format (e.g., +91XXXXXXXXXX); validate at controller/service layer
//     mobile: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     // Plain text department, consistent with Complaint.departmentName
//     departmentName: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },

//     // Zone helps suggestion/routing and analytics
//     zone: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },

//     // Cloudinary secure_url (or any CDN URL)
//     profileImg: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     // Multiple complaint support: store human-readable complaintId values (e.g., "CMP-2025-000123")
//     assignedComplaints: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],

//     // Operational flags
//     isActive: {
//       type: Boolean,
//       default: true,
//       index: true,
//     },

//     // Useful for fair assignment and analytics
//     lastAssignedAt: {
//       type: Date,
//       default: null,
//     },

//     // Internal notes (optional)
//     notes: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//   },
//   { timestamps: true }
// );

// // Helpful compound indexes for filtering/selecting Mitras quickly
// mitraSchema.index({ departmentName: 1, zone: 1, isActive: 1 });
// mitraSchema.index({ mobile: 1 }, { unique: true });

// // ============== Statics (optional convenience) ==============

// /**
//  * Quickly list Mitras for assignment by dept/zone/active
//  * filters = { departmentName, zone, activeOnly=true, limit=20, sortLoad=true }
//  * sortLoad: sorts by current workload (assignedComplaints length) then lastAssignedAt
//  */
// mitraSchema.statics.findAssignable = async function (filters = {}) {
//   const {
//     departmentName,
//     zone,
//     activeOnly = true,
//     limit = 20,
//     sortLoad = true,
//   } = filters;

//   const q = {};
//   if (departmentName) q.departmentName = departmentName;
//   if (zone) q.zone = zone;
//   if (activeOnly) q.isActive = true;

//   // Basic sort: low workload first, then least recently assigned
//   const docs = await this.find(q, {
//     fullName: 1,
//     mobile: 1,
//     departmentName: 1,
//     zone: 1,
//     profileImg: 1,
//     assignedComplaints: 1,
//     lastAssignedAt: 1,
//     isActive: 1,
//   }).limit(Number(limit));

//   if (!sortLoad) return docs;

//   return docs.sort((a, b) => {
//     const loadA = a.assignedComplaints?.length || 0;
//     const loadB = b.assignedComplaints?.length || 0;
//     if (loadA !== loadB) return loadA - loadB;
//     const tA = a.lastAssignedAt ? new Date(a.lastAssignedAt).getTime() : 0;
//     const tB = b.lastAssignedAt ? new Date(b.lastAssignedAt).getTime() : 0;
//     return tA - tB;
//   });
// };

// /**
//  * Assign a complaintId to a Mitra (id string like "CMP-2025-000123")
//  * Options: { updateTimestamp=true } to set lastAssignedAt
//  */
// mitraSchema.methods.assignComplaint = async function (
//   complaintId,
//   options = { updateTimestamp: true }
// ) {
//   if (!complaintId || typeof complaintId !== "string") {
//     throw new Error("complaintId must be a non-empty string");
//   }
//   if (!this.assignedComplaints.includes(complaintId)) {
//     this.assignedComplaints.push(complaintId);
//   }
//   if (options?.updateTimestamp) {
//     this.lastAssignedAt = new Date();
//   }
//   await this.save();
//   return this;
// };

// /**
//  * Remove a complaintId from the current workload (on resolution)
//  * If you prefer to keep history here, skip removal and let Complaints collection be the source of truth for history.
//  */
// mitraSchema.methods.unassignComplaint = async function (complaintId) {
//   this.assignedComplaints = (this.assignedComplaints || []).filter(
//     (id) => id !== complaintId
//   );
//   await this.save();
//   return this;
// };

// export const Mitra = mongoose.model("Mitra", mitraSchema);
import mongoose from "mongoose";

const mitraSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    // Store normalized format (e.g., +91XXXXXXXXXX); validate at controller/service layer
    mobile: {
      type: String,
      required: true,
      unique: true, // keep unique at field level
      trim: true,
    },

    // Plain text department, consistent with Complaint.departmentName
    departmentName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Zone helps suggestion/routing and analytics
    zone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Cloudinary secure_url (or any CDN URL)
    profileImg: {
      type: String,
      default: "",
      trim: true,
    },

    // Multiple complaint support: store human-readable complaintId values (e.g., "CMP-2025-000123")
    assignedComplaints: [
      {
        type: String,
        trim: true,
      },
    ],

    // Operational flags
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Useful for fair assignment and analytics
    lastAssignedAt: {
      type: Date,
      default: null,
    },

    // Internal notes (optional)
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Helpful compound index for filtering/selecting Mitras quickly
mitraSchema.index({ departmentName: 1, zone: 1, isActive: 1 });

// IMPORTANT: Removed duplicate explicit unique index on mobile to avoid
// "Schema already has an index" error.
// Do NOT add: mitraSchema.index({ mobile: 1 }, { unique: true });

/* ============== Statics & Methods ============== */

/**

Quickly list Mitras for assignment by dept/zone/active

filters = { departmentName, zone, activeOnly=true, limit=20, sortLoad=true }

sortLoad: sorts by current workload (assignedComplaints length) then lastAssignedAt
*/
mitraSchema.statics.findAssignable = async function (filters = {}) {
  const {
    departmentName,
    zone,
    activeOnly = true,
    limit = 20,
    sortLoad = true,
  } = filters;

  const q = {};
  if (departmentName) q.departmentName = departmentName;
  if (zone) q.zone = zone;
  if (activeOnly) q.isActive = true;

  const docs = await this.find(q, {
    fullName: 1,
    mobile: 1,
    departmentName: 1,
    zone: 1,
    profileImg: 1,
    assignedComplaints: 1,
    lastAssignedAt: 1,
    isActive: 1,
  }).limit(Number(limit));

  if (!sortLoad) return docs;

  return docs.sort((a, b) => {
    const loadA = a.assignedComplaints?.length || 0;
    const loadB = b.assignedComplaints?.length || 0;
    if (loadA !== loadB) return loadA - loadB;
    const tA = a.lastAssignedAt ? new Date(a.lastAssignedAt).getTime() : 0;
    const tB = b.lastAssignedAt ? new Date(b.lastAssignedAt).getTime() : 0;
    return tA - tB;
  });
};

/**

Assign a complaintId to a Mitra (id string like "CMP-2025-000123")

Options: { updateTimestamp=true } to set lastAssignedAt
*/
mitraSchema.methods.assignComplaint = async function (
  complaintId,
  options = { updateTimestamp: true }
) {
  if (!complaintId || typeof complaintId !== "string") {
    throw new Error("complaintId must be a non-empty string");
  }
  if (!this.assignedComplaints.includes(complaintId)) {
    this.assignedComplaints.push(complaintId);
  }
  if (options?.updateTimestamp) {
    this.lastAssignedAt = new Date();
  }
  await this.save();
  return this;
};

/**

Remove a complaintId from the current workload (on resolution)
*/
mitraSchema.methods.unassignComplaint = async function (complaintId) {
  this.assignedComplaints = (this.assignedComplaints || []).filter(
    (id) => id !== complaintId
  );
  await this.save();
  return this;
};

// Safe export to avoid recompilation in dev/hot-reload
export const Mitra =
  mongoose.models.Mitra || mongoose.model("Mitra", mitraSchema);
