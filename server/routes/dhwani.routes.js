import express from "express";
import {
  processAssistantMessage,
  getAssistantCapabilities,
  healthCheck,
} from "../controllers/dhwani.controller.js";


const router = express.Router();

// Main assistant endpoint
router.post("/chat",processAssistantMessage);

// Get assistant capabilities
router.get("/capabilities",  getAssistantCapabilities);

// Health check
router.get("/health", healthCheck);

export default router;
