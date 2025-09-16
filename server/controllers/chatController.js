// server/controllers/chatController.js
import crypto from 'node:crypto';
import geminiService from '../utils/geminiService.js';
import ChatHistory from '../models/ChatHistory.js';

function getSessionIdFromReq(req) {
  // Prefer header; fallback to cookie if you later add cookie-parser
  const headerId = req.headers['x-session-id'];
  if (typeof headerId === 'string' && headerId.trim()) return headerId.trim();

  // Generate deterministic-ish per-connection id if absolutely nothing exists
  // Requires Node 18+ for crypto.randomUUID()
  return crypto.randomUUID();
}

function buildContextFromHistory(history, language = 'hi') {
  if (!history?.length) return '';
  // Oldest → newest for better coherence
  const ordered = history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const lines = ordered.flatMap(h => [
    `User: ${h.userMessage}`,
    `Assistant: ${h.botResponse}`
  ]);
  const note = language === 'hi'
    ? 'आपके पास नीचे दिया गया वार्तालाप संदर्भ है।'
    : 'You have the following conversation context.';
  return `${note}\n\n${lines.join('\n')}`;
}

const chatController = {
  // POST /api/chat/gemini  (optional auth)
  async handleChat(req, res) {
    try {
      const { message, language = 'hi', context = '', userType = 'citizen' } = req.body || {};
      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: language === 'hi' ? 'संदेश आवश्यक है।' : 'Message is required.'
        });
      }

      // Identify actor (user or anonymous session)
      const isLoggedIn = Boolean(req.user?.id);
      const sessionId = isLoggedIn ? null : getSessionIdFromReq(req);

      // Pull last N messages to build context
      const N = 6;
      const baseFilter = isLoggedIn
        ? { userId: req.user.id }
        : { sessionId };

      const prev = await ChatHistory.find(baseFilter)
        .sort({ createdAt: -1 })
        .limit(N)
        .lean();

      const conversationContext = buildContextFromHistory(prev, language);
      const mergedContext = [conversationContext, context].filter(Boolean).join('\n\n');

      // Ask Gemini (fast-path inside service handles quick replies)
      let aiText;
      try {
        aiText = await geminiService.getContextualResponse(
          message,
          userType,
          language,
          mergedContext
        );
      } catch (aiErr) {
        console.error('Gemini error:', aiErr);
        return res.status(500).json({
          success: false,
          message:
            language === 'hi'
              ? 'क्षमा करें, तकनीकी समस्या के कारण मैं अभी उत्तर नहीं दे सकता।'
              : 'Sorry, I cannot respond right now due to technical issues.'
        });
      }

      // Save this turn
      try {
        await ChatHistory.create({
          userId: isLoggedIn ? req.user.id : null,
          sessionId,
          userMessage: message.trim(),
          botResponse: aiText,
          language,
          userType
        });
      } catch (saveErr) {
        console.error('Chat history save error:', saveErr);
        // Don't fail the response if persistence fails
      }

      // Return response + session id for the frontend to persist
      return res.json({
        success: true,
        response: aiText,
        sessionId: sessionId || undefined
      });
    } catch (err) {
      console.error('Chat Error:', err);
      const lang = req.body?.language || 'en';
      return res.status(500).json({
        success: false,
        message:
          lang === 'hi'
            ? 'क्षमा करें, तकनीकी समस्या के कारण मैं अभी उत्तर नहीं दे सकता।'
            : 'Sorry, I cannot respond right now due to technical issues.'
      });
    }
  },

  // GET /api/chat/history  (auth OR anonymous with x-session-id)
  async getChatHistory(req, res) {
    try {
      const lang = (req.query.language === 'hi' ? 'hi' : 'en');
      const pageNum = parseInt(req.query.page, 10) || 1;
      const limitNum = parseInt(req.query.limit, 10) || 20;
      const skip = (pageNum - 1) * limitNum;

      // If logged in, fetch by userId; else require sessionId
      let filter = {};
      if (req.user?.id) {
        filter.userId = req.user.id;
      } else {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
          return res.status(401).json({
            success: false,
            message: lang === 'hi' ? 'प्रमाणीकरण आवश्यक है।' : 'Authentication required.'
          });
        }
        filter.sessionId = String(sessionId);
      }

      const chats = await ChatHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      const total = await ChatHistory.countDocuments(filter);

      return res.json({
        success: true,
        data: {
          chats,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalChats: total,
            hasNext: skip + chats.length < total,
            hasPrev: pageNum > 1
          }
        }
      });
    } catch (err) {
      console.error('Chat History Error:', err);
      const lang = (req.query.language === 'hi' ? 'hi' : 'en');
      return res.status(500).json({
        success: false,
        message: lang === 'hi' ? 'चैट इतिहास प्राप्त नहीं किया जा सका।' : 'Could not fetch chat history.'
      });
    }
  },

  // DELETE /api/chat/history  (auth OR anonymous with x-session-id)
  async deleteChatHistory(req, res) {
    try {
      const lang = (req.query.language === 'hi' ? 'hi' : 'en');

      let filter = {};
      if (req.user?.id) {
        filter.userId = req.user.id;
      } else {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
          return res.status(401).json({
            success: false,
            message: lang === 'hi' ? 'प्रमाणीकरण आवश्यक है।' : 'Authentication required.'
          });
        }
        filter.sessionId = String(sessionId);
      }

      await ChatHistory.deleteMany(filter);

      return res.json({
        success: true,
        message: lang === 'hi' ? 'चैट इतिहास सफलतापूर्वक हटाया गया।' : 'Chat history deleted successfully.'
      });
    } catch (err) {
      console.error('Delete Chat History Error:', err);
      const lang = (req.query.language === 'hi' ? 'hi' : 'en');
      return res.status(500).json({
        success: false,
        message: lang === 'hi' ? 'चैट इतिहास हटाया नहीं जा सका।' : 'Could not delete chat history.'
      });
    }
  }
};

export default chatController;
