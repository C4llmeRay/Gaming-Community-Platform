import axios from "axios";

// The base URL for the backend API
const baseURL = "http://localhost:5000";

// Function to set the Authorization header with the JWT token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
// Function to get all users
const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseURL}/users`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching users:", error);
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
export const completeSecondPhase = async (
  userId,
  gamingPreferences,
  avatar
) => {
  try {
    const response = await axios.patch(
      `${baseURL}/auth/complete-second-phase`,
      {
        userId,
        gamingPreferences,
        avatar,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to login a user
const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, userData);
    localStorage.setItem("token", response.data.token); // Save the JWT token in local storage
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
const getOtherUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching other user profile:", error);
  }
};
// Function to update user profile
const updateUserProfile = async (userId, updatedProfile) => {
  try {
    const response = await axios.patch(
      `${baseURL}/users/${userId}`,
      updatedProfile
    );
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
    const response = await axios.post(`${baseURL}/groups/${groupId}/kick`, {
      memberId,
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to promote a member to moderator in a gaming group
const promoteMember = async (groupId, memberId) => {
  try {
    const response = await axios.post(`${baseURL}/groups/${groupId}/promote`, {
      memberId,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to demote a moderator back to a regular member in a gaming group
const demoteMember = async (groupId, memberId) => {
  try {
    const response = await axios.post(`${baseURL}/groups/${groupId}/demote`, {
      memberId,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to transfer ownership of a gaming group
const transferOwnership = async (groupId, newOwnerId) => {
  try {
    const response = await axios.post(
      `${baseURL}/groups/${groupId}/transfer-ownership`,
      { newOwnerId }
    );
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
    throw new Error("Failed to send chat message");
  }
};
const deleteChatMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${baseURL}/chatMessages/${messageId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
const sendFriendRequest = async (userId) => {
  try {
    const response = await axios.post(
      `${baseURL}/users/friend/request/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Accept a friend request from the specified user
const acceptFriendRequest = async (requestId) => {
  try {
    console.log(requestId);
    const response = await axios.post(
      `${baseURL}/users/friend/accept/${requestId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to decline a friend request
const declineFriendRequest = async (requestId) => {
  try {
    const response = await axios.post(
      `${baseURL}/users//friend/reject/${requestId}`,
      null,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error declining friend request"
    );
  }
};
// Function to follow a user
const followUser = async (userId) => {
  try {
    const response = await axios.post(
      `${baseURL}/users/follow/${userId}`,
      null,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error following user");
  }
};
// Function to unfollow a user
const unfollowUser = async (userId) => {
  try {
    const response = await axios.post(`${baseURL}/users/unfollow/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error unfollowing user");
  }
};
// Function to get the user's friend requests
const getFriendRequests = async () => {
  try {
    const response = await axios.get(`${baseURL}/users/friend-requests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching friend requests"
    );
  }
};
// Function to unfriend a user
const unfriendUser = async (userId) => {
  try {
    const response = await axios.post(`${baseURL}/users/unfriend/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error unfriending user");
  }
};
// Function to get the user's friends
const getFriends = async () => {
  try {
    const response = await axios.get(`${baseURL}/users/friends`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching friends");
  }
};
// Function to create a new gaming session
const createGamingSession = async (sessionData) => {
  try {
    const response = await axios.post(
      `${baseURL}/gamingSessions/sessions`,
      sessionData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to fetch all gaming sessions
const getAllGamingSessions = async () => {
  try {
    const response = await axios.get(`${baseURL}/gamingSessions/sessions`);
    const gamingSessions = response.data;

    // Fetch user data and create a map of userId to username
    const usersResponse = await axios.get(`${baseURL}/users`);
    const users = usersResponse.data;
    const userIdToUsernameMap = users.reduce((map, user) => {
      map[user._id] = user.username;
      return map;
    }, {});

    // Populate joinedPlayers field with both usernames and user IDs
    const gamingSessionsWithUserData = gamingSessions.map((session) => ({
      ...session,
      joinedPlayersData: session.joinedPlayers.map((userId) => ({
        userId,
        username: userIdToUsernameMap[userId],
      })),
    }));

    return gamingSessionsWithUserData;
  } catch (error) {
    throw error;
  }
};
// Function to join a gaming session
const joinGamingSession = async (sessionId) => {
  try {
    const response = await axios.post(
      `${baseURL}/gamingSessions/sessions/${sessionId}/join`,
      null,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Accept RSVP to a gaming session
const acceptRSVP = async (sessionId, data) => {
  try {
    const response = await axios.post(
      `${baseURL}/gamingSessions/sessions/${sessionId}/accept`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Decline RSVP to a gaming session
const declineRSVP = async (sessionId, data) => {
  try {
    const response = await axios.post(
      `${baseURL}/gamingSessions/sessions/${sessionId}/decline`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Edit gaming session details
const editGamingSession = async (sessionId, editedSession) => {
  try {
    const response = await axios.patch(
      `${baseURL}/gamingSessions/sessions/${sessionId}`,
      editedSession
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to get hosted gaming sessions for the current user
const getHostedGamingSessions = async (currentUserId) => {
  try {
    const response = await axios.get(
      `${baseURL}/gamingSessions/hosted-sessions`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching hosted gaming sessions"
    );
  }
};
// Function to delete a gaming session
const deleteGamingSession = async (sessionId) => {
  try {
    const response = await axios.delete(
      `${baseURL}/gamingSessions/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to send an invitation to a user for a gaming session
const sendInvitation = async (sessionId, userId) => {
  try {
    const response = await axios.post(
      `${baseURL}/gamingSessions/sessions/${sessionId}/invite`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to fetch invitations for the current user
const getInvitations = async () => {
  try {
    const response = await axios.get(`${baseURL}/gamingSessions/invitations`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to upload avatar
const uploadAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await axios.post(
      `${baseURL}/auth/upload-avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export {
  setAuthToken,
  getAllUsers,
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
  deleteChatMessage,
  sendFriendRequest,
  acceptFriendRequest,
  getOtherUserProfile,
  followUser,
  unfollowUser,
  getFriendRequests,
  declineFriendRequest,
  unfriendUser,
  getFriends,
  createGamingSession,
  getAllGamingSessions,
  joinGamingSession,
  getHostedGamingSessions,
  acceptRSVP,
  declineRSVP,
  editGamingSession,
  deleteGamingSession,
  sendInvitation,
  getInvitations,
  uploadAvatar,
};
