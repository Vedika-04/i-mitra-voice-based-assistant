import React, { useContext, useState } from "react";
import "../styles/Auth.css";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";

const Auth = () => {
  const { isAuthenticated } = useContext(Context);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={"/citizendashboard"} />;
  }

  return (
    <>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-toggle">
            <button
              className={`toggle-btn ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`toggle-btn ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
            <button className="toggle-btn" onClick={() => navigate("/")}>
              Home
            </button>
          </div>
          {isLogin ? <Login /> : <Register />}
        </div>
      </div>
    </>
  );
};

export default Auth;
