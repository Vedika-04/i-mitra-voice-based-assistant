import { useState } from "react";
import axios from "axios";

export default function FeedbackModal({ complaintId, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post(
        `/api/v1/complaint/${complaintId}/feedback`,
        { rating, comment },
        { withCredentials: true }
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Feedback submission failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Rate Your Experience</h3>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder="Additional comments (optional)"
          className="w-full p-2 border rounded mb-4"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rating}
            className={`px-4 py-2 rounded text-white ${
              !rating ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
