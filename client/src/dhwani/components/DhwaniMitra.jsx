// client/src/components/DhwaniMitra.jsx
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../main";
import VoiceAgent from "./VoiceAgent";
import MediaUpload from "./MediaUpload";
import LocationCapture from "./LocationCapture";
import ComplaintForm from "./ComplaintForm";
import { Mic } from "lucide-react"; // 

const DhwaniMitra = () => {
  const { user, isAuthenticated } = useContext(Context);

  const [conversationState, setConversationState] = useState("greeting");
  const [complaintData, setComplaintData] = useState({
    title: "",
    description: "",
    category: "",
    departmentName: "",
    media: { images: [], videos: [] },
    location: {
      lat: null,
      lng: null,
      gmapLink: "",
      location: "",
    },
  });

  // Conversation states
  const states = {
    GREETING: "greeting",
    LISTENING: "listening",
    PROCESSING: "processing",
    MEDIA_UPLOAD: "media_upload",
    LOCATION_CAPTURE: "location_capture",
    CONFIRMATION: "confirmation",
    SUBMITTING: "submitting",
    SUCCESS: "success",
  };

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  const updateComplaintData = (newData) => {
    setComplaintData((prev) => ({ ...prev, ...newData }));
  };

  const nextState = (state) => {
    setConversationState(state);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-700 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-y-auto z-50">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        {conversationState === states.GREETING ||
        conversationState === states.LISTENING ||
        conversationState === states.PROCESSING ? (
          <VoiceAgent
            user={user}
            conversationState={conversationState}
            complaintData={complaintData}
            updateComplaintData={updateComplaintData}
            nextState={nextState}
            states={states}
          />
        ) : conversationState === states.MEDIA_UPLOAD ? (
          <MediaUpload
            complaintData={complaintData}
            updateComplaintData={updateComplaintData}
            nextState={nextState}
            states={states}
          />
        ) : conversationState === states.LOCATION_CAPTURE ? (
          <LocationCapture
            complaintData={complaintData}
            updateComplaintData={updateComplaintData}
            nextState={nextState}
            states={states}
          />
        ) : conversationState === states.CONFIRMATION ? (
          <ComplaintForm
            complaintData={complaintData}
            nextState={nextState}
            states={states}
          />
        ) : conversationState === states.SUCCESS ? (
          <div className="text-center text-gray-900 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl">
              <div className="text-6xl sm:text-8xl mb-6">🎉</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-yellow-600">
                Complaint Filed Successfully!
              </h2>
              <p className="text-lg sm:text-xl mb-8 text-gray-700 leading-relaxed">
                Your complaint has been registered successfully. You'll receive
                updates via SMS/WhatsApp soon.
              </p>
              <button
                onClick={() => (window.location.href = "/citizendashboard")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DhwaniMitra;
