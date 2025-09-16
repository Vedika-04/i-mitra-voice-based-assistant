import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react"; // for hamburger icon

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "My Profile", path: "/myprofile" },
    { name: "My Complaints", path: "/my-complaints" },
    { name: "File Complaint", path: "/filecomplaint" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-6 py-4 text-green-600 font-bold text-xl border-b border-gray-200">
          i-Mitra
        </div>
        <ul className="mt-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-6 py-3 hover:bg-green-50 border-l-4 ${
                    isActive
                      ? "border-green-600 bg-green-50 text-green-700 font-semibold"
                      : "border-transparent text-gray-700"
                  }`
                }
                onClick={() => setIsOpen(false)} // auto close on mobile click
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Navbar (Hamburger for small screens) */}
      <div className="flex-1 flex items-center justify-between md:hidden bg-green-600 p-4 text-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <Menu size={28} />
        </button>
        <span className="font-bold">i-Mitra Dashboard</span>
      </div>

      {/* Main Content placeholder */}
      <div className="flex-1 p-6 md:ml-64">
        <h1 className="text-2xl font-bold">Welcome to i-Mitra Dashboard</h1>
        <p className="mt-4 text-gray-600">
          This is where your main content will appear.
        </p>
      </div>
    </div>
  );
};

export default Navbar;
