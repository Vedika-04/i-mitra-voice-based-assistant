import React, { useState } from "react";
import { submitFeedbackApi } from "../../hooks/useComplaintDetail";

const FeedbackForm = ({ complaintId, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const disabled = submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await submitFeedbackApi(complaintId, { rating, comment });
      onSubmitted?.({ rating, comment, at: new Date().toISOString() });
    } catch (e) {
      setErr("Failed to submit feedback. Ensure the complaint is resolved.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-4"
    >
      <h2 className="text-lg font-semibold">Feedback</h2>
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-700">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          disabled={disabled}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-700">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 w-full min-h-[96px] border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Share your experience…"
          disabled={disabled}
        />
      </div>
      {err && (
        <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md p-2">
          {err}
        </div>
      )}
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
