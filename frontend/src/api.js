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
const getUserProfile = async () => {
  try {
    const response = await axios.get(`${baseURL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
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

// Function to create a gaming group
const createGamingGroup = async (groupData) => {
  try {
    const response = await axios.post(`${baseURL}/groups`, groupData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get group details by ID
const getGroupDetails = async (groupId) => {
  try {
    const response = await axios.get(`${baseURL}/groups/${groupId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to join a gaming group
const joinGroup = async (groupId) => {
  try {
    const response = await axios.post(`${baseURL}/groups/${groupId}/join`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to leave a gaming group
const leaveGroup = async (groupId) => {
  try {
    const response = await axios.post(`${baseURL}/groups/${groupId}/leave`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to kick a member from a gaming group
const kickMember = async (groupId, memberId) => {
  
  try {
    const response = await axios.post(`${baseURL}/groups/${groupId}/kick`, { memberId });
    

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to promote a member to moderator in a gaming group
const promoteMember = async (groupId, memberId) => {
  try {
    const response = await axios.post(`${baseURL}/groups/${groupId}/promote`, { memberId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to demote a moderator back to a regular member in a gaming group
const demoteMember = async (groupId, memberId) => {
  try {
    const response = await axios.post(`${baseURL}/groups/${groupId}/demote`, { memberId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to transfer ownership of a gaming group
const transferOwnership = async (groupId, newOwnerId) => {
  try {
    const response = await axios.post(`${baseURL}/groups/${groupId}/transfer-ownership`, { newOwnerId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to send a chat message
const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${baseURL}/chatMessages`, message);
    return response.data;
  } catch (error) {
    throw new Error('Failed to send chat message');
  }
};

export {
  setAuthToken,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  setLoggedInUser,
  createGamingGroup,
  getGroupDetails,
  joinGroup,
  leaveGroup,
  kickMember,
  promoteMember,
  demoteMember,
  transferOwnership,
  sendChatMessage,
};
