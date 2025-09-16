// components/Userdashboard/cards/StateCard.jsx
import React from "react";

const StateCard = ({ title, count, color }) => {
  return (
    <div
      className={`flex-1 bg-white shadow-md rounded p-4 border-l-4 ${color} transition hover:shadow-lg`}
    >
      <h2 className="text-gray-600 font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">{count}</p>
    </div>
  );
};

export default StateCard;
