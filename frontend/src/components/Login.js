import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, setAuthToken } from "../api";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [serverResponse, setServerResponse] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setServerResponse(null);
      const response = await loginUser(formData);

      setAuthToken(response.token);

      navigate("/profile");
    } catch (error) {
      if (error?.response?.data?.message) {
        setServerResponse(error.response.data.message);
      } else {
        setServerResponse(
          "Login failed. Please check your username and password."
        );
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username" className="login-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="login-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="login-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        {serverResponse && (
          <div className="server-response">{serverResponse}</div>
        )}
      </form>
      <p className="register-link">
        Don't have an account?{" "}
        <Link to="/register" className="register-link">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
