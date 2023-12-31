import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { getNotifications } from "../api";
import "../styles/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io("ws://localhost:5000");

    socket.on("connect", () => {
      console.log("WebSocket connection established. Socket ID:", socket.id);
    });

    socket.on("follow", (data) => {
      console.log("Received follow event:", data);
      // Handle the 'follow' event and update the notifications state
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    // Add a log for connection errors
    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    // Fetch notifications for the current user and update the state
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    return () => {
      socket.disconnect();
      console.log("Cleaning up WebSocket connection...");
    };
  }, []);

  console.log(
    "Rendering Notifications component with notifications:",
    notifications
  );

  return (
    <div className="notifications-container">
      <h2 className="notifications-heading">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No new notifications.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification._id} className="notification-item">
              {notification.type === "follow" ? (
                <>
                  You have a new follower:{" "}
                  <Link
                    to={`/profile/${notification.data.followerData._id}`}
                    className="notification-link"
                  >
                    {notification.data.followerData.username}
                  </Link>
                </>
              ) : notification.type === "friend_request" ? (
                <>
                  You have a new friend request from:{" "}
                  <Link
                    to={`/profile/${notification.data.senderId}`}
                    className="notification-link"
                  >
                    {notification.data.senderUsername}
                  </Link>
                </>
              ) : notification.type === "friend_request_accepted" ? (
                <>
                  <Link
                    to={`/profile/${notification.data.senderId}`}
                    className="notification-link"
                  >
                    {notification.data.senderUsername}
                  </Link>{" "}
                  accepted your friend request.
                </>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <Link to="/friendRequests" className="view-requests-link">
        View Friend Requests
      </Link>
    </div>
  );
};

export default Notifications;
