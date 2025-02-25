import React, { useState } from 'react';
 import './auth.css';
import Login from './Login';
import Register from './Register';

function Auth() {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleRegistrationSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => handleTabSwitch("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => handleTabSwitch("register")}
          >
            Register
          </button>
        </div>

        <div className="auth-forms">
          {activeTab === "login" ? (
            <Login />
          ) : (
            <Register onRegisterSuccess={handleRegistrationSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
