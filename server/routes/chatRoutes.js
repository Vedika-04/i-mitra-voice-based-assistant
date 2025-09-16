// server/routes/chatRoutes.js
import express from 'express';
import chatController from '../controllers/chatController.js';
import authMiddleware from '../middlewares/auth.js';
// import { handleChat } from "../controllers/chatController.js";
const router = express.Router();

// Public endpoint with optional auth (sets req.user if token exists)
router.post('/gemini', authMiddleware.optionalAuth, chatController.handleChat);


// History endpoints:
// - If logged in → uses userId
// - If anonymous → require x-session-id header
router.get('/history', authMiddleware.optionalAuth, chatController.getChatHistory);
router.delete('/history', authMiddleware.optionalAuth, chatController.deleteChatHistory);

export default router;
