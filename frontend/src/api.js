import axios from 'axios';

// The base URL for the backend API
const baseURL = 'http://localhost:5000';

// Function to set the Authorization header with the JWT token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Function to register a new user
const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to complete the second phase of the registration 
export const completeSecondPhase = async (userId, gamingPreferences, avatar) => {
  try {
    const response = await axios.patch(`${baseURL}/auth/complete-second-phase`, {
      userId,
      gamingPreferences,
      avatar,
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to login a user
const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, userData);
    localStorage.setItem('token', response.data.token); // Save the JWT token in local storage
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// Function to get user profile
const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to update user profile
const updateUserProfile = async (userId, updatedProfile) => {
  try {
    const response = await axios.patch(`${baseURL}/users/${userId}`, updatedProfile);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const setLoggedInUser = (token) => {
  setAuthToken(token);
};

export { setAuthToken, registerUser, loginUser, getUserProfile, updateUserProfile, setLoggedInUser };
