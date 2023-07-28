import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJoinedGamingSessions, getUserProfile } from "../api";

const UserJoinedSessions = () => {
  const [joinedSessions, setJoinedSessions] = useState([]);

  useEffect(() => {
    fetchJoinedSessions();
  }, []);

  const fetchJoinedSessions = async () => {
    try {
      const sessions = await getJoinedGamingSessions();

      // Fetch the host's username for each gaming session
      const sessionsWithHostnames = await Promise.all(
        sessions.map(async (session) => {
          try {
            const hostProfile = await getUserProfile(session.host);
            return {
              ...session,
              host: { _id: session.host, username: hostProfile.username },
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

  return (
    <div>
      <h2>Joined Gaming Sessions</h2>
      {joinedSessions.length === 0 ? (
        <p>No gaming sessions joined yet.</p>
      ) : (
        <ul>
          {joinedSessions.map((session) => (
            <li key={session._id}>
              <p>{session.name}</p>
              <p>
                Hosted by:{" "}
                <Link to={`/profile/${session.host._id}`}>
                  {session.host.username}
                </Link>
              </p>
              <p>Game: {session.game}</p>
              <p>Date: {new Date(session.date).toLocaleDateString()}</p>
              <p>Time: {session.time}</p>
              <p>Required Players: {session.requiredPlayers}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserJoinedSessions;
