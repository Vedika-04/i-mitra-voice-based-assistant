import { Link, useLocation } from "react-router-dom";
import { useDeptContext } from "../DeptContext.jsx";

const DeptSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { department } = useDeptContext();

  const navigation = [
    {
      name: "Dashboard",
      href: "/department",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      name: "All Complaints",
      href: "/department/complaints",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Escalated",
      href: "/department/complaints/escalated",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
    {
      name: "311 Complaints",
      href: "/department/complaint311",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      name: "Mitras",
      href: "/department/mitras",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: "Register Mitra",
      href: "/department/mitras/register",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
    },
  ];

  // 🔧 FIXED: Proper route matching to prevent multiple selections
  const isActive = (href) => {
    const currentPath = location.pathname;

    // Exact match for dashboard
    if (href === "/department") {
      return currentPath === "/department";
    }

    // Special handling for escalated complaints
    if (href === "/department/complaints/escalated") {
      return currentPath === "/department/complaints/escalated";
    }

    // Special handling for mitras register
    if (href === "/department/mitras/register") {
      return currentPath === "/department/mitras/register";
    }

    // Special handling for mitras (but not register)
    if (href === "/department/mitras") {
      return (
        currentPath === "/department/mitras" ||
        (currentPath.startsWith("/department/mitras") &&
          !currentPath.includes("/register"))
      );
    }

    // General complaints (but not escalated)
    if (href === "/department/complaints") {
      return (
        currentPath === "/department/complaints" ||
        (currentPath.startsWith("/department/complaints") &&
          !currentPath.includes("/escalated"))
      );
    }

    // Default fallback
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto shadow-sm">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">IM</span>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-semibold text-gray-900">i-mitra</p>
                  <p className="text-xs text-gray-500">Department Portal</p>
                </div>
              </div>
            </div>

            {/* Department Info */}
            <div className="mx-4 mb-6 bg-blue-50 rounded-lg p-3 border border-blue-100">
              <p className="text-sm font-medium text-blue-800">
                Current Department
              </p>
              <p className="text-blue-900 font-semibold text-sm truncate">
                {department}
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200`}
                >
                  <span
                    className={`${
                      isActive(item.href)
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                © 2025 i-mitra System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar - Apply same isActive logic */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg border-r border-gray-200`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IM</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                i-mitra
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Department Info */}
          <div className="mx-4 my-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-medium text-blue-800">Department</p>
            <p className="text-blue-900 font-semibold text-sm truncate">
              {department}
            </p>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200`}
              >
                <span
                  className={`${
                    isActive(item.href)
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  } mr-3 flex-shrink-0`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default DeptSidebar;
