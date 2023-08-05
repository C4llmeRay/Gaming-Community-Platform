import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import InvitePlayers from "./InvitePlayers";
import {
  getHostedGamingSessions,
  editGamingSession,
  deleteGamingSession,
} from "../api";
import '../styles/ManageSessions.css'

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
    <div className="manage-sessions-container">
      <h2 className="manage-sessions-heading">Hosted Sessions</h2>
      {hostedGamingSessions.length === 0 ? (
        <p className="no-sessions-message">
          You have no hosted gaming sessions.
        </p>
      ) : (
        <ul className="session-list">
          {hostedGamingSessions.map((session) => (
            <li key={session._id} className="session-item">
              <p className="session-detail">Host: {session.host.username}</p>
              <p className="session-detail">Game: {session.game}</p>
              <p className="session-detail">Date: {formatDate(session.date)}</p>
              <p className="session-detail">Time: {formatTime(session.time)}</p>
              <p className="session-detail">
                Required Players: {session.requiredPlayers}
              </p>
              {session.rsvpedPlayers.includes(currentUserId) && (
                <p className="session-detail">
                  RSVPed -{" "}
                  {session.joinedPlayers.includes(currentUserId)
                    ? "Attending"
                    : "Not Attending"}
                </p>
              )}
              {!editingSession ? (
                <>
                  <button
                    className="session-actions edit-button"
                    onClick={() => handleEditSession(session._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="session-actions delete-button"
                    onClick={() => handleDeleteSession(session._id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                editingSession._id === session._id && (
                  <div className="edit-session-form">
                    <h3>Edit Session</h3>
                    <form>
                      <div className="form-group">
                        <label htmlFor="game">Game:</label>
                        <input
                          type="text"
                          id="game"
                          name="game"
                          value={editingSession.game}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              game: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={editingSession.date}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              date: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="time">Time:</label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={editingSession.time}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              time: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="requiredPlayers">
                          Required Players:
                        </label>
                        <input
                          type="number"
                          id="requiredPlayers"
                          name="requiredPlayers"
                          value={editingSession.requiredPlayers}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              requiredPlayers: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <button
                        className="save-button"
                        type="button"
                        onClick={handleSaveSession}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-button"
                        type="button"
                        onClick={handleCancelEdit}
                      >
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
