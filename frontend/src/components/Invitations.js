import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { getInvitations, acceptRSVP, declineRSVP } from "../api";

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
    <div>
      <h2>Invitations</h2>
      {invitations.length === 0 ? (
        <p>No invitations to display.</p>
      ) : (
        <ul>
          {invitations.map((session) => (
            <li key={session._id}>
              <p>Game: {session.game}</p>
              <p>Date: {new Date(session.date).toLocaleDateString()}</p>
              <p>Time: {session.time}</p>
              {/* Make the host's username clickable and navigate to the host's profile */}
              <p>
                Host:{" "}
                <Link to={`/profile/${session.host._id}`}>
                  {session.host.username}
                </Link>
              </p>
              <button onClick={() => handleAcceptInvitation(session._id)}>
                Accept
              </button>
              <button onClick={() => handleDeclineInvitation(session._id)}>
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
