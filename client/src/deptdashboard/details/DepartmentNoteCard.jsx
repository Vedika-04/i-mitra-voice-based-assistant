import React, { useState } from "react";

const DepartmentNoteCard = ({ onAddNote }) => {
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAddNote = async () => {
    if (!note.trim()) return;

    setAdding(true);
    try {
      await onAddNote(note.trim());
      setNote("");
    } catch (error) {
      // Error handled in hook
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-3">
      <h3 className="text-lg font-semibold">Add Department Note</h3>

      <div className="space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full min-h-[80px] border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Add internal note or comment..."
          disabled={adding}
        />

        <button
          onClick={handleAddNote}
          disabled={!note.trim() || adding}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:from-gray-700 hover:to-gray-600 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add Note"}
        </button>
      </div>
    </div>
  );
};

export default DepartmentNoteCard;
