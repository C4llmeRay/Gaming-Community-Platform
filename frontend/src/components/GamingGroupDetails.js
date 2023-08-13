import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getGroupDetails,
  getUserProfile,
  leaveGroup,
  kickMember,
  promoteMember,
  demoteMember,
  transferOwnership,
  joinGroup,
  sendChatMessage,
  deleteChatMessage,
} from "../api";
import { io } from "socket.io-client";
import "../styles/GamingGroupDetails.css";

const GamingGroupDetails = () => {
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const userProfile = await getUserProfile();
        setCurrentUser(userProfile);

        const response = await getGroupDetails(groupId, userProfile.token);
        setGroupDetails(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000/chat", {
      query: { groupId },
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [groupId]);

  const handleSendMessage = async () => {
    const messageObject = {
      text: message,
      groupId: groupDetails._id,
      sender: currentUser,
    };

    try {
      await sendChatMessage(messageObject);
      setMessage("");
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  // Function to format the timestamp to a human-readable format
  const formatTimestamp = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  };

  // UseEffect to listen for incoming messages and fetch usernames
  useEffect(() => {
    if (socket) {
      socket.on("message", async (message) => {
        console.log("Received message:", message);

        // Fetch the username for the new message sender
        const userProfile = await getUserProfile(message.sender);
        const newUsername = userProfile.username;

        // Update the chatMessages state with the new message and the sender's username
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { ...message, sender: { ...message.sender, username: newUsername } },
        ]);
      });
    }
  }, [socket]);

  const handleKickMember = async (memberId) => {
    try {
      console.log("Kicking member:", memberId);
      await kickMember(groupId, memberId);
      const updatedGroupDetails = await getGroupDetails(groupId);
      console.log("Updated group details after kick:", updatedGroupDetails);
      setGroupDetails(updatedGroupDetails);
    } catch (error) {
      console.error("Error kicking member:", error);
    }
  };

  const handlePromoteMember = async (memberId) => {
    try {
      console.log("Promoting member:", memberId);
      await promoteMember(groupId, memberId);
      const updatedGroupDetails = await getGroupDetails(groupId);
      console.log("Updated group details after promote:", updatedGroupDetails);
      setGroupDetails(updatedGroupDetails);
    } catch (error) {
      console.error("Error promoting member:", error);
    }
  };

  const handleDemoteMember = async (memberId) => {
    try {
      await demoteMember(groupId, memberId);
      const updatedGroupDetails = await getGroupDetails(groupId);
      setGroupDetails(updatedGroupDetails);
    } catch (error) {
      console.error("Error demoting member:", error);
    }
  };

  const handleTransferOwnership = async () => {
    try {
      await transferOwnership(groupId, currentUser._id);
      const updatedGroupDetails = await getGroupDetails(groupId);
      setGroupDetails(updatedGroupDetails);
    } catch (error) {
      console.error("Error transferring ownership:", error);
    }
  };

  const handleJoinOrLeaveGroup = async () => {
  try {
    if (isMember) {
      await leaveGroup(groupId);
    } else {
      await joinGroup(groupId);
    }

    const updatedGroupDetails = await getGroupDetails(groupId);
    setGroupDetails(updatedGroupDetails);
  } catch (error) {
    console.error("Error joining or leaving group:", error);
  }
};

  const handleDeleteMessage = async (messageId) => {
    try {
      // Delete the message from the server
      await deleteChatMessage(messageId);

      // Update the state to remove the deleted message from the UI for real-time messages
      setChatMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );

      // Update the state of groupDetails to remove the deleted message from historical messages
      setGroupDetails((prevDetails) => ({
        ...prevDetails,
        chatMessages: prevDetails.chatMessages.filter(
          (message) => message._id !== messageId
        ),
      }));
    } catch (error) {
      console.error("Error deleting chat message:", error);
    }
  };

  if (!groupDetails) {
    return <div>Loading...</div>;
  }

  const isMember =
    currentUser &&
    groupDetails.members.some((member) => member._id === currentUser._id);
  const allMessages = [...groupDetails.chatMessages, ...chatMessages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="gaming-group-details-container">
      <h2 className="gaming-group-details-title">Gaming Group Details</h2>
      <div className="group-info">
        <p className="group-info-item">Name: {groupDetails.name}</p>
        <p className="group-info-item">
          Description: {groupDetails.description}
        </p>
        <p className="group-info-item">Rules: {groupDetails.rules}</p>
        <p className="group-info-item">Privacy: {groupDetails.privacy}</p>
        <p className="group-info-item">Members:</p>
        <ul className="member-list">
          {groupDetails.members.map((member) => (
            <li key={member._id} className="list-group-item">
              <div className="member-info">
                <img
                  src={member.avatar}
                  alt={`${member.username}'s avatar`}
                  className="member-avatar"
                />
                <Link to={`/profile/${member._id}`} className="member-link">
                  {member.username}
                </Link>
              </div>
              (Member)
              {groupDetails.owner === member._id && " - Owner"}
              {member.isModerator && " - Moderator"}
            </li>
          ))}
        </ul>
        <button className="join-leave-button" onClick={handleJoinOrLeaveGroup}>
          {isMember ? "Leave Group" : "Join Group"}
        </button>
      </div>
      {groupDetails.owner === currentUser._id && (
        <div className="ownership-transfer">
          <button className="transfer-button" onClick={handleTransferOwnership}>
            Transfer Ownership
          </button>
        </div>
      )}
      <ul className="member-list mt-4">
        {groupDetails.members.map((member) => (
          <li key={member._id} className="list-group-item">
            <div className="member-info">
              <img
                src={member.avatar}
                alt={`${member.username}'s avatar`}
                className="member-avatar"
              />
              <Link to={`/profile/${member._id}`}>{member.username}</Link>
            </div>
            <div className="member-actions">
              {groupDetails.owner === currentUser._id && (
                <>
                  <button
                    className="button kick-button"
                    onClick={() => handleKickMember(member._id)}
                  >
                    Kick
                  </button>
                  {!member.isModerator && (
                    <button
                      className="button promote-button"
                      onClick={() => handlePromoteMember(member._id)}
                    >
                      Promote
                    </button>
                  )}
                  {member.isModerator && (
                    <button
                      className="button demote-button"
                      onClick={() => handleDemoteMember(member._id)}
                    >
                      Demote
                    </button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {/* Display chat messages */}
      <div className="chat-container bg-white p-4 rounded shadow mt-4">
        <h3 className="chat-heading text-xl mb-4">Chat Messages:</h3>
        {allMessages.length === 0 ? (
          <p className="no-messages">No messages</p>
        ) : (
          <ul className="message-list">
            {allMessages.map((message, index) => (
              <li key={index} className="message-item">
                <p className="message-content">
                  <span className="message-sender">
                    {message.sender?.username || "Unknown"}:
                  </span>
                  {message.text}
                  <br />
                  <small className="message-timestamp">
                    {formatTimestamp(message.createdAt)}
                  </small>
                  {currentUser && currentUser._id === message.sender?._id && (
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      Delete
                    </button>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        className="input-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="send-message-button" onClick={handleSendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default GamingGroupDetails;
