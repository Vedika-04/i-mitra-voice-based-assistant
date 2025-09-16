import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "" }, // frontend sets
    departmentName: { type: String, required: true, trim: true, default: "" }, // frontend sets

    media: {
      images: [{ type: String, trim: true }],
      videos: [{ type: String, trim: true }],
    },

    location: {
      lat: { type: Number, required: true, default: null, min: -90, max: 90 },
      lng: { type: Number, required: true, default: null, min: -180, max: 180 },
      gmapLink: { type: String, required: true, trim: true, default: "" },
      location: { type: String, trim: true, default: "" },
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected", "escalated"],
      default: "pending",
      index: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Complaint311 = mongoose.model("Complaint311", complaintSchema);
