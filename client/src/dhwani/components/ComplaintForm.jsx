// import React, { useState } from "react";
// import axios from "axios";

// const ComplaintForm = ({ complaintData, nextState, states }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmitError("");

//     try {
//       // Create FormData for file upload
//       const formData = new FormData();

//       // Add text fields
//       formData.append("title", complaintData.title);
//       formData.append("description", complaintData.description);
//       formData.append("category", complaintData.category);
//       formData.append("departmentName", complaintData.departmentName);

//       // Add location data
//       formData.append("location[lat]", complaintData.location.lat);
//       formData.append("location[lng]", complaintData.location.lng);
//       formData.append("location[gmapLink]", complaintData.location.gmapLink);
//       formData.append("location[location]", complaintData.location.location);

//       // Add media files
//       if (complaintData.media.images.length > 0) {
//         complaintData.media.images.forEach((file) => {
//           formData.append("images", file);
//         });
//       }

//       if (complaintData.media.videos.length > 0) {
//         complaintData.media.videos.forEach((file) => {
//           formData.append("videos", file);
//         });
//       }

//       // Submit to backend
//       const response = await axios.post(
//         "http://localhost:4000/api/v1/complaint/filecomplaint",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true, // Important for cookie authentication
//         }
//       );

//       if (response.data.success) {
//         nextState(states.SUCCESS);
//       } else {
//         throw new Error(response.data.message || "Submission failed");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       setSubmitError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to submit complaint. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = () => {
//     nextState(states.GREETING);
//   };

//   return (
//     <div className="complaint-form">
//       <div className="form-header">
//         <h2>📋 Review Your Complaint</h2>
//         <p>Please review the information before submitting</p>
//       </div>

//       <div className="complaint-summary">
//         <div className="summary-section">
//           <h3>Complaint Details</h3>
//           <div className="detail-item">
//             <label>Title:</label>
//             <p>{complaintData.title}</p>
//           </div>
//           <div className="detail-item">
//             <label>Description:</label>
//             <p>{complaintData.description}</p>
//           </div>
//           <div className="detail-item">
//             <label>Category:</label>
//             <p>{complaintData.category}</p>
//           </div>
//           <div className="detail-item">
//             <label>Department:</label>
//             <p>{complaintData.departmentName}</p>
//           </div>
//         </div>

//         <div className="summary-section">
//           <h3>Media Files</h3>
//           <div className="media-summary">
//             <p>📷 Images: {complaintData.media.images.length}</p>
//             <p>🎥 Videos: {complaintData.media.videos.length}</p>
//             {complaintData.media.images.length === 0 &&
//               complaintData.media.videos.length === 0 && (
//                 <p className="no-media">No media files uploaded</p>
//               )}
//           </div>
//         </div>

//         <div className="summary-section">
//           <h3>Location</h3>
//           <div className="location-summary">
//             <p>
//               <strong>Address:</strong> {complaintData.location.location}
//             </p>
//             {complaintData.location.lat && complaintData.location.lng && (
//               <p>
//                 <strong>Coordinates:</strong>{" "}
//                 {complaintData.location.lat.toFixed(6)},{" "}
//                 {complaintData.location.lng.toFixed(6)}
//               </p>
//             )}
//             {complaintData.location.gmapLink && (
//               <a
//                 href={complaintData.location.gmapLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="map-link"
//               >
//                 🗺️ View on Map
//               </a>
//             )}
//           </div>
//         </div>
//       </div>

//       {submitError && (
//         <div className="submit-error">
//           <p>❌ {submitError}</p>
//         </div>
//       )}

//       <div className="form-actions">
//         <button
//           className="action-btn edit-btn"
//           onClick={handleEdit}
//           disabled={isSubmitting}
//         >
//           ✏️ Edit Details
//         </button>
//         <button
//           className="action-btn submit-btn"
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "⏳ Submitting..." : "✅ Submit Complaint"}
//         </button>
//       </div>

//       <div className="submission-note">
//         <p>
//           📞 You will receive SMS/WhatsApp updates about your complaint status
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ComplaintForm;
// import React, { useState } from "react";
// import axios from "axios";

// const ComplaintForm = ({ complaintData, nextState, states }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   // Responsive inline styles
//   const styles = {
//     container: {
//       maxWidth: "900px",
//       width: "100%",
//       margin: "0 auto",
//       padding: "20px",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       minHeight: "100vh",
//       boxSizing: "border-box",
//       color: "white",
//       animation: "fadeInUp 0.6s ease-out",
//       "@media (max-width: 768px)": {
//         padding: "15px",
//       },
//     },

//     header: {
//       textAlign: "center",
//       marginBottom: "40px",
//       "@media (max-width: 768px)": {
//         marginBottom: "30px",
//       },
//     },

//     title: {
//       fontSize: "2.5rem",
//       margin: "0 0 10px 0",
//       textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//       "@media (max-width: 768px)": {
//         fontSize: "2rem",
//       },
//       "@media (max-width: 480px)": {
//         fontSize: "1.7rem",
//       },
//     },

//     subtitle: {
//       fontSize: "1.2rem",
//       opacity: 0.9,
//       margin: 0,
//       "@media (max-width: 768px)": {
//         fontSize: "1rem",
//       },
//     },

//     summaryGrid: {
//       display: "grid",
//       gap: "25px",
//       marginBottom: "30px",
//       "@media (min-width: 769px)": {
//         gridTemplateColumns: "1fr 1fr",
//       },
//       "@media (max-width: 768px)": {
//         gap: "20px",
//       },
//     },

//     summarySection: {
//       background: "rgba(255, 255, 255, 0.1)",
//       padding: "25px",
//       borderRadius: "20px",
//       backdropFilter: "blur(10px)",
//       border: "1px solid rgba(255, 255, 255, 0.2)",
//       "@media (max-width: 768px)": {
//         padding: "20px",
//       },
//       "@media (max-width: 480px)": {
//         padding: "15px",
//         borderRadius: "15px",
//       },
//     },

//     sectionTitle: {
//       margin: "0 0 20px 0",
//       fontSize: "1.4rem",
//       color: "#ffc107",
//       "@media (max-width: 768px)": {
//         fontSize: "1.2rem",
//         marginBottom: "15px",
//       },
//     },

//     detailItem: {
//       marginBottom: "15px",
//       borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
//       paddingBottom: "10px",
//       "@media (max-width: 768px)": {
//         marginBottom: "12px",
//       },
//     },

//     detailItemLast: {
//       borderBottom: "none",
//       marginBottom: 0,
//     },

//     label: {
//       display: "block",
//       fontWeight: "600",
//       marginBottom: "5px",
//       color: "#ffd700",
//       fontSize: "1rem",
//       "@media (max-width: 768px)": {
//         fontSize: "0.9rem",
//       },
//     },

//     value: {
//       margin: 0,
//       lineHeight: 1.5,
//       fontSize: "1rem",
//       wordBreak: "break-word",
//       "@media (max-width: 768px)": {
//         fontSize: "0.9rem",
//       },
//     },

//     mediaSummary: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "10px",
//       "@media (max-width: 768px)": {
//         gap: "8px",
//       },
//     },

//     noMedia: {
//       opacity: 0.7,
//       fontStyle: "italic",
//       fontSize: "0.9rem",
//     },

//     mapLink: {
//       color: "#ffc107",
//       textDecoration: "none",
//       fontWeight: "600",
//       display: "inline-block",
//       marginTop: "10px",
//       transition: "color 0.3s ease",
//       fontSize: "1rem",
//       "@media (max-width: 768px)": {
//         fontSize: "0.9rem",
//       },
//     },

//     locationSection: {
//       gridColumn: "span 2",
//       "@media (max-width: 768px)": {
//         gridColumn: "span 1",
//       },
//     },

//     submitError: {
//       background: "rgba(220, 53, 69, 0.2)",
//       border: "1px solid rgba(220, 53, 69, 0.4)",
//       color: "#ff6b6b",
//       padding: "15px",
//       borderRadius: "10px",
//       margin: "20px 0",
//       textAlign: "center",
//       fontSize: "1rem",
//       "@media (max-width: 768px)": {
//         padding: "12px",
//         fontSize: "0.9rem",
//       },
//     },

//     formActions: {
//       display: "flex",
//       gap: "20px",
//       justifyContent: "center",
//       margin: "30px 0",
//       "@media (max-width: 768px)": {
//         flexDirection: "column",
//         gap: "15px",
//         margin: "25px 0",
//       },
//     },

//     actionBtn: {
//       padding: "15px 30px",
//       border: "none",
//       borderRadius: "25px",
//       fontSize: "1.1rem",
//       fontWeight: "600",
//       cursor: "pointer",
//       transition: "all 0.3s ease",
//       minWidth: "150px",
//       boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
//       "@media (max-width: 768px)": {
//         padding: "12px 25px",
//         fontSize: "1rem",
//         minWidth: "auto",
//         width: "100%",
//       },
//     },

//     editBtn: {
//       background: "linear-gradient(135deg, #6c757d, #495057)",
//       color: "white",
//     },

//     submitBtn: {
//       background: "linear-gradient(135deg, #28a745, #20c997)",
//       color: "white",
//     },

//     submitBtnDisabled: {
//       background: "linear-gradient(135deg, #6c757d, #495057)",
//       opacity: 0.6,
//       cursor: "not-allowed",
//     },

//     submissionNote: {
//       textAlign: "center",
//       padding: "20px",
//       background: "rgba(255, 193, 7, 0.1)",
//       borderRadius: "15px",
//       border: "1px solid rgba(255, 193, 7, 0.3)",
//       marginTop: "20px",
//       fontSize: "1rem",
//       "@media (max-width: 768px)": {
//         padding: "15px",
//         fontSize: "0.9rem",
//       },
//     },
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmitError("");

//     try {
//       // Create FormData for file upload
//       const formData = new FormData();

//       // Add text fields
//       formData.append("title", complaintData.title);
//       formData.append("description", complaintData.description);
//       formData.append("category", complaintData.category);
//       formData.append("departmentName", complaintData.departmentName);

//       // Add location data
//       formData.append("location[lat]", complaintData.location.lat);
//       formData.append("location[lng]", complaintData.location.lng);
//       formData.append("location[gmapLink]", complaintData.location.gmapLink);
//       formData.append("location[location]", complaintData.location.location);

//       // Add media files
//       if (complaintData.media.images.length > 0) {
//         complaintData.media.images.forEach((file) => {
//           formData.append("images", file);
//         });
//       }

//       if (complaintData.media.videos.length > 0) {
//         complaintData.media.videos.forEach((file) => {
//           formData.append("videos", file);
//         });
//       }

//       // Submit to backend
//       const response = await axios.post(
//         "http://localhost:4000/api/v1/complaint/filecomplaint",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true, // Important for cookie authentication
//         }
//       );

//       if (response.data.success) {
//         nextState(states.SUCCESS);
//       } else {
//         throw new Error(response.data.message || "Submission failed");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       setSubmitError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to submit complaint. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = () => {
//     nextState(states.GREETING);
//   };

//   const handleMouseEnter = (e) => {
//     if (!isSubmitting) {
//       e.target.style.transform = "translateY(-2px)";
//       e.target.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.4)";
//     }
//   };

//   const handleMouseLeave = (e) => {
//     if (!isSubmitting) {
//       e.target.style.transform = "translateY(0)";
//       e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h2 style={styles.title}>📋 Review Your Complaint</h2>
//         <p style={styles.subtitle}>
//           Please review the information before submitting
//         </p>
//       </div>

//       <div style={styles.summaryGrid}>
//         <div style={styles.summarySection}>
//           <h3 style={styles.sectionTitle}>Complaint Details</h3>
//           <div style={styles.detailItem}>
//             <label style={styles.label}>Title:</label>
//             <p style={styles.value}>{complaintData.title}</p>
//           </div>
//           <div style={styles.detailItem}>
//             <label style={styles.label}>Description:</label>
//             <p style={styles.value}>{complaintData.description}</p>
//           </div>
//           <div style={styles.detailItem}>
//             <label style={styles.label}>Category:</label>
//             <p style={styles.value}>{complaintData.category}</p>
//           </div>
//           <div style={{ ...styles.detailItem, ...styles.detailItemLast }}>
//             <label style={styles.label}>Department:</label>
//             <p style={styles.value}>{complaintData.departmentName}</p>
//           </div>
//         </div>

//         <div style={styles.summarySection}>
//           <h3 style={styles.sectionTitle}>Media Files</h3>
//           <div style={styles.mediaSummary}>
//             <p style={styles.value}>
//               📷 Images: {complaintData.media.images.length}
//             </p>
//             <p style={styles.value}>
//               🎥 Videos: {complaintData.media.videos.length}
//             </p>
//             {complaintData.media.images.length === 0 &&
//               complaintData.media.videos.length === 0 && (
//                 <p style={{ ...styles.value, ...styles.noMedia }}>
//                   No media files uploaded
//                 </p>
//               )}
//           </div>
//         </div>

//         <div style={{ ...styles.summarySection, ...styles.locationSection }}>
//           <h3 style={styles.sectionTitle}>Location</h3>
//           <div style={styles.mediaSummary}>
//             <p style={styles.value}>
//               <strong>Address:</strong> {complaintData.location.location}
//             </p>
//             {complaintData.location.lat && complaintData.location.lng && (
//               <p style={styles.value}>
//                 <strong>Coordinates:</strong>{" "}
//                 {complaintData.location.lat.toFixed(6)},{" "}
//                 {complaintData.location.lng.toFixed(6)}
//               </p>
//             )}
//             {complaintData.location.gmapLink && (
//               <a
//                 href={complaintData.location.gmapLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={styles.mapLink}
//                 onMouseEnter={(e) => (e.target.style.color = "#ffeb3b")}
//                 onMouseLeave={(e) => (e.target.style.color = "#ffc107")}
//               >
//                 🗺️ View on Map
//               </a>
//             )}
//           </div>
//         </div>
//       </div>

//       {submitError && (
//         <div style={styles.submitError}>
//           <p style={{ margin: 0 }}>❌ {submitError}</p>
//         </div>
//       )}

//       <div style={styles.formActions}>
//         <button
//           style={{
//             ...styles.actionBtn,
//             ...styles.editBtn,
//             ...(isSubmitting ? styles.submitBtnDisabled : {}),
//           }}
//           onClick={handleEdit}
//           disabled={isSubmitting}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           ✏️ Edit Details
//         </button>
//         <button
//           style={{
//             ...styles.actionBtn,
//             ...styles.submitBtn,
//             ...(isSubmitting ? styles.submitBtnDisabled : {}),
//           }}
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           {isSubmitting ? "⏳ Submitting..." : "✅ Submit Complaint"}
//         </button>
//       </div>

//       <div style={styles.submissionNote}>
//         <p style={{ margin: 0 }}>
//           📞 You will receive SMS/WhatsApp updates about your complaint status
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ComplaintForm;
// client/src/dhwani/components/ComplaintForm.jsx
import React, { useState } from "react";
import axios from "axios";

const ComplaintForm = ({ complaintData, nextState, states }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();

      formData.append("title", complaintData.title);
      formData.append("description", complaintData.description);
      formData.append("category", complaintData.category);
      formData.append("departmentName", complaintData.departmentName);

      formData.append("location[lat]", complaintData.location.lat);
      formData.append("location[lng]", complaintData.location.lng);
      formData.append("location[gmapLink]", complaintData.location.gmapLink);
      formData.append("location[location]", complaintData.location.location);

      if (complaintData.media.images.length > 0) {
        complaintData.media.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      if (complaintData.media.videos.length > 0) {
        complaintData.media.videos.forEach((file) => {
          formData.append("videos", file);
        });
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/complaint/filecomplaint",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        nextState(states.SUCCESS);
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    nextState(states.GREETING);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 text-white">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
          📋 Review Your Complaint
        </h2>
        <p className="text-lg sm:text-xl opacity-90">
          Please review the information before submitting
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Complaint Details */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-yellow-400 flex items-center">
            <span className="mr-3">📄</span>
            Complaint Details
          </h3>

          <div className="space-y-4 sm:space-y-6">
            <div className="border-b border-white/20 pb-4">
              <label className="block text-sm font-semibold text-yellow-300 mb-2">
                Title:
              </label>
              <p className="text-base sm:text-lg leading-relaxed break-words">
                {complaintData.title}
              </p>
            </div>

            <div className="border-b border-white/20 pb-4">
              <label className="block text-sm font-semibold text-yellow-300 mb-2">
                Description:
              </label>
              <p className="text-base sm:text-lg leading-relaxed break-words">
                {complaintData.description}
              </p>
            </div>

            <div className="border-b border-white/20 pb-4">
              <label className="block text-sm font-semibold text-yellow-300 mb-2">
                Category:
              </label>
              <p className="text-base sm:text-lg">{complaintData.category}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-2">
                Department:
              </label>
              <p className="text-base sm:text-lg font-medium bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {complaintData.departmentName}
              </p>
            </div>
          </div>
        </div>

        {/* Media & Location */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-yellow-400 flex items-center">
            <span className="mr-3">📁</span>
            Media & Location
          </h3>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <span className="text-2xl">📷</span>
              <div>
                <p className="font-semibold">Images</p>
                <p className="text-sm opacity-80">
                  {complaintData.media.images.length} files uploaded
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <span className="text-2xl">🎥</span>
              <div>
                <p className="font-semibold">Videos</p>
                <p className="text-sm opacity-80">
                  {complaintData.media.videos.length} files uploaded
                </p>
              </div>
            </div>

            {complaintData.media.images.length === 0 &&
              complaintData.media.videos.length === 0 && (
                <div className="text-center py-4 opacity-70 italic">
                  <p>No media files uploaded</p>
                </div>
              )}

            <div className="border-t border-white/20 pt-4">
              <label className="block text-sm font-semibold text-yellow-300 mb-2">
                Location:
              </label>
              <p className="text-base sm:text-lg mb-2 break-words">
                {complaintData.location.location}
              </p>

              {complaintData.location.lat && complaintData.location.lng && (
                <p className="text-sm opacity-80 mb-3 font-mono">
                  📍 {complaintData.location.lat.toFixed(6)},{" "}
                  {complaintData.location.lng.toFixed(6)}
                </p>
              )}

              {complaintData.location.gmapLink && (
                <a
                  href={complaintData.location.gmapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  🗺️ View on Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-8 p-4 sm:p-6 bg-red-500/20 border-2 border-red-500/50 rounded-xl sm:rounded-2xl backdrop-blur-lg">
          <div className="flex items-center">
            <span className="text-2xl sm:text-3xl mr-3">❌</span>
            <p className="text-base sm:text-lg font-semibold text-red-100">
              {submitError}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons - GUARANTEED VISIBLE */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 relative z-10">
        <button
          onClick={handleEdit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-800 disabled:to-gray-900 text-white font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] border-2 border-white/20"
        >
          ✏️ Edit Details
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] border-2 border-white/30 shadow-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Submitting...
            </span>
          ) : (
            "✅ Submit Complaint"
          )}
        </button>
      </div>

      {/* Submission Note */}
      <div className="text-center p-6 sm:p-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl backdrop-blur-lg">
        <div className="flex items-center justify-center mb-3">
          <span className="text-2xl sm:text-3xl mr-3">📞</span>
          <h4 className="text-lg sm:text-xl font-semibold text-yellow-400">
            Stay Updated
          </h4>
        </div>
        <p className="text-base sm:text-lg opacity-90">
          You will receive SMS/WhatsApp updates about your complaint status and
          resolution progress.
        </p>
      </div>
    </div>
  );
};

export default ComplaintForm;
