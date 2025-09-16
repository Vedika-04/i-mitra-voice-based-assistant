import { useState } from "react";
import { format } from "date-fns";
import ComplaintDetails from "./ComplaintDetails";

export default function ComplaintCard({ complaint, refreshData }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // SLA status calculation
  const slaDue = new Date(complaint.sla.dueAt);
  const isOverdue = slaDue < new Date();

  return (
    <>
      <div
        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{complaint.title}</h3>
            <p className="text-sm text-gray-600">
              {format(new Date(complaint.createdAt), "PP")} •{" "}
              {complaint.departmentName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                complaint.status === "in_progress"
                  ? "bg-blue-100 text-blue-800"
                  : complaint.status === "resolved"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {complaint.status.replace("_", " ")}
            </span>
            {complaint.status !== "resolved" && (
              <span
                className={`text-xs font-medium ${
                  isOverdue ? "text-red-600" : "text-yellow-600"
                }`}
              >
                ⏳ {isOverdue ? "Overdue" : `Due ${format(slaDue, "MMM dd")}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Complaint details modal */}
      {showDetails && (
        <ComplaintDetails
          complaint={complaint}
          onClose={() => setShowDetails(false)}
          onFeedbackOpen={() => setShowFeedback(true)}
        />
      )}
    </>
  );
}
