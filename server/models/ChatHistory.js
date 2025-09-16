// server/models/ChatHistory.js
import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Allow anonymous chats
    },
    userMessage: {
      type: String,
      required: true,
      trim: true,
    },
    botResponse: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["hi", "en"],
      default: "hi",
    },
    userType: {
      type: String,
      enum: ["citizen", "officer", "fieldstaff", "admin"],
      default: "citizen",
    },
    sessionId: {
      type: String,
      default: null, // For tracking anonymous sessions
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

// Indexes for faster queries
chatHistorySchema.index({ userId: 1, createdAt: -1 });
chatHistorySchema.index({ sessionId: 1, createdAt: -1 });

export default mongoose.model("ChatHistory", chatHistorySchema);
