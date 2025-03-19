import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Register() {
  const {register,handleSubmit,formState: { errors },} = useForm();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const onRegisterSuccess = () => {
    localStorage.setItem("isNewUser", "true");
    navigate("/login");
  };

  async function onUserRegister(newUser) {
    try {
      let res = await fetch(`http://localhost:4000/user-api/register`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newUser),
      });
      let data = await res.json();

      if (data.message === "user created") {
        onRegisterSuccess();
      } else {
        setErr(data.message);
      }
    } catch (err) {
      setErr(err.message);
    }
  }
  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit(onUserRegister)}>
        <h2 className="auth-title">Register</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: true, minLength: 4 })}
          />
          {errors.username && (
            <span className="error">*At least 4 characters required</span>
          )}
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
          />
          {errors.email && <span className="error">*Required</span>}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && <span className="error">*Required</span>}
        </div>

        <button type="submit" className="btn">
          REGISTER
        </button>

        <p className="switch-auth">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
