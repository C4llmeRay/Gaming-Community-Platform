import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import "../styles/Register.css"; // Import the new stylesheet

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleRegisterButtonClick = async () => {
    try {
      const response = await registerUser(formData);
      if (response.token) {
        // If registration is successful, navigate to the second phase page and pass the userId in state
        navigate("/second-phase", { state: { userId: response.userId } });
      }
    } catch (error) {
      // Handle any errors, such as duplicate username or email
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>
      <label className="register-label" htmlFor="username">
        Username:
      </label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
      />
      <br />
      <label className="register-label" htmlFor="email">
        Email:
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <br />
      <label className="register-label" htmlFor="password">
        Password:
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <br />
      <button className="register-button" onClick={handleRegisterButtonClick}>
        Register
      </button>
    </div>
  );
};

export default Register;
