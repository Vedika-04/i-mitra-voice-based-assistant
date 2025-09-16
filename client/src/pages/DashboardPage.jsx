import { useContext } from "react";
import Dashboard from "./Dashboard";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import ChatBot from "../../LandingPage/src/components/layout/ChatBot1.jsx";
const DashboardF = () => {
  const { isAuthenticated } = useContext(Context);

  if (!isAuthenticated) {
    return <Navigate to={"/auth"} />;
  }

  return (
    <>
      <section className="home">
        <Dashboard />
        <ChatBot />
        <button>Logout</button>
      </section>
    </>
  );
};

export default DashboardF;
