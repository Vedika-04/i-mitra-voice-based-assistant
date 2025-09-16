// import React, { useState, useEffect } from "react";
// import useSpeechRecognition from "../hooks/useSpeechRecognition";
// import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
// import useGeminiAPI from "../hooks/useGeminiAPI";
// import Avatar from "./Avatar";

// const VoiceAgent = ({
//   user,
//   conversationState,
//   complaintData,
//   updateComplaintData,
//   nextState,
//   states,
// }) => {
//   const [currentLanguage, setCurrentLanguage] = useState("en-US");
//   const [waitingForComplaint, setWaitingForComplaint] = useState(false);

//   const {
//     isListening,
//     transcript,
//     isSupported,
//     startListening,
//     stopListening,
//     resetTranscript,
//   } = useSpeechRecognition({ language: currentLanguage });

//   const { speak, isSpeaking, stopSpeaking } = useSpeechSynthesis({
//     language: currentLanguage,
//   });
//   const { processComplaintText, isProcessing } = useGeminiAPI();

//   // Greet user when component mounts
//   useEffect(() => {
//     if (conversationState === states.GREETING && user?.name) {
//       const greeting = currentLanguage.includes("hi")
//         ? `नमस्ते ${user.name}, मैं ध्वनि मित्र हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?`
//         : `Hi ${user.name}, I'm Dhwani Mitra. How can I help you today?`;

//       setTimeout(() => speak(greeting), 1000);
//     }
//   }, [conversationState, user, speak, currentLanguage, states.GREETING]);

//   // Handle transcript changes
//   useEffect(() => {
//     if (transcript && !isListening && conversationState === states.LISTENING) {
//       handleUserInput(transcript);
//     }
//   }, [transcript, isListening, conversationState, states.LISTENING]);

//   const handleUserInput = async (input) => {
//     const lowerInput = input.toLowerCase();

//     // Detect language
//     const hindiWords = ["शिकायत", "मदद", "समस्या", "परेशानी"];
//     const isHindi = hindiWords.some((word) => input.includes(word));

//     if (isHindi && currentLanguage !== "hi-IN") {
//       setCurrentLanguage("hi-IN");
//     }

//     if (
//       lowerInput.includes("complaint") ||
//       lowerInput.includes("शिकायत") ||
//       lowerInput.includes("file") ||
//       lowerInput.includes("register")
//     ) {
//       const response = currentLanguage.includes("hi")
//         ? "ठीक है, मुझे अपनी शिकायत के बारे में बताएं।"
//         : "Ok, tell me about your complaint.";

//       speak(response);
//       setWaitingForComplaint(true);
//       nextState(states.LISTENING);

//       setTimeout(() => {
//         resetTranscript();
//         startListening();
//       }, 2000);
//     } else if (waitingForComplaint && input.trim()) {
//       // Process complaint with Gemini
//       nextState(states.PROCESSING);
//       stopListening();

//       const processingMsg = currentLanguage.includes("hi")
//         ? "मैं आपकी शिकायत को समझ रहा हूँ..."
//         : "I am processing your complaint...";

//       speak(processingMsg);

//       try {
//         const extractedData = await processComplaintText(
//           input,
//           currentLanguage
//         );
//         updateComplaintData(extractedData);

//         const successMsg = currentLanguage.includes("hi")
//           ? "समझ गया। अब कृपया प्रमाण के लिए फोटो या वीडियो अपलोड करें।"
//           : "Got it. Now please upload photos or videos as evidence.";

//         speak(successMsg);

//         setTimeout(() => {
//           nextState(states.MEDIA_UPLOAD);
//         }, 3000);
//       } catch (error) {
//         const errorMsg = currentLanguage.includes("hi")
//           ? "माफ करें, कुछ गलत हुआ है। कृपया दोबारा कोशिश करें।"
//           : "Sorry, something went wrong. Please try again.";

//         speak(errorMsg);
//         nextState(states.LISTENING);
//       }
//     }
//   };

//   const handleMicClick = () => {
//     if (isListening) {
//       stopListening();
//     } else {
//       resetTranscript();
//       startListening();
//       if (conversationState === states.GREETING) {
//         nextState(states.LISTENING);
//       }
//     }
//   };

//   const switchLanguage = () => {
//     const newLang = currentLanguage === "en-US" ? "hi-IN" : "en-US";
//     setCurrentLanguage(newLang);
//     stopSpeaking();
//   };

//   if (!isSupported) {
//     return (
//       <div className="voice-agent-error">
//         <h2>Speech Recognition not supported</h2>
//         <p>Please use a modern browser that supports Web Speech API.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="voice-agent">
//       <div className="agent-header">
//         <h1>ध्वनि मित्र | Dhwani Mitra</h1>
//         <button className="language-toggle" onClick={switchLanguage}>
//           {currentLanguage.includes("hi") ? "English" : "हिंदी"}
//         </button>
//       </div>

//       <Avatar
//         isListening={isListening}
//         isSpeaking={isSpeaking}
//         isProcessing={isProcessing || conversationState === states.PROCESSING}
//       />

//       <div className="conversation-status">
//         {conversationState === states.GREETING && (
//           <p>
//             {currentLanguage.includes("hi")
//               ? "नमस्ते! मैं सुनने के लिए तैयार हूँ।"
//               : "Hello! I'm ready to listen."}
//           </p>
//         )}
//         {conversationState === states.LISTENING && (
//           <p>
//             {currentLanguage.includes("hi")
//               ? "मैं सुन रहा हूँ..."
//               : "I'm listening..."}
//           </p>
//         )}
//         {conversationState === states.PROCESSING && (
//           <p>
//             {currentLanguage.includes("hi") ? "प्रोसेसिंग..." : "Processing..."}
//           </p>
//         )}
//       </div>

//       {transcript && (
//         <div className="transcript-display">
//           <p>
//             <strong>You said:</strong> {transcript}
//           </p>
//         </div>
//       )}

//       <div className="voice-controls">
//         <button
//           className={`mic-button ${isListening ? "listening" : ""}`}
//           onClick={handleMicClick}
//           disabled={isProcessing}
//         >
//           {isListening ? "🎤 Stop" : "🎤 Start"}
//         </button>
//       </div>

//       <div className="instructions">
//         <p>
//           {currentLanguage.includes("hi")
//             ? 'कहें: "मैं शिकायत दर्ज करना चाहता हूँ" या "I want to file a complaint"'
//             : 'Say: "I want to file a complaint" or "मैं शिकायत दर्ज करना चाहता हूँ"'}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default VoiceAgent;
// client/src/dhwani/components/VoiceAgent.jsx
import React, { useState, useEffect } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import useGeminiAPI from "../hooks/useGeminiAPI";
import Avatar from "./Avatar";
import { Mic, MicOff } from "lucide-react"; // ⬅️ Top पर import add कर दो

const VoiceAgent = ({
  user,
  conversationState,
  complaintData,
  updateComplaintData,
  nextState,
  states,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState("en-US");
  const [waitingForComplaint, setWaitingForComplaint] = useState(false);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({ language: currentLanguage });

  const { speak, isSpeaking, stopSpeaking } = useSpeechSynthesis({
    language: currentLanguage,
  });
  const { processComplaintText, isProcessing } = useGeminiAPI();

  // Greet user when component mounts
  useEffect(() => {
    if (conversationState === states.GREETING && user?.name) {
      const greeting = currentLanguage.includes("hi")
        ? `नमस्ते ${user.name}, मैं ध्वनि मित्र हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?`
        : `Hi ${user.name}, I'm Dhwani Mitra. How can I help you today?`;

      setTimeout(() => speak(greeting), 1000);
    }
  }, [conversationState, user, speak, currentLanguage, states.GREETING]);

  // Handle transcript changes
  useEffect(() => {
    if (transcript && !isListening && conversationState === states.LISTENING) {
      handleUserInput(transcript);
    }
  }, [transcript, isListening, conversationState, states.LISTENING]);

  const handleUserInput = async (input) => {
    const lowerInput = input.toLowerCase();

    // Detect language
    const hindiWords = ["शिकायत", "मदद", "समस्या", "परेशानी"];
    const isHindi = hindiWords.some((word) => input.includes(word));

    if (isHindi && currentLanguage !== "hi-IN") {
      setCurrentLanguage("hi-IN");
    }

    if (
      lowerInput.includes("complaint") ||
      lowerInput.includes("शिकायत") ||
      lowerInput.includes("file") ||
      lowerInput.includes("register")
    ) {
      const response = currentLanguage.includes("hi")
        ? "ठीक है, मुझे अपनी शिकायत के बारे में बताएं।"
        : "Ok, tell me about your complaint.";

      speak(response);
      setWaitingForComplaint(true);
      nextState(states.LISTENING);

      setTimeout(() => {
        resetTranscript();
        startListening();
      }, 2000);
    } else if (waitingForComplaint && input.trim()) {
      // Process complaint with Gemini
      nextState(states.PROCESSING);
      stopListening();

      const processingMsg = currentLanguage.includes("hi")
        ? "मैं आपकी शिकायत को समझ रहा हूँ..."
        : "I am processing your complaint...";

      speak(processingMsg);

      try {
        const extractedData = await processComplaintText(
          input,
          currentLanguage
        );
        updateComplaintData(extractedData);

        const successMsg = currentLanguage.includes("hi")
          ? "समझ गया। अब कृपया प्रमाण के लिए फोटो या वीडियो अपलोड करें।"
          : "Got it. Now please upload photos or videos as evidence.";

        speak(successMsg);

        setTimeout(() => {
          nextState(states.MEDIA_UPLOAD);
        }, 3000);
      } catch (error) {
        const errorMsg = currentLanguage.includes("hi")
          ? "माफ करें, कुछ गलत हुआ है। कृपया दोबारा कोशिश करें।"
          : "Sorry, something went wrong. Please try again.";

        speak(errorMsg);
        nextState(states.LISTENING);
      }
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
      if (conversationState === states.GREETING) {
        nextState(states.LISTENING);
      }
    }
  };

  const switchLanguage = () => {
    const newLang = currentLanguage === "en-US" ? "hi-IN" : "en-US";
    setCurrentLanguage(newLang);
    stopSpeaking();
  };

  if (!isSupported) {
    return (
      <div className="text-center text-white max-w-lg mx-auto p-8">
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-2xl p-6 backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-red-300 mb-4">
            Speech Recognition not supported
          </h2>
          <p className="text-lg opacity-90">
            Please use a modern browser that supports Web Speech API.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-2 sm:mb-8 relative">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
       Dhwani Mitra
        </h1>

        <p className="text-lg sm:text-xl opacity-90 mb-6 font-medium">
          {currentLanguage.includes("hi")
            ? "आपका बुद्धिमान आवाज सहायक"
            : "Your Intelligent Voice Assistant"}
        </p>

        <button
          className="absolute top-0 right-0 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-lg"
          onClick={switchLanguage}
        >
          {currentLanguage.includes("hi") ? "English" : "हिंदी"}
        </button>
      </div>

      {/* Avatar */}
      <Avatar
        isListening={isListening}
        isSpeaking={isSpeaking}
        isProcessing={isProcessing || conversationState === states.PROCESSING}
      />

      {/* Conversation Status */}
      <div className="min-h-10 flex items-center justify-center mb-2 sm:mb-4">
        {conversationState === states.GREETING && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20">
            <p className="text-lg sm:text-xl font-medium">
              {currentLanguage.includes("hi")
                ? "नमस्ते! मैं सुनने के लिए तैयार हूँ। 🎤"
                : "Hello! I'm ready to listen. 🎤"}
            </p>
          </div>
        )}

        {conversationState === states.LISTENING && (
          <div className="bg-green-500/20 backdrop-blur-lg rounded-2xl px-6 py-4 border border-green-500/30 animate-pulse">
            <p className="text-lg sm:text-xl font-medium text-green-300">
              {currentLanguage.includes("hi")
                ? "🎧 मैं सुन रहा हूँ..."
                : "🎧 I'm listening..."}
            </p>
          </div>
        )}

        {conversationState === states.PROCESSING && (
          <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl px-6 py-4 border border-blue-500/30">
            <div className="flex items-center justify-center space-x-3">
              <svg
                className="animate-spin h-6 w-6 text-blue-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-lg sm:text-xl font-medium text-blue-300">
                {currentLanguage.includes("hi")
                  ? "🧠 प्रोसेसिंग..."
                  : "🧠 Processing..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-2 p-4 sm:p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 max-h-40 overflow-y-auto">
          <p className="text-base sm:text-lg leading-relaxed">
            <span className="font-semibold text-yellow-400">You said:</span>{" "}
            <span className="text-white">{transcript}</span>
          </p>
        </div>
      )}

      
{/* Voice Controls */}
<div className="mb-2 sm:mb-4">
  <button
    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-none cursor-pointer transition-all duration-300 transform mx-auto flex items-center justify-center
      ${isListening
        ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 animate-pulse shadow-lg shadow-red-500/50"
        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md shadow-green-500/50"
      }
      ${isProcessing
        ? "opacity-60 cursor-not-allowed"
        : "hover:scale-110 hover:shadow-2xl"
      } text-white`}
    onClick={handleMicClick}
    disabled={isProcessing}
  >
    {isListening ? (
      <MicOff className="w-10 h-10" />  // Mic Off icon when listening
    ) : (
      <Mic className="w-10 h-10" />      // Mic On icon when idle
    )}
  </button>
</div>

      {/* Instructions */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 max-w-3xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 flex items-center justify-center">
            <span className="mr-3">💡</span>
            {currentLanguage.includes("hi")
              ? "आप कह सकते हैं:"
              : "You can say:"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border-l-4 border-green-400">
              <p className="font-medium text-green-300 mb-2">English:</p>
              <p className="text-sm sm:text-base">
                "I want to file a complaint"
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border-l-4 border-orange-400">
              <p className="font-medium text-orange-300 mb-2">हिंदी:</p>
              <p className="text-sm sm:text-base">
                "मैं शिकायत दर्ज करना चाहता हूँ"
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-3">🌟</span>
            <h4 className="text-lg font-semibold text-yellow-300">Pro Tips</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm sm:text-base">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <span className="block text-xl mb-2">🗣️</span>
              <p>Speak clearly and naturally</p>
            </div>

            <div className="text-center p-3 bg-white/5 rounded-lg">
              <span className="block text-xl mb-2">🌍</span>
              <p>Mix Hindi & English freely</p>
            </div>

            <div className="text-center p-3 bg-white/5 rounded-lg">
              <span className="block text-xl mb-2">📱</span>
              <p>Ensure good microphone access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;
