import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FolderOpen, PlusCircle, User2 } from "lucide-react";

const nav = [
  { label: "Dashboard", to: "/citizendashboard", icon: Home },
  { label: "My Complaints", to: "/my-complaints", icon: FolderOpen },
  { label: "File Complaint", to: "/filecomplaint", icon: PlusCircle },
  { label: "My Profile", to: "/myprofile", icon: User2 },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-md border-r border-emerald-100 shadow-sm transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:z-auto`}
        aria-label="Sidebar navigation"
      >
        <div className="h-16 border-b border-emerald-100 px-5 flex items-center">
          <span className="font-extrabold tracking-tight text-emerald-700">
            Navigation
          </span>
        </div>

        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl border transition
                  ${
                    isActive
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-white/70 hover:bg-emerald-50 border-transparent text-gray-700"
                  }`
                }
                onClick={onClose}
              >
                <Icon
                  size={18}
                  className="shrink-0 text-emerald-600 group-hover:scale-110 transition-transform"
                />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto p-4 text-xs text-gray-500">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
            Tip: Use the menu to navigate or swipe from the left on mobile.
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
