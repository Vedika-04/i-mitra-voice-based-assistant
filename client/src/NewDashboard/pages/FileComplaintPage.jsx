import React, { useEffect, useState } from "react";
import AppCitizenShell from "../layout/AppCitizenShell";
import CreateComplaintModal from "../../components/complaintForm.jsx";
import { useNavigate } from "react-router-dom";

const FileComplaintPage = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  // Close modal → go back to dashboard
  const handleClose = () => {
    setOpen(false);
    // Small delay to allow modal fade (if using transitions)
    setTimeout(() => {
      navigate("/citizendashboard");
    }, 0);
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <AppCitizenShell>
      <div className="space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            File Complaint
          </h1>
          <span className="text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            Guided
          </span>
        </header>

        <p className="text-gray-600">
          Please provide details and attach relevant photos or videos. Location
          helps us resolve faster.
        </p>

        {/* Your modal opens over this page while keeping the layout visible */}
        {open && <CreateComplaintModal onClose={handleClose} />}
      </div>
    </AppCitizenShell>
  );
};

export default FileComplaintPage;
