import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userLoginContext } from "../../contexts/UserLoginContext";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import "./auth.css";
import { color } from "framer-motion";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { onLogin } = useContext(userLoginContext);

  function userLogin(userCred) {
    console.log("User Logged In", userCred);
    onLogin(userCred);
    // Check for return path and navigate accordingly
    const returnPath = sessionStorage.getItem("returnAfterLogin");
    sessionStorage.removeItem("returnAfterLogin"); // Clear stored path after use
    navigate(returnPath || "/"); // Redirect to stored path or default
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
              style={{ paddingRight: "40px", position: "relative", zIndex: "1", width: "100%" }}
            />
            <span className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: "2" }}>
              {showPassword ? <LuEyeClosed className="eye-icon" /> : <LuEye className="eye-icon" />}
            </span>
          </div>
          {errors.password && <span className="error">*Required</span>}
        </div>

        <button type="submit" className="btn" >LOGIN</button>

        <p className="switch-auth">Don't have an account? <span onClick={() => navigate('/register')}>Register</span></p>
      </form>
    </div>
  );
}

export default Login;