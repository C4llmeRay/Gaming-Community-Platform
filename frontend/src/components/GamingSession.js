import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  getAllGamingSessions,
  createGamingSession,
  joinGamingSession,
} from "../api";
import "../styles/GamingSession.css";


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

const GamingSession = () => {
  const [gamingSessions, setGamingSessions] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newSessionData, setNewSessionData] = useState({
    game: "",
    date: "",
    time: "",
    requiredPlayers: "",
  });

  useEffect(() => {
    // Decode the JWT token to get the current user ID
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentUserId = decodedToken.userId;
      console.log("Current User ID:", currentUserId);
      setCurrentUserId(currentUserId);
    }
  }, []);

  const fetchGamingSessions = async () => {
    try {
      const sessions = await getAllGamingSessions();
      setGamingSessions(sessions);
    } catch (error) {
      console.error("Error fetching gaming sessions:", error);
    }
  };

  useEffect(() => {
    fetchGamingSessions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSessionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await createGamingSession(newSessionData);
      // Reset the form data after successful creation
      setNewSessionData({
        game: "",
        date: "",
        time: "",
        requiredPlayers: "",
      });
      // Fetch updated gaming sessions
      fetchGamingSessions();
    } catch (error) {
      console.error("Error creating gaming session:", error);
    }
  };

  const handleJoinSession = async (sessionId) => {
    try {
      await joinGamingSession(sessionId);
      // Fetch updated gaming sessions
      fetchGamingSessions();
    } catch (error) {
      console.error("Error joining gaming session:", error);
    }
  };

  return (
    <div className="gaming-session-container">
      <h2>Gaming Sessions</h2>
      <ul className="gaming-session-list">
        {gamingSessions.map((session) => (
          <li key={session._id} className="gaming-session-item">
            <p>Game: {session.game}</p>
            <p>Date: {formatDate(session.date)}</p>
            <p>Time: {formatTime(session.time)}</p>
            <p>Required Players: {session.requiredPlayers}</p>
            <p className="joined-players">
              Joined Players:{" "}
              {session.joinedPlayersData.length === 0
                ? "no players joined yet"
                : session.joinedPlayersData.map((player, index) => (
                    <React.Fragment key={player.userId}>
                      {index > 0 && ", "}
                      <Link to={`/profile/${player.userId}`}>
                        {player.username}
                      </Link>
                    </React.Fragment>
                  ))}
            </p>
            {!session.joinedPlayers.includes(currentUserId) && (
              <button
                onClick={() => handleJoinSession(session._id)}
                className="join-button"
              >
                Join
              </button>
            )}
          </li>
        ))}
      </ul>
      <h2>Create New Gaming Session</h2>
      <form onSubmit={handleCreateSession} className="create-session-form">
        <div className="form-group">
          <label>Game:</label>
          <input
            type="text"
            name="game"
            value={newSessionData.game}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={newSessionData.date}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={newSessionData.time}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Required Players:</label>
          <input
            type="number"
            name="requiredPlayers"
            value={newSessionData.requiredPlayers}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="create-session-button">
          Create Session
        </button>
      </form>
    </div>
  );
};

export default GamingSession;
