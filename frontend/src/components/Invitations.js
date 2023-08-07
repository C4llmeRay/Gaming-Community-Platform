import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { getInvitations, acceptRSVP, declineRSVP } from "../api";
import "../styles/Invitations.css";


const Invitations = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    // Fetch the user's invitations on component mount
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const userInvitations = await getInvitations();
      setInvitations(userInvitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const handleAcceptInvitation = async (sessionId) => {
    try {
      await acceptRSVP(sessionId, {});
      alert("Invitation accepted successfully");
      fetchInvitations();
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleDeclineInvitation = async (sessionId) => {
    try {
      await declineRSVP(sessionId, {});
      alert("Invitation declined successfully");
      fetchInvitations();
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  return (
    <div className="invitations-container">
      <h2 className="invitations-heading">Invitations</h2>
      {invitations.length === 0 ? (
        <p className="no-invitations-message">No invitations to display.</p>
      ) : (
        <ul className="invitations-list">
          {invitations.map((session) => (
            <li key={session._id} className="invitation-item">
              <p className="session-detail">Game: {session.game}</p>
              <p className="session-detail">
                Date: {new Date(session.date).toLocaleDateString()}
              </p>
              <p className="session-detail">Time: {session.time}</p>
              <p className="session-detail">
                Host:{" "}
                <Link to={`/profile/${session.host._id}`} className="host-link">
                  {session.host.username}
                </Link>
              </p>
              <button
                className="accept-button"
                onClick={() => handleAcceptInvitation(session._id)}
              >
                Accept
              </button>
              <button
                className="decline-button"
                onClick={() => handleDeclineInvitation(session._id)}
              >
                Decline
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default Invitations;
