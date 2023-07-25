import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { getOtherUserProfile, sendFriendRequest, followUser, unfollowUser, unfriendUser  } from '../api';

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(false);
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
    const fetchUserProfile = async () => {
      try {
        const response = await getOtherUserProfile(userId);
        setUserProfile(response);;
        setIsCurrentUserFollowing(response.followers.includes(currentUserId));
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
      console.error('Error sending friend request:', error);
    }
  };

  const handleFollowUser = async () => {
    try {
      await followUser(userId);
      setIsCurrentUserFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollowUser = async () => {
    const confirmation = window.confirm('Are you sure you want to unfollow this user?');
    if (confirmation) {
    try {
      await unfollowUser(userId);
      setIsCurrentUserFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  }
  };

    const handleUnfriendUser = async (userId) => {
  const confirmation = window.confirm('Are you sure you want to unfriend this user?');
  if (confirmation) {
    try {
      await unfriendUser(userId);
      // Handle success or update state if needed
    } catch (error) {
      console.error('Error unfriending user:', error);
    }
  }
};



  if (!userProfile) {
    return <div>Loading...</div>;
  }

  console.log('Current User ID:', userProfile.currentUserId); // Log the current user ID
  console.log('Target User Followers:', userProfile.followers); // Log the target user's followers array

  return (
    <div>
    <h2>User Profile</h2>
    <p>Username: {userProfile.username}</p>
    <p>Gaming Preferences: {userProfile.gamingPreferences.join(', ')}</p>
    <p>Number of Friends: {userProfile.friends.length}</p>
    <p>Number of Followers: {userProfile.followers.length}</p>
    {isCurrentUserFollowing ? (
          <button onClick={handleUnfollowUser}>Unfollow</button>
        ) : (
          <button onClick={handleFollowUser}>Follow</button>
        )}
    {userProfile.friends.includes(currentUserId) ? (
        <button onClick={() => handleUnfriendUser(userId)}>Unfriend</button>
      
    ) : (
      <>
        {userProfile._id !== currentUserId && (
          // Render the "Send Friend Request" button only if the user is not viewing their own profile
          <button onClick={handleSendFriendRequest}>Send Friend Request</button>
        )}
        
      </>
    )}
  </div>
);
};
export default UserProfile;


