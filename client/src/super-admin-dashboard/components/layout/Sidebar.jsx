import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSuperAdminAuth } from "../../hooks/useSuperAdminAuth";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify"; // ✅ Import toast

const Sidebar = () => {
  const { logout } = useSuperAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!"); // ✅ Toast message
    navigate("/superadmin/login");
  };

  const navItems = [
    {
      path: "/superadmin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Overview & KPIs",
    },
    {
      path: "/superadmin/analytics",
      icon: BarChart3,
      label: "Analytics",
      description: "Department & Zone Stats",
    },
    {
      path: "/superadmin/reports",
      icon: FileText,
      label: "Reports",
      description: "Export & AI Analysis",
    },
    {
      path: "/superadmin/complaints",
      icon: MessageSquare,
      label: "Complaints",
      description: "All Complaints List",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">i-Mitra</h1>
            <p className="text-sm text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <div className="flex-1">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Stats Summary */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-800">
              Quick Stats
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Active</span>
              <span className="font-medium text-blue-600">1,234</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Resolved</span>
              <span className="font-medium text-green-600">890</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Escalated</span>
              <span className="font-medium text-red-600">45</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
