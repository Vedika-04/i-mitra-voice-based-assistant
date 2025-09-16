import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: "My Profile", path: "/myprofile" },
    { name: "My Complaints", path: "/my-complaints" },
    { name: "File Complaint", path: "/filecomplaint" },
  ];

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
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
      </aside>
    </>
  );
};

export default Sidebar;
