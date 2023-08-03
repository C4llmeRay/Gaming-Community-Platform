import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "../helpers";
import { getUserProfile } from "../api";
import Logout from "./Logout";
import "../styles/Header.css"


const Header = () => {
  const loggedInUserId = getUserIdFromToken();
  const [loggedInUserProfile, setLoggedInUserProfile] = useState(null);

  useEffect(() => {
    if (loggedInUserId) {
      // Fetch the user profile if a user is logged in
      getUserProfile(loggedInUserId)
        .then((response) => {
          setLoggedInUserProfile(response);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [loggedInUserId]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">GAME Realm</Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/create-gaming-group">Create Group</Link>
          </li>
          <li>
            <Link to="/searchGroups">Search Groups</Link>
          </li>
          <li>
            <span className="dropdown">
              <Link to="/manageSessions">Sessions</Link>
              <div className="dropdown-content">
                <Link to="/manageSessions">Manage Sessions</Link>
                <Link to="/joinedSessions">Joined Sessions</Link>
                <Link to="/invitations">Invitations</Link>
              </div>
            </span>
          </li>
        </ul>
      </nav>
      <div className="user-section">
        {loggedInUserId ? (
          <span className="dropdown">
            <span className="user-infoo">
              {loggedInUserProfile && (
                <>
                  <img src={loggedInUserProfile.avatar} alt="User Avatar" />
                  <Link to="/profile">{loggedInUserProfile.username}</Link>
                </>
              )}
            </span>
            <div className="dropdown-content">
              <Link to="/profile">Profile</Link>
              <Link to="/myFriends">Friends</Link>
              <Link to="/friendRequests">Friend Requests</Link>
              <Logout />
            </div>
          </span>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
