import React from "react";

const statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  resolved: "bg-green-200 text-green-800",
  escalated: "bg-red-200 text-red-800",
};

const ComplaintCard = ({ complaint }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <h3 className="font-semibold text-lg">{complaint.title}</h3>
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
        className={`inline-block px-2 py-1 rounded ${
          statusColors[complaint.status] || "bg-gray-200 text-gray-800"
        } text-xs font-semibold mb-2`}
      >
        {complaint.status.toUpperCase()}
      </p>

      {complaint.media?.images?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-2">
          {complaint.media.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="complaint"
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      )}
      {complaint.media?.videos?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {complaint.media.videos.map((vid, idx) => (
            <video key={idx} src={vid} controls className="w-32 h-32 rounded" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
