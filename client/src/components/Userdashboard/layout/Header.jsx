import React, { useContext } from "react";
import { Context } from "../../../main.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Menu } from "lucide-react"; // hamburger icon

const Header = ({ setIsOpen }) => {
  const { user, setUser, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="bg-green-600 text-white shadow-md p-4 flex justify-between items-center md:ml-64">
      {/* Hamburger (mobile only) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden focus:outline-none"
      >
        <Menu size={28} />
      </button>

      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        i-Mitra Dashboard
      </h1>

      <div className="flex items-center space-x-4">
        <span className="hidden sm:inline">
          Welcome, {user?.fullName || "User"}
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
