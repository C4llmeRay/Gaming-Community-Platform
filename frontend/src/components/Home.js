import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../images/background.jpg";
import joinGroupImage from "../images/group.jpg";
import createGroupImage from "../images/group2.jpg";
import joinSessionImage from "../images/Session.jpg";
import "../styles/Home.css";

const Home = ({ isLoggedIn }) => {
  return (
    <div className="container">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="contentt">
          <h1>Welcome to Your Gaming Community</h1>
          <p>Connect with gamers, join gaming sessions, and have fun!</p>
        </div>
      </div>

      <div className="section-top">
        <div className="user-buttons">
          <Link
            to={isLoggedIn ? "/profile" : "/register"}
            className="cta-button"
          >
            {isLoggedIn ? "Profile" : "Register"}
          </Link>
        </div>
      </div>

      <div className="sections-container">
        <div className="section">
          <img src={joinGroupImage} alt="Join Group" />
          <h2>Join Gaming Group</h2>
          <p>Discover and join gaming groups to connect with fellow gamers.</p>
          <Link to="/searchGroups" className="cta-button">
            Join Now
          </Link>
        </div>

        <div className="section">
          <img src={createGroupImage} alt="Create Group" />
          <h2>Create Gaming Group</h2>
          <p>Create your own gaming group and invite friends to join.</p>
          <Link to="/create-gaming-group" className="cta-button">
            Create Now
          </Link>
        </div>

        <div className="section">
          <img src={joinSessionImage} alt="Join Session" />
          <h2>Join Gaming Session</h2>
          <p>Participate in exciting gaming sessions with fellow gamers.</p>
          <Link to="/gamingSession" className="cta-button">
            Join Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
