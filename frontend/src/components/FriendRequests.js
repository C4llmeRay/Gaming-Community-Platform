import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFriendRequests, declineFriendRequest, acceptFriendRequest } from '../api';

const fetchFriendRequests = async () => {
  try {
    const response = await getFriendRequests();
    return response.friendRequests;
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return [];
  }
};

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const friendRequestsData = await fetchFriendRequests();
      setFriendRequests(friendRequestsData);
    };
    fetchData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
  try {
    await acceptFriendRequest(requestId); // Pass the requestId directly
    const updatedFriendRequests = await fetchFriendRequests();
    setFriendRequests(updatedFriendRequests);
  } catch (error) {
    console.error('Error accepting friend request:', error);
  }
};

  const handleDeclineRequest = async (requestId) => {
    try {
      await declineFriendRequest(requestId);
      // If needed, update the state or handle success
      fetchFriendRequests();
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  if (friendRequests.length === 0) {
    return <div>No friend requests at the moment.</div>;
  }

     return (
     <div>
      <h2>Friend Requests</h2>
      {friendRequests.map((request) => (
        <div key={request._id}>
          {/* Use the Link component to create a clickable link */}
          <p>From: <Link to={`/profile/${request.sender.userId}`}>{request.sender.username}</Link></p>
          <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
          <button onClick={() => handleDeclineRequest(request._id)}>Decline</button>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;


