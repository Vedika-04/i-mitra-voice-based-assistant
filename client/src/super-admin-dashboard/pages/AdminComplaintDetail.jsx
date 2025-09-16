import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SuperAdminLayout } from "../components/layout";
import { LoadingSpinner } from "../components/ui";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Image,
  Video,
} from "lucide-react";
import {
  formatDateTime,
  getStatusBadgeColor,
  getPriorityBadgeColor,
} from "../utils/helpers";
import axios from "axios";
import { useState, useEffect } from "react";

const AdminComplaintDetail = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/v1/superadmin/complaints/${complaintId}`,
        { withCredentials: true }
      );
      const item = response.data.item;

      const normalizedTimeline = (item.timeline || []).map((t) => ({
        action: `${t.addedByType?.toUpperCase() || "SYSTEM"} update by ${
          t.addedBy || "system"
        }`,
        timestamp: t.at,
        comment: t.caption,
        media: Array.isArray(t.media) ? t.media : [], // ensure array
      }));

      setComplaint({ ...item, timeline: normalizedTimeline });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaint");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout title="Complaint Details">
        <LoadingSpinner size="xl" text="Loading complaint details..." />
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout title="Complaint Details">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700">Error: {error}</span>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!complaint) {
    return (
      <SuperAdminLayout title="Complaint Details">
        <div className="text-center py-8">
          <p className="text-gray-500">Complaint not found</p>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout title="Complaint Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/superadmin/complaints")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Complaints</span>
          </button>

          <div className="flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                complaint.status
              )}`}
            >
              {complaint.status.replace("_", " ").toUpperCase()}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(
                complaint.priority
              )}`}
            >
              {complaint.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {complaint.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-900 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Category
                    </h3>
                    <p className="text-gray-900">{complaint.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1"></h3>
                    <p className="text-gray-900">{complaint.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {complaint.timeline && complaint.timeline.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Timeline
                </h3>
                <div className="space-y-4">
                  {complaint.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {event.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(event.timestamp)}
                        </p>
                        {event.comment && (
                          <p className="text-sm text-gray-700 mt-1">
                            {event.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media */}
            {(complaint.media?.images?.length > 0 ||
              complaint.media?.videos?.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attachments
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {complaint.media.images?.map((image, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                  {complaint.media.videos?.map((video, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <video controls className="w-full h-32">
                        <source src={video} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="text-sm font-medium">
                      {formatDateTime(complaint.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="text-sm font-medium">
                      {complaint.departmentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Zone</p>
                    <p className="text-sm font-medium">{complaint.zone}</p>
                  </div>
                </div>

                {complaint.resolvedAt && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="text-sm font-medium">
                        {formatDateTime(complaint.resolvedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SLA Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                SLA Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <span className="text-sm font-medium">
                    {complaint.sla?.dueAt
                      ? formatDateTime(complaint.sla.dueAt)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.sla?.breached
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {complaint.sla?.breached ? "Breached" : "On Time"}
                  </span>
                </div>
              </div>
            </div>

            {/* Escalation Info */}
            {complaint.escalation?.isEscalated && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Escalation
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium capitalize">
                      {complaint.escalation.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-medium">
                      {formatDateTime(complaint.escalation.at)}
                    </span>
                  </div>
                  {complaint.escalation.reason && (
                    <div>
                      <span className="text-sm text-gray-600">Reason:</span>
                      <p className="text-sm font-medium mt-1">
                        {complaint.escalation.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminComplaintDetail;
