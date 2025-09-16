import { useDeptContext } from "../DeptContext.jsx";
import { toast } from "react-toastify";

const DeptHeader = ({ setSidebarOpen }) => {
  const { department, logout } = useDeptContext();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Department Title */}
          <h1 className="ml-2 text-xl font-semibold text-gray-800">
            {department} Department
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
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
                d="M15 17h5l-3-3 3-3h-5m-2 6V7a3 3 0 00-3-3H6a3 3 0 00-3 3v10a3 3 0 003 3h4a3 3 0 003-3z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
          </button>

          {/* Profile Section */}
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{department}</p>
              <p className="text-xs text-gray-500">Department Admin</p>
            </div>

            {/* Profile Avatar */}
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {department?.charAt(0) || "D"}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DeptHeader;
