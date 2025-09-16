import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useComplaintDetail } from "../hooks/useComplaintDetail";
import SummaryCard from "../components/Detail/SummaryCard";
import MediaGallery from "../components/Detail/MediaGallery";
import LocationCard from "../components/Detail/LocationCard";
import TimelineCard from "../components/Detail/TimelineCard";
import FeedbackForm from "../components/Detail/FeedbackForm";

const ComplaintDetail = () => {
  const { complaintId } = useParams();
  const { complaint, loading, error, setComplaint } =
    useComplaintDetail(complaintId);

  const canGiveFeedback = useMemo(() => {
    if (!complaint) return false;
    const isResolved = (complaint.status || "").toLowerCase() === "resolved";
    const hasFeedback = !!complaint.feedback;
    return isResolved && !hasFeedback;
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
        Loading complaint…
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
          Complaint Detail
        </h1>
        <div className="text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          {complaint?._id}
        </div>
      </header>
      <SummaryCard c={complaint} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <MediaGallery images={images} videos={videos} />
          <TimelineCard timeline={complaint?.timeline} />
        </div>
        <div className="space-y-4">
          <LocationCard location={location} />
          {canGiveFeedback ? (
            <FeedbackForm
              complaintId={complaint?._id}
              onSubmitted={(fb) =>
                setComplaint((prev) => ({ ...prev, feedback: fb }))
              }
            />
          ) : complaint?.feedback ? (
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5">
              <h2 className="text-lg font-semibold">Feedback</h2>
              <div className="mt-2 text-sm text-gray-800">
                Thank you for your feedback.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
