import { format } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

// helpers.js में अपना formatDateTime function को replace करें:
export const formatDateTime = (date) => {
  // Null/undefined check
  if (!date) return "N/A";

  // Create Date object safely
  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    console.warn("Invalid date provided to formatDateTime:", date);
    return "Invalid Date";
  }

  // Your existing format logic
  return format(dateObj, "MMM dd, yyyy hh:mm a"); // or whatever format you use
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatPercentage = (num) => {
  return `${Number(num).toFixed(1)}%`;
};

export const getStatusBadgeColor = (status) => {
  const colors = {
    pending: "bg-orange-100 text-orange-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    escalated: "bg-purple-100 text-purple-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const getPriorityBadgeColor = (priority) => {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
};
