import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getJoinedGamingSessions,
  getOtherUserProfile,
  leaveGamingSession,
} from "../api";
import "../styles/UserJoinedSessions.css";

const UserJoinedSessions = () => {
  const [joinedSessions, setJoinedSessions] = useState([]);

  const fetchJoinedSessions = async () => {
    try {
      const sessions = await getJoinedGamingSessions();
      console.log("Sessions from the backend:", sessions);

      // Fetch the host's username and avatar for each gaming session
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
                    avatar: playerProfile.avatar, 
                  };
                } catch (error) {
                  console.error("Error fetching joined player profile:", error);
                  return player;
                }
              })
            );
            return {
              ...session,
              host: {
                _id: session.host._id,
                username: hostProfile.username,
                avatar: hostProfile.avatar, 
              },
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
      fetchJoinedSessions();
    } catch (error) {
      console.error("Error leaving gaming session:", error);
    }
  };

  useEffect(() => {
    fetchJoinedSessions();
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
             <div className="session-card">
               <p className="session-name">{session.name}</p>
               <div className="host-info">
                 <p className="hosted-by">Hosted By:</p>
                 <Link
                   to={`/profile/${session.host._id}`}
                   className="host-username"
                 >
                   <img
                     src={session.host.avatar}
                     alt={`${session.host.username}'s avatar`}
                     className="avatarr"
                   />
                   <span>{session.host.username}</span>
                 </Link>
               </div>
               <p className="session-detail">Game: {session.game}</p>
               <p className="session-detail">
                 Date: {new Date(session.date).toLocaleDateString()}
               </p>
               <p className="session-detail">Time: {session.time}</p>
               <p className="session-detail">
                 Required Players: {session.requiredPlayers}
               </p>
               <div className="joined-players">
                 <p>Joined Players:</p>
                 <div className="player-list">
                   {session.joinedPlayersData.length === 0 ? (
                     <p>No players joined yet.</p>
                   ) : (
                     session.joinedPlayersData.map((player) => (
                       <Link
                         to={`/profile/${player._id}`}
                         key={player._id}
                         className="joined-player"
                       >
                         <img
                           src={player.avatar}
                           alt={`${player.username}'s avatar`}
                           className="avatar"
                         />
                         <span>{player.username}</span>
                       </Link>
                     ))
                   )}
                 </div>
               </div>
             </div>
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
