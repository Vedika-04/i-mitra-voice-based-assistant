import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../../main.jsx";
import { toast } from "react-toastify";

const ComplaintDetailModal = ({ complaintId, onClose }) => {
  const { user } = useContext(Context);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/complaint/${complaintId}`,
          {
            withCredentials: true,
          }
        );
        setComplaint(res.data.complaint);
      } catch (err) {
        toast.error("Failed to load complaint.");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [complaintId]);

  const handleResolve = async () => {
    if (!window.confirm("Are you sure you want to resolve this complaint?"))
      return;
    try {
      setActionLoading(true);
      await axios.patch(
        `http://localhost:4000/api/v1/complaint/${complaintId}/resolve`,
        {},
        { withCredentials: true }
      );
      toast.success("Complaint resolved.");
      setComplaint({ ...complaint, status: "resolved" });
    } catch (err) {
      toast.error("Failed to resolve complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async () => {
    const reason = prompt("Enter reason for escalation:");
    if (!reason) return;
    try {
      setActionLoading(true);
      const res = await axios.patch(
        `http://localhost:4000/api/v1/complaint/${complaintId}/escalate/officer`,
        { reason },
        { withCredentials: true }
      );
      toast.success("Complaint escalated.");
      setComplaint({
        ...complaint,
        escalation: res.data.escalation,
        status: res.data.status,
      });
    } catch (err) {
      toast.error("Failed to escalate complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 overflow-auto py-10">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-2">{complaint.title}</h2>
        <p className="text-gray-600 mb-2">{complaint.description}</p>
        <p className="text-sm mb-2">
          <span className="font-medium">Category:</span>{" "}
          {complaint.category || "N/A"}
        </p>
        <p className="text-sm mb-2">
          <span className="font-medium">Department:</span>{" "}
          {complaint.departmentName || "N/A"}
        </p>
        <p
          className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
            complaint.status === "pending"
              ? "bg-yellow-200 text-yellow-800"
              : complaint.status === "resolved"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {complaint.status.toUpperCase()}
        </p>

        {/* Media */}
        {complaint.media?.images?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {complaint.media.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="complaint"
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
        {complaint.media?.videos?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {complaint.media.videos.map((vid, idx) => (
              <video
                key={idx}
                src={vid}
                controls
                className="w-32 h-32 rounded"
              />
            ))}
          </div>
        )}

        {/* Timeline */}
        {complaint.timeline?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Timeline Updates</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {complaint.timeline.map((entry, idx) => (
                <li key={idx} className="border p-2 rounded">
                  <p className="text-sm text-gray-600">{entry.caption}</p>
                  <p className="text-xs text-gray-400">
                    By {entry.mitraId || "Mitra"} on{" "}
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  {entry.media?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto mt-1">
                      {entry.media.map((m, i) =>
                        m.endsWith(".mp4") ? (
                          <video
                            key={i}
                            src={m}
                            controls
                            className="w-24 h-24 rounded"
                          />
                        ) : (
                          <img
                            key={i}
                            src={m}
                            alt="timeline"
                            className="w-24 h-24 object-cover rounded"
                          />
                        )
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons (for officer role) */}
        {user?.role === "officer" && (
          <div className="flex gap-2 mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              onClick={handleResolve}
              disabled={actionLoading || complaint.status === "resolved"}
            >
              Resolve
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              onClick={handleEscalate}
              disabled={actionLoading}
            >
              Escalate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailModal;
