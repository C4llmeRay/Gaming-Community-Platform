import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { getUserProfile, unfriendUser } from "../api";
import "../styles/MyFriends.css";

const MyFriends = () => {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentUserId = decodedToken.userId;
      setCurrentUserId(currentUserId);
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const response = await getUserProfile();
        setCurrentUserProfile(response);
      } catch (error) {
        console.error("Error fetching current user profile:", error);
      }
    };

    if (currentUserId) {
      // Only call fetchCurrentUserProfile if currentUserId is available
      fetchCurrentUserProfile();
    }
  }, [currentUserId]);

  const handleUnfriend = async (friendId) => {
    const confirmation = window.confirm(
      "Are you sure you want to unfriend this user?"
    );
    if (confirmation) {
      try {
        await unfriendUser(friendId);
        // Remove the unfriended friend from the local state
        setCurrentUserProfile((prevProfile) => ({
          ...prevProfile,
          friends: prevProfile.friends.filter(
            (friend) => friend.userId !== friendId
          ),
        }));
      } catch (error) {
        console.error("Error unfriending user:", error);
      }
    }
  };

  if (!currentUserProfile) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="my-friends-component">
      <h2 className="my-friends-title">My Friends</h2>
      {currentUserProfile.friends.length === 0 ? (
        <p className="no-friends-message">You have no friends yet.</p>
      ) : (
        <ul className="friends-list">
          {currentUserProfile.friends.map((friend) => (
            <li key={friend.userId} className="friend-item">
              <Link to={`/profile/${friend.userId}`} className="friend-link">
                <img
                  src={friend.avatar}
                  alt={`${friend.username}'s avatar`}
                  className="friend-avatar"
                />
                <span className="friend-username">{friend.username}</span>
              </Link>
              <button
                onClick={() => handleUnfriend(friend.userId)}
                className="unfriend-button"
              >
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyFriends;
