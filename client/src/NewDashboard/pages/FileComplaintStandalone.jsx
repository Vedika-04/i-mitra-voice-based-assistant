import React from "react";
import AppCitizenShell from "../layout/AppCitizenShell";
import CreateComplaintForm from "../../components/complaintForm.jsx";
import { useNavigate } from "react-router-dom";

const FileComplaintStandalone = () => {
  const navigate = useNavigate();

  return (
    <AppCitizenShell>
      <div className="space-y-5">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            File Complaint
          </h1>
          <button
            onClick={() => navigate("/citizendashboard")}
            className="text-sm rounded-full px-3 py-1.5 border border-emerald-100 bg-white hover:bg-emerald-50 text-emerald-700 font-semibold"
          >
            Back to Dashboard
          </button>
        </header>

        <div className="rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur p-4 sm:p-6">
          <CreateComplaintForm onClose={() => navigate("/citizendashboard")} />
        </div>
      </div>
    </AppCitizenShell>
  );
};

export default FileComplaintStandalone;
