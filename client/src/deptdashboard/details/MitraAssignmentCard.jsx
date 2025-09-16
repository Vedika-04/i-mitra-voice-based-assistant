import React, { useState } from "react";

const MitraAssignmentCard = ({ mitras = [], onAssign, assignedMitra }) => {
  const [selectedMitra, setSelectedMitra] = useState("");
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedMitra) return;

    setAssigning(true);
    try {
      await onAssign(selectedMitra);
      setSelectedMitra("");
    } catch (error) {
      // Error handled in hook
    } finally {
      setAssigning(false);
    }
  };

  if (assignedMitra) {
    return null; // Don't show if already assigned
  }

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 space-y-3">
      <h3 className="text-lg font-semibold">Assign Mitra</h3>

      <div className="space-y-3">
        <select
          value={selectedMitra}
          onChange={(e) => setSelectedMitra(e.target.value)}
          className="w-full border border-emerald-100 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          disabled={assigning}
        >
          <option value="">Select a Mitra</option>
          {mitras.map((mitra) => (
            <option key={mitra._id} value={mitra._id}>
              {mitra.fullName} - {mitra.zone}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={!selectedMitra || assigning}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50"
        >
          {assigning ? "Assigning..." : "Assign Mitra"}
        </button>
      </div>

      {mitras.length === 0 && (
        <div className="text-sm text-gray-600">
          No mitras available for assignment.
        </div>
      )}
    </div>
  );
};

export default MitraAssignmentCard;
