import React from "react";

const Footer = () => {
  return (
    <footer className="mt-8 bg-white/80 backdrop-blur-md border-t border-emerald-100">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-sm text-gray-600">
        <span>© {new Date().getFullYear()} i‑Mitra. All rights reserved.</span>
        <span className="text-emerald-700 font-medium">Citizen Dashboard</span>
      </div>
    </footer>
  );
};

export default Footer;
