import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userLoginContext } from "../../contexts/UserLoginContext";
import "./auth.css";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {onLogin} = useContext(userLoginContext)

  function userLogin(userCred) {
    console.log("User Logged In", userCred);
    onLogin(userCred)
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
          />
          {errors.username && <span className="error">*Required</span>}
        </div>

        <div className="input-group">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            {...register("password", { required: true })} 
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>👁️</span>
          {errors.password && <span className="error">*Required</span>}
        </div>

        <button type="submit" className="btn">SIGN IN</button>

      
       
        <p className="switch-auth">Don't have an account? <span onClick={() => navigate('/register')}>Register</span></p>
      </form>
    </div>
  );
}

export default Login;
