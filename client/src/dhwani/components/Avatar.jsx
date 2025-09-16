import React from "react";

const Avatar = ({ isListening, isSpeaking, isProcessing }) => {
  const getAvatarState = () => {
    if (isProcessing) return "processing";
    if (isSpeaking) return "speaking";
    if (isListening) return "listening";
    return "idle";
  };

  const avatarState = getAvatarState();

  return (
    <div className="avatar-container">
      <div className={`avatar ${avatarState}`}>
        <div className="avatar-face">
          <div className="avatar-eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
          <div className="avatar-mouth">
            <div className="mouth-line"></div>
          </div>
        </div>

        {/* Voice waves animation */}
        {(isListening || isSpeaking) && (
          <div className="voice-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
            <div className="wave wave-4"></div>
          </div>
        )}

        {/* Processing spinner */}
        {isProcessing && (
          <div className="processing-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <div className="avatar-status">
        <p>
          {avatarState === "listening" && "👂 Listening..."}
          {avatarState === "speaking" && "🗣️ Speaking..."}
          {avatarState === "processing" && "🧠 Thinking..."}
          {avatarState === "idle" && "😊 Ready to help"}
        </p>
      </div>
    </div>
  );
};

export default Avatar;
