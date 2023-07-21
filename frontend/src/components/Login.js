import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, setAuthToken } from '../api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [serverResponse, setServerResponse] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setServerResponse(null); // Clear previous response
      const response = await loginUser(formData);

      // If the login is successful, the server response will be the JWT token
      setAuthToken(response.token); // Set the JWT token in axios headers

      // Navigate the user to profile page after successful login.
      navigate('/profile');
    } catch (error) {
      // Display the specific server error message if available, or fallback to a generic error message
      if (error?.response?.data?.message) {
        setServerResponse(error.response.data.message);
      } else {
        setServerResponse('Login failed. Please check your username and password.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
        {serverResponse && <div>{serverResponse}</div>}
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
