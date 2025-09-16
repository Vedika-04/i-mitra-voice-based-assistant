// import React, { useState, useRef } from "react";

// const MediaUpload = ({
//   complaintData,
//   updateComplaintData,
//   nextState,
//   states,
// }) => {
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const fileInputRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const handleFileSelect = (event) => {
//     const files = Array.from(event.target.files);
//     const validFiles = files.filter((file) => {
//       const isImage = file.type.startsWith("image/");
//       const isVideo = file.type.startsWith("video/");
//       return isImage || isVideo;
//     });

//     if (validFiles.length > 0) {
//       setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 7)); // Max 5 images + 2 videos
//     }
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         setIsCapturing(true);
//       }
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       alert("Could not access camera. Please check permissions.");
//     }
//   };

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const video = videoRef.current;
//       const context = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0);

//       canvas.toBlob((blob) => {
//         const file = new File([blob], `capture-${Date.now()}.jpg`, {
//           type: "image/jpeg",
//         });
//         setUploadedFiles((prev) => [...prev, file]);
//       });
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const tracks = videoRef.current.srcObject.getTracks();
//       tracks.forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//       setIsCapturing(false);
//     }
//   };

//   const removeFile = (index) => {
//     setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleContinue = () => {
//     // Separate images and videos
//     const images = uploadedFiles.filter((file) =>
//       file.type.startsWith("image/")
//     );
//     const videos = uploadedFiles.filter((file) =>
//       file.type.startsWith("video/")
//     );

//     if (images.length > 5) {
//       alert("Maximum 5 images allowed");
//       return;
//     }
//     if (videos.length > 2) {
//       alert("Maximum 2 videos allowed");
//       return;
//     }

//     // Update complaint data with files
//     updateComplaintData({
//       media: {
//         images: images,
//         videos: videos,
//       },
//     });

//     stopCamera();
//     nextState(states.LOCATION_CAPTURE);
//   };

//   const handleSkip = () => {
//     updateComplaintData({
//       media: { images: [], videos: [] },
//     });
//     stopCamera();
//     nextState(states.LOCATION_CAPTURE);
//   };

//   return (
//     <div className="media-upload">
//       <div className="upload-header">
//         <h2>📸 Upload Evidence</h2>
//         <p>Add photos or videos to support your complaint</p>
//       </div>

//       <div className="upload-options">
//         <div className="upload-section">
//           <h3>Choose Files</h3>
//           <input
//             ref={fileInputRef}
//             type="file"
//             multiple
//             accept="image/*,video/*"
//             onChange={handleFileSelect}
//             style={{ display: "none" }}
//           />
//           <button
//             className="upload-btn file-btn"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             📁 Select Files
//           </button>
//         </div>

//         <div className="upload-section">
//           <h3>Capture Photo</h3>
//           {!isCapturing ? (
//             <button className="upload-btn camera-btn" onClick={startCamera}>
//               📷 Open Camera
//             </button>
//           ) : (
//             <div className="camera-container">
//               <video ref={videoRef} autoPlay playsInline />
//               <canvas ref={canvasRef} style={{ display: "none" }} />
//               <div className="camera-controls">
//                 <button className="capture-btn" onClick={capturePhoto}>
//                   📸 Capture
//                 </button>
//                 <button className="stop-camera-btn" onClick={stopCamera}>
//                   ❌ Stop Camera
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {uploadedFiles.length > 0 && (
//         <div className="uploaded-files">
//           <h3>Selected Files ({uploadedFiles.length})</h3>
//           <div className="files-grid">
//             {uploadedFiles.map((file, index) => (
//               <div key={index} className="file-preview">
//                 {file.type.startsWith("image/") ? (
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`Preview ${index}`}
//                     className="preview-image"
//                   />
//                 ) : (
//                   <div className="video-preview">
//                     <video src={URL.createObjectURL(file)} />
//                     <span>📹 Video</span>
//                   </div>
//                 )}
//                 <button
//                   className="remove-file-btn"
//                   onClick={() => removeFile(index)}
//                 >
//                   ❌
//                 </button>
//                 <p className="file-name">{file.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="upload-limits">
//         <p>📋 Limits: Max 5 images, Max 2 videos, Total size 50MB</p>
//       </div>

//       <div className="navigation-buttons">
//         <button className="nav-btn skip-btn" onClick={handleSkip}>
//           Skip Media Upload
//         </button>
//         <button
//           className="nav-btn continue-btn"
//           onClick={handleContinue}
//           disabled={uploadedFiles.length === 0}
//         >
//           Continue →
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MediaUpload;
// client/src/dhwani/components/MediaUpload.jsx
import React, { useState, useRef } from "react";

const MediaUpload = ({
  complaintData,
  updateComplaintData,
  nextState,
  states,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      return isImage || isVideo;
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 7)); // Max 5 images + 2 videos
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setUploadedFiles((prev) => [...prev, file]);
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    // Separate images and videos
    const images = uploadedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const videos = uploadedFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    if (images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    if (videos.length > 2) {
      alert("Maximum 2 videos allowed");
      return;
    }

    // Update complaint data with files
    updateComplaintData({
      media: {
        images: images,
        videos: videos,
      },
    });

    stopCamera();
    nextState(states.LOCATION_CAPTURE);
  };

  const handleSkip = () => {
    updateComplaintData({
      media: { images: [], videos: [] },
    });
    stopCamera();
    nextState(states.LOCATION_CAPTURE);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 text-white">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
          📸 Upload Evidence
        </h2>
        <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          Add photos or videos to support your complaint and strengthen your
          case
        </p>
      </div>

      {/* Upload Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* File Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-yellow-400 flex items-center">
            <span className="mr-3">📁</span>
            Choose Files
          </h3>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Dropzone Style Button */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/30 hover:border-white/50 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 hover:bg-white/5 group"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                📁
              </div>
              <h4 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                Select Files
              </h4>
              <p className="text-sm sm:text-base opacity-80 mb-4">
                Click to browse or drag and drop files
              </p>
              <p className="text-xs sm:text-sm opacity-60">
                JPG, PNG, MP4, AVI (Max 50MB total)
              </p>
            </div>
          </div>
        </div>

        {/* Camera Capture */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-yellow-400 flex items-center">
            <span className="mr-3">📷</span>
            Capture Photo
          </h3>

          {!isCapturing ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl">
                  📷
                </div>
                <p className="text-sm sm:text-base opacity-80 mb-6">
                  Use your device camera to capture evidence
                </p>
              </div>

              <button
                onClick={startCamera}
                className="w-full py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                📷 Open Camera
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-64 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={capturePhoto}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  📸 Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  ❌ Stop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-yellow-400 flex items-center justify-between">
            <span className="flex items-center">
              <span className="mr-3">📋</span>
              Selected Files ({uploadedFiles.length})
            </span>
            <span className="text-sm font-normal opacity-80">
              Max: 5 images, 2 videos
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/10">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="w-full h-24 sm:h-32 object-cover rounded-xl mb-3"
                    />
                  ) : (
                    <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl mb-3 flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl mb-1">📹</span>
                      <span className="text-xs sm:text-sm font-semibold">
                        Video
                      </span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-medium text-center opacity-90 truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-center opacity-60 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Limits Info */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full backdrop-blur-lg">
          <span className="mr-3 text-lg sm:text-xl">📋</span>
          <span className="text-sm sm:text-base font-medium">
            Limits: Max 5 images, Max 2 videos, Total size 50MB
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
        <button
          onClick={handleSkip}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[200px] border-2 border-white/20"
        >
          ⏩ Skip Media Upload
        </button>

        <button
          onClick={handleContinue}
          disabled={uploadedFiles.length === 0}
          className={`w-full sm:w-auto px-8 py-4 text-white font-bold rounded-full text-lg transition-all duration-300 transform min-w-[200px] border-2 ${
            uploadedFiles.length > 0
              ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl border-white/30"
              : "bg-gray-600 opacity-50 cursor-not-allowed border-gray-500"
          }`}
        >
          {uploadedFiles.length > 0 ? "✅ Continue →" : "📤 Select Files First"}
        </button>
      </div>

      {/* Usage Tips */}
      <div className="mt-8 sm:mt-12 bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10">
        <h4 className="text-lg font-bold text-yellow-400 mb-4 flex items-center">
          <span className="mr-3">💡</span>
          Pro Tips for Better Evidence
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm sm:text-base">
          <div className="flex items-start space-x-3">
            <span className="text-lg">📸</span>
            <p>Take clear, well-lit photos showing the problem clearly</p>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-lg">🎥</span>
            <p>Record short videos (under 10MB) for dynamic issues</p>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-lg">📐</span>
            <p>Include reference objects for scale when needed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
