import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSuperAdminAuth } from "../../hooks/useSuperAdminAuth";
import {
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  Shield,
  Bell,
  Search,
  ChevronRight,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";

export const SuperAdminLayout = ({ children, title, onRefresh }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, admin } = useSuperAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/superadmin/dashboard",
      icon: LayoutDashboard,
      badge: null,
      description: "Overview & KPIs",
    },
    {
      name: "Analytics",
      href: "/superadmin/analytics",
      icon: TrendingUp,
      badge: null,
      description: "Department & Zone Stats",
    },
    {
      name: "Complaints",
      href: "/superadmin/complaints",
      icon: FileText,
      badge: "12",
      description: "All Complaints List",
    },
    {
      name: "Reports",
      href: "/superadmin/reports",
      icon: BarChart3,
      badge: null,
      description: "Export & AI Analysis",
    },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/superadmin/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* Fixed Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-br from-indigo-500 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">i-Mitra</h1>
              <p className="text-xs text-slate-300">Super Admin</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {admin?.username?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {admin?.username || "Administrator"}
              </p>
              <p className="text-xs text-slate-500">Super Administrator</p>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-full">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    closeSidebar();
                  }}
                  className={`group flex items-center justify-between w-full px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-indigo-500"
                      }`}
                    />
                    <div className="text-left">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div
                        className={`text-xs ${
                          isActive ? "text-indigo-100" : "text-slate-500"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Heat Map Button - Replace Quick Stats section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/superadmin/heatmap")}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
            >
              <MapPin className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold text-sm">Heat Map 🔥</div>
                <div className="text-xs text-orange-100">
                  View All Complaints
                </div>
              </div>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Hamburger menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div>
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-600 hidden sm:block">
                  Professional dashboard management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search button */}
              <button className="hidden sm:flex p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-200">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
                  3
                </span>
              </button>

              {/* Refresh button */}
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="hidden sm:flex px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  Refresh Data
                </button>
              )}

              {/* User menu for desktop */}
              <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {admin?.username?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-slate-700 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden md:block">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile refresh button */}
          {onRefresh && (
            <div className="sm:hidden px-4 pb-3">
              <button
                onClick={onRefresh}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                Refresh Data
              </button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
              <span>Super Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-semibold">{title}</span>
            </div>

            {/* Content */}
            <div className="space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
