import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import InvitePlayers from "./InvitePlayers";
import {
  getHostedGamingSessions,
  editGamingSession,
  deleteGamingSession,
} from "../api";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (timeString) => {
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
    undefined,
    options
  );
};

const ManageSessions = () => {
  const [hostedGamingSessions, setHostedGamingSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // State to store the current user ID

  useEffect(() => {
    // Decode the JWT token to get the current user ID
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      console.log("Current User ID:", userId);
      setCurrentUserId(userId); // Set the currentUserId state
      // Fetch hosted sessions for the current user
      fetchHostedSessionsData(userId);
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

  const handleEditSession = async (sessionId) => {
    try {
      const sessionToEdit = hostedGamingSessions.find(
        (session) => session._id === sessionId
      );
      if (!sessionToEdit) {
        console.error("Session not found");
        return;
      }
      setEditingSession(sessionToEdit);
    } catch (error) {
      console.error("Error editing session:", error);
    }
  };

  const handleSaveSession = async () => {
    try {
      if (!editingSession) {
        console.error("No session to save");
        return;
      }
      await editGamingSession(editingSession._id, editingSession);
      setEditingSession(null);
      fetchHostedSessionsData(editingSession.host._id);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      // Show a confirmation alert before deleting the session
      const confirmed = window.confirm(
        "Are you sure you want to delete this session?"
      );
      if (confirmed) {
        await deleteGamingSession(sessionId);
        fetchHostedSessionsData(hostedGamingSessions.host._id);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
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
              <p>Date: {formatDate(session.date)}</p>
              <p>Time: {formatTime(session.time)}</p>
              <p>Required Players: {session.requiredPlayers}</p>
              {/* Show RSVP status if the user has already RSVPed */}
              {session.rsvpedPlayers.includes(currentUserId) && (
                <p>
                  RSVPed -{" "}
                  {session.joinedPlayers.includes(currentUserId)
                    ? "Attending"
                    : "Not Attending"}
                </p>
              )}
              {/* Show "Edit" and "Delete" buttons when not in edit mode */}
              {!editingSession ? (
                <>
                  <button onClick={() => handleEditSession(session._id)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteSession(session._id)}>
                    Delete
                  </button>
                </>
              ) : (
                // Show session details and "Save" and "Cancel" buttons when in edit mode
                editingSession._id === session._id && (
                  <div>
                    <h3>Edit Session</h3>
                    <form>
                      <div>
                        <label>Game:</label>
                        <input
                          type="text"
                          name="game"
                          value={editingSession.game}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              game: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label>Date:</label>
                        <input
                          type="date"
                          name="date"
                          value={editingSession.date}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label>Time:</label>
                        <input
                          type="time"
                          name="time"
                          value={editingSession.time}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              time: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label>Required Players:</label>
                        <input
                          type="number"
                          name="requiredPlayers"
                          value={editingSession.requiredPlayers}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              requiredPlayers: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button type="button" onClick={handleSaveSession}>
                        Save
                      </button>
                      <button type="button" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </form>
                  </div>
                )
              )}
              <InvitePlayers sessionId={session._id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageSessions;
