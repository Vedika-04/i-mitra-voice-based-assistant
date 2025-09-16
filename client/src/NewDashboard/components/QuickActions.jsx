// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { PlusCircle, FolderOpen } from "lucide-react";

// const QuickActions = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//       <button
//         onClick={() => navigate("/filecomplaint")}
//         className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 sm:p-5 shadow-sm hover:from-emerald-700 hover:to-emerald-600 transition group"
//       >
//         <PlusCircle
//           size={20}
//           className="group-hover:scale-110 transition-transform"
//         />
//         <span className="font-semibold">File New Complaint</span>
//       </button>

//       <button
//         onClick={() => navigate("/my-complaints")}
//         className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-100 bg-white hover:bg-emerald-50 text-emerald-700 p-4 sm:p-5 transition group"
//       >
//         <FolderOpen
//           size={20}
//           className="group-hover:scale-110 transition-transform"
//         />
//         <span className="font-semibold">View All Complaints</span>
//       </button>
//     </div>
//   );
// };

// export default QuickActions;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  FolderOpen,
  ChevronRight,
  FileSearch,
  AlertTriangle,
} from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "File New Complaint",
      icon: <PlusCircle size={20} />,
      path: "/filecomplaint",
      variant: "primary",
      description: "Submit a new complaint with details and attachments",
    },
    {
      title: "View All Complaints",
      icon: <FolderOpen size={20} />,
      path: "/my-complaints",
      variant: "secondary",
      description: "Check status of all your submitted complaints",
    },
    {
      title: "Check Status",
      icon: <FileSearch size={20} />,
      path: "/status",
      variant: "secondary",
      description: "Track progress of your recent complaints",
    },
    {
      title: "Urgent Issues",
      icon: <AlertTriangle size={20} />,
      path: "/urgent",
      variant: "danger",
      description: "Report critical issues needing immediate attention",
    },
  ];

  const variantStyles = {
    primary:
      "border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-100",
    secondary:
      "border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 shadow-gray-100",
    danger:
      "border-red-200 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-red-100",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className={`flex flex-col justify-between rounded-xl border p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 group ${
              variantStyles[action.variant]
            }`}
            aria-label={action.title}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 rounded-lg ${
                  action.variant === "primary"
                    ? "bg-emerald-700/20"
                    : action.variant === "danger"
                    ? "bg-red-700/20"
                    : "bg-emerald-100"
                }`}
              >
                {React.cloneElement(action.icon, {
                  className: `group-hover:scale-110 transition-transform ${
                    action.variant === "primary"
                      ? "text-white"
                      : action.variant === "danger"
                      ? "text-white"
                      : "text-emerald-600"
                  }`,
                })}
              </div>
              <ChevronRight
                size={18}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  action.variant === "primary"
                    ? "text-white"
                    : action.variant === "danger"
                    ? "text-white"
                    : "text-emerald-600"
                }`}
              />
            </div>

            <div className="text-left">
              <h3 className="font-semibold">{action.title}</h3>
              <p
                className={`text-xs mt-1 ${
                  action.variant === "primary"
                    ? "text-emerald-100"
                    : action.variant === "danger"
                    ? "text-red-100"
                    : "text-gray-500"
                }`}
              >
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
