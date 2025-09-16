import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import geminiService from "../services/geminiService.js";
import complaintTools from "../services/complaintTools.js";

export const processAssistantMessage = catchAsyncError(
  async (req, res, next) => {
    const { message, conversationHistory = [], location } = req.body;

    if (!message || !message.trim()) {
      return next(new ErrorHandler("Message is required", 400));
    }

    try {
      // Add location to message context if provided
      let contextualMessage = message;
      if (location && location.lat && location.lng) {
        contextualMessage += `\n[Location: ${location.lat}, ${location.lng}]`;
      }

      // Process message with Gemini
      const geminiResult = await geminiService.processMessage(
        contextualMessage,
        conversationHistory
      );

      if (!geminiResult.success) {
        return next(new ErrorHandler(geminiResult.error, 500));
      }

      // Check if Gemini called any functions
      if (geminiResult.functionCalls && geminiResult.functionCalls.length > 0) {
        const functionCall = geminiResult.functionCalls[0];
        let toolResult;

        // Add location to function arguments if not present but available
        if (
          location &&
          functionCall.name === "submitComplaint" &&
          !functionCall.args.location
        ) {
          functionCall.args.location = location;
        }

        // Execute the appropriate tool
        switch (functionCall.name) {
          case "submitComplaint":
            toolResult = await complaintTools.submitComplaint(
              req,
              functionCall.args || {}
            );
            break;
          case "getComplaintDetails":
            toolResult = await complaintTools.getComplaintDetails(
              req,
              functionCall.args || {}
            );
            break;
          case "getUserComplaints":
            toolResult = await complaintTools.getUserComplaints(
              req,
              functionCall.args || {}
            );
            break;
          default:
            toolResult = {
              success: false,
              error: "Unknown function called",
              message: "यह function available नहीं है।",
            };
        }

        // Send tool result back to Gemini for final response
        const finalResult = await geminiService.processFunctionResponse(
          null,
          functionCall.name,
          toolResult
        );

        return res.status(200).json({
          success: true,
          response:
            finalResult.text ||
            toolResult.message ||
            "Function executed successfully",
          functionCalled: functionCall.name,
          functionResult: toolResult,
          data: toolResult.success
            ? toolResult.complaint || toolResult.complaints
            : null,
        });
      }

      // No function call - direct conversation
      return res.status(200).json({
        success: true,
        response:
          geminiResult.response || "मुझे समझ नहीं आया। कृपया फिर से कहें।",
        functionCalled: null,
        data: null,
      });
    } catch (error) {
      console.error("Assistant processing error:", error);
      return next(new ErrorHandler("Assistant temporarily unavailable", 500));
    }
  }
);

export const getAssistantCapabilities = catchAsyncError(
  async (req, res, next) => {
    const capabilities = {
      features: [
        "Voice complaint filing with auto-categorization",
        "Real-time complaint status tracking",
        "Timeline details with progress updates",
        "Multi-language support (Hindi, English, Hinglish)",
        "Natural language processing",
        "Automatic location detection",
      ],
      supportedLanguages: ["Hindi", "English", "Hinglish"],
      voiceCommands: [
        "Complaint file karna hai",
        "Status check karna hai",
        "Meri complaints dikhao",
        "Timeline batao",
        "शिकायत दर्ज करना है",
        "स्थिति देखना है",
      ],
      sampleQueries: [
        "Paani nahi aa raha colony mein",
        "MG Road pe streetlight band hai",
        "Status check karna hai ticket 123456 ka",
        "Meri pending complaints dikhao",
      ],
    };

    res.status(200).json({
      success: true,
      capabilities,
    });
  }
);

export const healthCheck = catchAsyncError(async (req, res, next) => {
  res.json({
    success: true,
    message: "Dhwani-Mitra is ready!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  });
});
