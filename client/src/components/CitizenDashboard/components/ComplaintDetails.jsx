import { useState } from "react";
import { format } from "date-fns";
import FeedbackModal from "./FeedbackModal";

export default function ComplaintDetails({
  complaint,
  onClose,
  onFeedbackOpen,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{complaint.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm text-gray-500">Filed On</h3>
              <p>{format(new Date(complaint.createdAt), "PPpp")}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Department</h3>
              <p>{complaint.departmentName}</p>
            </div>
            {complaint.resolvedAt && (
              <div>
                <h3 className="text-sm text-gray-500">Resolved On</h3>
                <p>{format(new Date(complaint.resolvedAt), "PPpp")}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-1">Description</h3>
            <p className="whitespace-pre-line">{complaint.description}</p>
          </div>

          {/* Feedback section */}
          {complaint.status === "resolved" && (
            <div className="mt-4">
              {complaint.feedback ? (
                <div className="bg-green-50 p-3 rounded">
                  <h3 className="font-medium">Your Feedback</h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < complaint.feedback.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {complaint.feedback.comment && (
                    <p className="mt-2 text-sm">{complaint.feedback.comment}</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={onFeedbackOpen}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit Feedback
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
