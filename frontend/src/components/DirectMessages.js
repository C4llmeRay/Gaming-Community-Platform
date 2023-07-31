import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import {
  sendDirectMessage,
  getOrCreateConversation,
  deleteChatMessage,
  getConversationMessages,
} from "../api";
import { io } from "socket.io-client";

const DirectMessages = ({ userId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [conversationMessages, setConversationMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    // Decode the JWT token to get the current user ID
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentUserId = decodedToken.userId;
      setCurrentUser({ _id: currentUserId }); // Wrap the ID in an object to match the expected structure in the code
    }
  }, []);

  useEffect(() => {
    // Fetch or create the conversation between the current user and the selected user
    const fetchConversation = async () => {
      try {
        const conversation = await getOrCreateConversation(userId);
        setConversationId(conversation._id);

        // Fetch the complete message objects using their IDs
        const messages = await getConversationMessages(
          conversation.directChatMessages
        );
        setConversationMessages(messages); // Store the fetched messages
      } catch (error) {
        console.error("Error fetching or creating conversation:", error);
      }
    };

    if (currentUser && userId) {
      fetchConversation();
    }
  }, [currentUser, userId]);

  useEffect(() => {
    // Create a new socket.io connection
    if (conversationId) {
      const newSocket = io("http://localhost:5000", {
        query: { conversationId },
      });

      // Set the socket state with the new socket instance
      setSocket(newSocket);

      console.log("Socket connected with conversation ID:", conversationId);

      // Clean up the socket connection on component unmount
      return () => {
        newSocket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [conversationId]);

  useEffect(() => {
    if (socket) {
      // Listen for incoming direct messages
      socket.on("direct_message", (message) => {
        console.log("Received direct message:", message);
        setConversationMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  // Remove the initial message
  useEffect(() => {
    setConversationMessages((prevMessages) =>
      prevMessages.filter(
        (message) => message.text !== "Hello, this is an initial message!"
      )
    );
  }, []);

  const handleSendMessage = async () => {
    const messageObject = {
      text: message,
      receiver: userId,
    };

    console.log("Sending message object:", messageObject);

    try {
      if (conversationId) {
        // Send the direct message to the server, passing the conversation ID as a URL parameter
        await sendDirectMessage(conversationId, messageObject);
      } else {
        // If conversationId is not available, fetch or create the conversation first
        const conversation = await getOrCreateConversation(userId);
        setConversationId(conversation._id); // Update this line

        // Then send the direct message to the server, passing the conversation ID as a URL parameter
        await sendDirectMessage(conversation._id, messageObject); // Update this line
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending direct message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      // Delete the message from the server
      await deleteChatMessage(messageId);

      // Update the state to remove the deleted message from the UI for real-time messages
      setConversationMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    } catch (error) {
      console.error("Error deleting direct message:", error);
    }
  };

  return (
    <div>
      <h2>Direct Messages</h2>
      <p>User ID: {userId}</p>
      <div>
        <h3>Direct Chat Messages:</h3>
        {conversationMessages.length === 0 ? (
          <p>No direct messages</p>
        ) : (
          conversationMessages.map((message, index) => (
            <div key={index}>
              <p>
                {message.sender.username}: {message.text}
                {currentUser && currentUser._id === message.sender._id && (
                  <button onClick={() => handleDeleteMessage(message._id)}>
                    Delete
                  </button>
                )}
              </p>
            </div>
          ))
        )}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send Direct Message</button>
    </div>
  );
};

export default DirectMessages;
