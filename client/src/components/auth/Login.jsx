// login.jsx
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userLoginContext } from "../../contexts/UserLoginContext";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import PreferencesModal from "./PreferencesModal"; // Modal component for preferences
import "./auth.css";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const { onLogin } = useContext(userLoginContext);

  async function userLogin(userCred) {
    const userData = await onLogin(userCred);
    
    // If the backend provides a flag, check it:
    if (userData && userData.isNewUser) {
      setShowPreferencesModal(true);
    } else {
      // Alternatively, use the flag stored during registration
      if (localStorage.getItem("isNewUser") === "true") {
        localStorage.removeItem("isNewUser");
        setShowPreferencesModal(true);
      } else {
        const returnPath = sessionStorage.getItem("returnAfterLogin");
        sessionStorage.removeItem("returnAfterLogin"); 
        navigate(returnPath || "/dashboard");
      }
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit(userLogin)}>
        <h2 className="auth-title">Login</h2>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Username" 
            {...register("username", { required: true })} 
            style={{ width: "100%" }}
          />
          {errors.username && <span className="error">*Required</span>}
        </div>
        <div className="input-group">
          <div className="password-container" style={{ position: "relative", width: "100%" }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              {...register("password", { required: true })} 
              style={{ paddingRight: "40px", width: "100%" }}
            />
            <span 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)} 
              style={{
                position: "absolute", 
                right: "10px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                cursor: "pointer"
              }}
            >
              {showPassword ? <LuEyeClosed /> : <LuEye />}
            </span>
          </div>
          {errors.password && <span className="error">*Required</span>}
        </div>
        <button type="submit" className="btn">LOGIN</button>
        <p className="switch-auth">
          Don't have an account?{" "}
          <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </form>
      
      {/* Render the modal when the state is true */}
      {showPreferencesModal && (
        <PreferencesModal 
          onClose={() => {
            setShowPreferencesModal(false);
            // Optionally, navigate to the dashboard after the modal is closed
            navigate("/dashboard");
          }} 
        />
      )}
    </div>
  );
}

export default Login;
