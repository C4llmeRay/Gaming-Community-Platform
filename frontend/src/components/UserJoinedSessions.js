import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJoinedGamingSessions, getOtherUserProfile, leaveGamingSession } from "../api";
import "../styles/UserJoinedSessions.css";


const UserJoinedSessions = () => {
  const [joinedSessions, setJoinedSessions] = useState([]);

  const fetchJoinedSessions = async () => {
    try {
      const sessions = await getJoinedGamingSessions();
      console.log("Sessions from the backend:", sessions);

      // Fetch the host's username for each gaming session
      const sessionsWithHostnames = await Promise.all(
        sessions.map(async (session) => {
          try {
            const hostProfile = await getOtherUserProfile(session.host._id);
            const joinedPlayersData = await Promise.all(
              session.joinedPlayers.map(async (player) => {
                try {
                  const playerProfile = await getOtherUserProfile(player._id);
                  return {
                    ...player,
                    username: playerProfile.username,
                  };
                } catch (error) {
                  console.error("Error fetching joined player profile:", error);
                  return player;
                }
              })
            );
            return {
              ...session,
              host: { _id: session.host._id, username: hostProfile.username },
              joinedPlayersData,
            };
          } catch (error) {
            console.error("Error fetching host profile:", error);
            return session;
          }
        })
      );

      setJoinedSessions(sessionsWithHostnames);
    } catch (error) {
      console.error("Error fetching joined gaming sessions:", error);
    }
  };

  const handleLeaveSession = async (sessionId) => {
    try {
      await leaveGamingSession(sessionId);
      // Fetch updated gaming sessions after leaving
      fetchJoinedSessions();
    } catch (error) {
      console.error("Error leaving gaming session:", error);
    }
  };

  useEffect(() => {
    fetchJoinedSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="user-joined-sessions-container">
      <h2 className="user-joined-sessions-heading">Joined Gaming Sessions</h2>
      {joinedSessions.length === 0 ? (
        <p className="no-sessions-message">No gaming sessions joined yet.</p>
      ) : (
        <ul className="session-list">
          {joinedSessions.map((session) => (
            <li key={session._id} className="session-item">
              <p className="session-name">{session.name}</p>
              <p className="hosted-by">
                Hosted by:{" "}
                <Link
                  to={`/profile/${session.host._id}`}
                  className="host-username"
                >
                  {session.host.username}
                </Link>
              </p>
              <p className="session-detail">Game: {session.game}</p>
              <p className="session-detail">
                Date: {new Date(session.date).toLocaleDateString()}
              </p>
              <p className="session-detail">Time: {session.time}</p>
              <p className="session-detail">
                Required Players: {session.requiredPlayers}
              </p>
              <p className="joined-players">
                Joined Players:{" "}
                {session.joinedPlayersData.length === 0
                  ? "No players joined yet."
                  : session.joinedPlayersData.map((player) => (
                      <React.Fragment key={player._id}>
                        <Link
                          to={`/profile/${player._id}`}
                          className="joined-player-username"
                        >
                          {player.username}
                        </Link>
                        {", "}
                      </React.Fragment>
                    ))}
              </p>
              <button
                onClick={() => handleLeaveSession(session._id)}
                className="leave-button"
              >
                Leave
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default UserJoinedSessions;
