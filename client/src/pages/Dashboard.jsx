import { useContext } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useContext(Context);
  const logout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setUser(null);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.error(err);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.fullName || "Citizen"}
        </h1>

        {user?.profileimg ? (
          <img
            src={user.profileimg}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-blue-300 shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 mx-auto rounded-full bg-blue-200 flex items-center justify-center text-2xl text-white font-bold">
            {user?.fullName?.[0] || "C"}
          </div>
        )}

        <div className="text-left space-y-2">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Email:</span>{" "}
            {user?.email || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Phone:</span>{" "}
            {user?.phone || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Zone:</span>{" "}
            {user?.zone || "N/A"}
          </p>
        </div>

        {/* Buttons container including Logout */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <button
            onClick={() => {
              navigate("/citizendashboard");
            }}
            className="w-full sm:w-auto flex-1 min-w-[120px] px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition duration-300"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/filecomplaint")}
            className="w-full sm:w-auto flex-1 min-w-[120px] px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition duration-300"
          >
            File a complaint
          </button>
          <button
            onClick={logout}
            className="w-full sm:w-auto flex-1 min-w-[120px] px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
