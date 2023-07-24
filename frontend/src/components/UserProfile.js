import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { getOtherUserProfile, sendFriendRequest, followUser, unfollowUser } from '../api';

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
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
        setUserProfile(response);
        setIsFriend(response.isFriend);
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
    try {
      await unfollowUser(userId);
      setIsCurrentUserFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
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

      {isFriend ? (
        <p>You are friends with this user</p>
      ) : (
        <>
          <button onClick={handleSendFriendRequest}>Send Friend Request</button>
          {isCurrentUserFollowing ? (
            <button onClick={handleUnfollowUser}>Unfollow</button>
          ) : (
            <button onClick={handleFollowUser}>Follow</button>
          )}
        </>
      )}
    </div>
  );
};
export default UserProfile;


