// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import StatusBadge from "../components/StatusBadge.jsx";

// const ComplaintDetail = () => {
//   const { id } = useParams();
//   const [complaint, setComplaint] = useState(null);
//   const [mitras, setMitras] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMitra, setSelectedMitra] = useState("");
//   const [newStatus, setNewStatus] = useState("");
//   const [note, setNote] = useState("");
//   const [resolutionNote, setResolutionNote] = useState("");
//   const [rejectReason, setRejectReason] = useState("");
//   const [escalationReason, setEscalationReason] = useState("");

//   useEffect(() => {
//     const fetchComplaint = async () => {
//       try {
//         const [complaintRes, mitraRes] = await Promise.all([
//           axios.get(
//             `http://localhost:4000/api/v1/department/complaints/${id}`,
//             {
//               withCredentials: true,
//             }
//           ),
//           axios.get("http://localhost:4000/api/v1/department/mitra", {
//             withCredentials: true,
//           }),
//         ]);

//         setComplaint(complaintRes.data.complaint);
//         setMitras(mitraRes.data.mitras || []);
//       } catch (error) {
//         toast.error("Error loading complaint details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaint();
//   }, [id]);

//   const handleAssignMitra = async () => {
//     if (!selectedMitra) {
//       toast.error("Please select a Mitra");
//       return;
//     }

//     try {
//       await axios.patch(
//         `http://localhost:4000/api/v1/department/complaints/${id}/assign`,
//         { mitraId: selectedMitra },
//         { withCredentials: true }
//       );
//       toast.success("Mitra assigned successfully");
//       // Refresh complaint data
//       window.location.reload();
//     } catch (error) {
//       toast.error("Error assigning Mitra");
//     }
//   };

//   const handleStatusUpdate = async () => {
//     if (!newStatus) {
//       toast.error("Please select a status");
//       return;
//     }

//     const payload = { status: newStatus };
//     if (newStatus === "resolved" && resolutionNote) {
//       payload.resolutionNote = resolutionNote;
//     }
//     if (newStatus === "rejected" && rejectReason) {
//       payload.rejectReason = rejectReason;
//     }
//     if (newStatus === "escalated" && escalationReason) {
//       payload.escalationReason = escalationReason;
//     }

//     try {
//       await axios.patch(
//         `http://localhost:4000/api/v1/department/complaints/${id}/status`,
//         payload,
//         { withCredentials: true }
//       );
//       toast.success("Status updated successfully");
//       window.location.reload();
//     } catch (error) {
//       const msg =
//         error.response && error.response.data && error.response.data.message
//           ? error.response.data.message
//           : "Error updating status";
//       toast.error(msg);
//     }
//   };

//   const handleAddNote = async () => {
//     if (!note.trim()) {
//       toast.error("Please enter a note");
//       return;
//     }

//     try {
//       await axios.patch(
//         `http://localhost:4000/api/v1/department/complaints/${id}/note`,
//         { note },
//         { withCredentials: true }
//       );
//       toast.success("Note added successfully");
//       setNote("");
//       window.location.reload();
//     } catch (error) {
//       toast.error("Error adding note:", error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!complaint) {
//     return <div className="text-center text-red-500">Complaint not found</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">
//               {complaint.title}
//             </h1>
//             <p className="text-gray-600 mb-4">{complaint.description}</p>
//             <div className="flex items-center space-x-4">
//               <StatusBadge status={complaint.status} />
//               <span className="text-sm text-gray-500">
//                 Priority:{" "}
//                 <span className="font-medium capitalize">
//                   {complaint.priority}
//                 </span>
//               </span>
//               <span className="text-sm text-gray-500">
//                 Created: {new Date(complaint.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Citizen Info */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold mb-4">Citizen Information</h3>
//           {complaint.citizenId && (
//             <div className="space-y-2">
//               <p>
//                 <strong>Name:</strong> {complaint.citizenId.fullName}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {complaint.citizenId.phone}
//               </p>
//               <p>
//                 <strong>Zone:</strong> {complaint.citizenId.zone}
//               </p>
//               <p>
//                 <strong>Address:</strong> {complaint.citizenId.address}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Assigned Mitra */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold mb-4">Assigned Mitra</h3>
//           {complaint.assignedMitraId ? (
//             <div className="space-y-2">
//               <p>
//                 <strong>Name:</strong> {complaint.assignedMitraId.fullName}
//               </p>
//               <p>
//                 <strong>Mobile:</strong> {complaint.assignedMitraId.mobile}
//               </p>
//               <p>
//                 <strong>Zone:</strong> {complaint.assignedMitraId.zone}
//               </p>
//             </div>
//           ) : (
//             <div>
//               <p className="text-gray-500 mb-4">No Mitra assigned yet</p>
//               <div className="flex space-x-2">
//                 <select
//                   value={selectedMitra}
//                   onChange={(e) => setSelectedMitra(e.target.value)}
//                   className="flex-1 border border-gray-300 rounded-md px-3 py-2"
//                 >
//                   <option value="">Select Mitra</option>
//                   {mitras.map((mitra) => (
//                     <option key={mitra._id} value={mitra._id}>
//                       {mitra.fullName} - {mitra.zone}
//                     </option>
//                   ))}
//                 </select>
//                 <button
//                   onClick={handleAssignMitra}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                 >
//                   Assign
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Status Actions */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-semibold mb-4">Update Status</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <select
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2"
//             >
//               <option value="">Select new status</option>
//               <option value="in_progress">In Progress</option>
//               <option value="resolved">Resolved</option>
//               <option value="rejected">Rejected</option>
//               <option value="escalated">Escalated</option>
//             </select>
//           </div>

//           {newStatus === "resolved" && (
//             <input
//               type="text"
//               placeholder="Resolution note"
//               value={resolutionNote}
//               onChange={(e) => setResolutionNote(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2"
//             />
//           )}

//           {newStatus === "rejected" && (
//             <input
//               type="text"
//               placeholder="Rejection reason"
//               value={rejectReason}
//               onChange={(e) => setRejectReason(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2"
//             />
//           )}

//           {newStatus === "escalated" && (
//             <input
//               type="text"
//               placeholder="Escalation reason"
//               value={escalationReason}
//               onChange={(e) => setEscalationReason(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2"
//             />
//           )}
//         </div>

//         <button
//           onClick={handleStatusUpdate}
//           className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//         >
//           Update Status
//         </button>
//       </div>

//       {/* Add Note */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-semibold mb-4">Add Department Note</h3>
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             placeholder="Enter note..."
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             className="flex-1 border border-gray-300 rounded-md px-3 py-2"
//           />
//           <button
//             onClick={handleAddNote}
//             className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
//           >
//             Add Note
//           </button>
//         </div>
//       </div>

//       {/* Timeline */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-semibold mb-4">Timeline</h3>
//         <div className="space-y-4">
//           {complaint.timeline && complaint.timeline.length > 0 ? (
//             complaint.timeline.map((item, index) => (
//               <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4">
//                 <div className="text-sm text-gray-500">
//                   {new Date(item.at).toLocaleString()}
//                 </div>
//                 <div className="font-medium text-gray-900">
//                   {item.addedByType === "department" ? "🏢" : "👤"}{" "}
//                   {item.caption}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No timeline entries yet</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComplaintDetail;

import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDepartmentComplaintDetail } from "../hooks/useDepartmentComplaintDetail.js";
import DeptSummaryCard from "../details/DeptSummaryCard";
import DeptMediaGallery from "../details/DeptMediaGallery";
import DeptLocationCard from "../details/DeptLocationCard";
import DeptTimelineCard from "../details/DeptTimelineCard";
import CitizenInfoCard from "../details/CitizenInfoCard";
import MitraAssignmentCard from "../details/MitraAssignmentCard";
import StatusUpdateCard from "../details/StatusUpdateCard";
import DepartmentNoteCard from "../details/DepartmentNoteCard";

const DepartmentComplaintDetail = () => {
  const { id } = useParams();
  const {
    complaint,
    mitras,
    loading,
    error,
    setComplaint,
    assignMitra,
    updateStatus,
    addNote,
  } = useDepartmentComplaintDetail(id);

  const canAssignMitra = useMemo(() => {
    if (!complaint) return false;
    return (
      !complaint.assignedMitraId &&
      complaint.status !== "resolved" &&
      complaint.status !== "rejected"
    );
  }, [complaint]);

  const canUpdateStatus = useMemo(() => {
    if (!complaint) return false;
    return complaint.status !== "resolved" && complaint.status !== "rejected";
  }, [complaint]);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm">
        Failed to load complaint. It may not exist or you may not have access.
      </div>
    );
  }

  if (loading || !complaint) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 text-gray-600">
        Loading complaint details…
      </div>
    );
  }

  const images = complaint?.media?.images || [];
  const videos = complaint?.media?.videos || [];
  const location = complaint?.location;

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Department Complaint Review
        </h1>
        <div className="text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          {complaint?._id}
        </div>
      </header>

      <DeptSummaryCard c={complaint} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-3 space-y-4">
          <DeptMediaGallery images={images} videos={videos} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CitizenInfoCard citizen={complaint?.citizenId} />
            <DeptLocationCard location={location} />
          </div>

          <DeptTimelineCard timeline={complaint?.timeline} />
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-4">
          {canAssignMitra && (
            <MitraAssignmentCard
              mitras={mitras}
              onAssign={assignMitra}
              assignedMitra={complaint?.assignedMitraId}
            />
          )}

          {complaint?.assignedMitraId && (
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5">
              <h3 className="text-lg font-semibold mb-3">Assigned Mitra</h3>
              <div className="space-y-2 text-sm">
                <div className="text-gray-800 font-medium">
                  {complaint.assignedMitraId.fullName}
                </div>
                <div className="text-gray-600">
                  📱 {complaint.assignedMitraId.mobile}
                </div>
                <div className="text-gray-600">
                  📍 {complaint.assignedMitraId.zone}
                </div>
              </div>
            </div>
          )}

          {canUpdateStatus && (
            <StatusUpdateCard
              currentStatus={complaint?.status}
              onUpdate={updateStatus}
            />
          )}

          <DepartmentNoteCard onAddNote={addNote} />
        </div>
      </div>
    </div>
  );
};

export default DepartmentComplaintDetail;
