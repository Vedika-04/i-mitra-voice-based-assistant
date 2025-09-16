// client/src/dhwani/hooks/useGeminiAPI.js
import { useState } from "react";
import { processVoiceComplaint } from "../utils/geminiProcessor";

const useGeminiAPI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Process complete voice input and extract all complaint details
   * @param {string} voiceInput - Complete voice input from user
   * @param {string} language - Language code (en/hi)
   * @returns {Object} - {title, description, departmentName, category}
   */
  const processComplaintText = async (voiceInput, language = "en") => {
    setIsProcessing(true);
    setError(null);

    console.log("🎤 Processing voice input:", { voiceInput, language });

    try {
      // Process the entire voice input in one go
      const result = await processVoiceComplaint(voiceInput, language);

      console.log("✅ Voice processing complete:", result);

      setIsProcessing(false);
      return result;
    } catch (error) {
      console.error("❌ Voice processing failed:", error);
      setError(error.message);

      // Ultimate fallback
      const fallbackResult = {
        title:
          voiceInput.substring(0, 80) + (voiceInput.length > 80 ? "..." : ""),
        description: voiceInput,
        departmentName: "Other",
        category: "General Issue",
      };

      console.log("🛟 Ultimate fallback:", fallbackResult);

      setIsProcessing(false);
      return fallbackResult;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const resetProcessing = () => {
    setIsProcessing(false);
    setError(null);
  };

  return {
    processComplaintText,
    isProcessing,
    error,
    clearError,
    resetProcessing,
  };
};

export default useGeminiAPI;
