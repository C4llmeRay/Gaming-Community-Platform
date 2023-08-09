import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getFriendRequests,
  declineFriendRequest,
  acceptFriendRequest,
} from "../api";
import "../styles/FriendRequests.css";

const fetchFriendRequests = async () => {
  try {
    const response = await getFriendRequests();
    return response.friendRequests;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
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
      await acceptFriendRequest(requestId);
      const updatedFriendRequests = await fetchFriendRequests();
      setFriendRequests(updatedFriendRequests);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await declineFriendRequest(requestId);
      const updatedFriendRequests = await fetchFriendRequests();
      setFriendRequests(updatedFriendRequests);
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  if (friendRequests.length === 0) {
    return <div className="no-requests">No friend requests at the moment.</div>;
  }

  return (
    <div className="friend-requests-container">
      <h2 className="friend-requests-heading">Friend Requests</h2>
      {friendRequests.map((request) => (
        <div key={request._id} className="friend-request">
          <div className="sender-avatar">
            <Link
              to={`/profile/${request.sender.userId}`}
              className="sender-link"
            >
              <img
                src={request.sender.avatar}
                alt={`${request.sender.username}'s avatar`}
                className="friend-requests-avatar"
              />
            </Link>
          </div>
          <div className="request-details">
            <p className="request-sender">
              From:{" "}
              <Link
                to={`/profile/${request.sender.userId}`}
                className="sender-link"
              >
                {request.sender.username}
              </Link>
            </p>
            <div className="request-buttons">
              <button
                className="accept-button"
                onClick={() => handleAcceptRequest(request._id)}
              >
                Accept
              </button>
              <button
                className="decline-button"
                onClick={() => handleDeclineRequest(request._id)}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
