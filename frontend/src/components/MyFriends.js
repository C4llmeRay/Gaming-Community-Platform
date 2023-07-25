import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { getUserProfile, unfriendUser } from '../api';

const MyFriends = () => {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Declare currentUserId state

  useEffect(() => {
    // Decode the JWT token to get the current user ID
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentUserId = decodedToken.userId;
      console.log('Current User ID:', currentUserId);
      setCurrentUserId(currentUserId); // Set the currentUserId state
    }
  }, []); // Empty dependency array, runs only once on mount

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const response = await getUserProfile();
        setCurrentUserProfile(response);
      } catch (error) {
        console.error('Error fetching current user profile:', error);
      }
    };

    if (currentUserId) {
      // Only call fetchCurrentUserProfile if currentUserId is available
      fetchCurrentUserProfile();
    }
  }, [currentUserId]);

  const handleUnfriend = async (friendId) => {
  const confirmation = window.confirm('Are you sure you want to unfriend this user?');
  if (confirmation) {
    try {
      await unfriendUser(friendId);
      // Remove the unfriended friend from the local state
      setCurrentUserProfile((prevProfile) => ({
        ...prevProfile,
        friends: prevProfile.friends.filter((friend) => friend.userId !== friendId),
      }));
    } catch (error) {
      console.error('Error unfriending user:', error);
    }
  }
};

  if (!currentUserProfile) {
    return <div>Loading...</div>;
  }

  console.log('Current User ID:', currentUserProfile._id); // Log the current user ID
  console.log('Current User Friends:', currentUserProfile.friends); // Log the current user's friends array

  return (
    <div>
      <h2>My Friends</h2>
      {currentUserProfile.friends.length === 0 ? (
        <p>You have no friends yet.</p>
      ) : (
        <ul>
          {currentUserProfile.friends.map((friend) => (
            <li key={friend.userId}>
              <Link to={`/profile/${friend.userId}`}>{friend.username}</Link>
              <button onClick={() => handleUnfriend(friend.userId)}>Unfriend</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyFriends;
