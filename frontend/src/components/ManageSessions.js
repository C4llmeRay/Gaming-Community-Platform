import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import {
  getHostedGamingSessions,
  acceptRSVP,
  declineRSVP,
  editGamingSession,
} from "../api";

const ManageSessions = () => {
  const [hostedGamingSessions, setHostedGamingSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [rsvpedPlayers, setRsvpedPlayers] = useState([]);

  useEffect(() => {
    // Decode the JWT token to get the current user ID
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentUserId = decodedToken.userId;
      console.log("Current User ID:", currentUserId);
      // Fetch hosted sessions for the current user
      fetchHostedSessionsData(currentUserId);
    }
  }, []);

  const fetchHostedSessionsData = async (currentUserId) => {
    try {
      const response = await getHostedGamingSessions(currentUserId);
      setHostedGamingSessions(response);
    } catch (error) {
      console.error("Error fetching hosted gaming sessions:", error);
    }
  };

  const handleAcceptRSVP = async (sessionId) => {
    try {
      // Get the userId of the current user from the decoded JWT token
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No JWT token found");
        return;
      }
      const decodedToken = jwt_decode(token);
      const currentUserId = decodedToken.userId;

      // Check if the user's ID exists in the rsvpedPlayers array
      const session = hostedGamingSessions.find(
        (session) => session._id === sessionId
      );
      if (!session.rsvpedPlayers.includes(currentUserId)) {
        console.error("User has not RSVPed to this session");
        return;
      }

      await acceptRSVP(sessionId, { userId: currentUserId }); // Pass the currentUserId in the request body
      // Update the list of rsvpedPlayers in state after accepting the RSVP
      setRsvpedPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player !== currentUserId)
      );
    } catch (error) {
      console.error("Error accepting RSVP:", error);
    }
  };

  const handleDeclineRSVP = async (sessionId, userId) => {
    try {
      await declineRSVP(sessionId, userId);
      // Update the list of rsvpedPlayers in state after declining the RSVP
      setRsvpedPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player !== userId)
      );
    } catch (error) {
      console.error("Error declining RSVP:", error);
    }
  };

  const handleEditSession = async (sessionId) => {
    try {
    } catch (error) {
      console.error("Error editing session:", error);
    }
  };

  return (
    <div>
      <h2>Hosted Sessions</h2>
      {hostedGamingSessions.length === 0 ? (
        <p>You have no hosted gaming sessions.</p>
      ) : (
        <ul>
          {hostedGamingSessions.map((session) => (
            <li key={session._id}>
              <p>Host: {session.host.username}</p>
              <p>Game: {session.game}</p>
              <p>Date: {session.date}</p>
              <p>Time: {session.time}</p>
              <p>Required Players: {session.requiredPlayers}</p>
              <p>Rsvped Players:</p>
              <ul>
                {session.rsvpedPlayers.map((playerId) => (
                  <li key={playerId}>
                    {playerId}
                    <button
                      onClick={() => handleAcceptRSVP(session._id, playerId)}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineRSVP(session._id, playerId)}
                    >
                      Decline
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleEditSession(session._id)}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageSessions;
