import React from "react";

const colors = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

const StatCard = ({ title, value, color = "blue" }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md text-white ${colors[color]}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
