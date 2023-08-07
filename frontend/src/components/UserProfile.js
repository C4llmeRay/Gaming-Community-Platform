import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { getOtherUserProfile, sendFriendRequest, followUser, unfollowUser, unfriendUser  } from '../api';
import DirectMessages from "./DirectMessages";
import '../styles/UserProfile.css'

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showDirectMessages, setShowDirectMessages] = useState(false);

  useEffect(() => {
    // Decode the JWT token to get the current user ID
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentUserId = decodedToken.userId;
      console.log("Current User ID:", currentUserId);
      setCurrentUserId(currentUserId); // Set the currentUserId state
    }
  }, []); // Empty dependency array, runs only once on mount

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getOtherUserProfile(userId);
        setUserProfile(response);
        setIsCurrentUserFollowing(response.followers.includes(currentUserId));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (currentUserId) {
      // Only call fetchUserProfile if currentUserId is available
      fetchUserProfile();
    }
  }, [currentUserId, userId]);

  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(userId);
      // Handle success or update state if needed
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleFollowUser = async () => {
    try {
      await followUser(userId);
      setIsCurrentUserFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollowUser = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to unfollow this user?"
    );
    if (confirmation) {
      try {
        await unfollowUser(userId);
        setIsCurrentUserFollowing(false);
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    }
  };

  const handleUnfriendUser = async (userId) => {
    const confirmation = window.confirm(
      "Are you sure you want to unfriend this user?"
    );
    if (confirmation) {
      try {
        await unfriendUser(userId);
        // Handle success or update state if needed
      } catch (error) {
        console.error("Error unfriending user:", error);
      }
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  // Check if the current user is a friend of the target user
  const isCurrentUserFriend = userProfile.friends.some(
    (friend) => friend.userId === currentUserId
  );
  console.log(userId);

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      {userProfile && (
        <div className="user-info">
          <p>Username: {userProfile.username}</p>
          <p>Gaming Preferences: {userProfile.gamingPreferences.join(", ")}</p>
          <p>Number of Friends: {userProfile.friends.length}</p>
          <p>Number of Followers: {userProfile.followers.length}</p>
          {userProfile.avatar && (
            <img
              className="avatar"
              src={userProfile.avatar}
              alt="User Avatar"
            />
          )}
        </div>
      )}
      {isCurrentUserFollowing ? (
        <button className="unfollow-button" onClick={handleUnfollowUser}>
          Unfollow
        </button>
      ) : (
        <button className="follow-button" onClick={handleFollowUser}>
          Follow
        </button>
      )}
      {isCurrentUserFriend ? (
        <button
          className="unfriendd-button"
          onClick={() => handleUnfriendUser(userId)}
        >
          Unfriend
        </button>
      ) : (
        <>
          {userProfile._id !== currentUserId && (
            <button
              className="send-friend-request-button"
              onClick={handleSendFriendRequest}
            >
              Send Friend Request
            </button>
          )}
        </>
      )}
      <button
        className="send-message-button"
        onClick={() => setShowDirectMessages(true)}
      >
        Send Message
      </button>
      {/* Show DirectMessages component if showDirectMessages is true */}
      {showDirectMessages && <DirectMessages userId={userId} />}
    </div>
  );
};


export default UserProfile;