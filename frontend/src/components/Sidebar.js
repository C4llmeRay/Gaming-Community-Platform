import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBell, faGamepad } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/searchUsers" className="sidebar-link">
        <FontAwesomeIcon icon={faUserPlus} className="sidebar-icon" />
      </Link>
      <Link to="/notifications" className="sidebar-link">
        <FontAwesomeIcon icon={faBell} className="sidebar-icon" />
      </Link>
      <Link to="/gamingSession" className="sidebar-link">
        <FontAwesomeIcon icon={faGamepad} className="sidebar-icon" />
      </Link>
    </div>
  );
};

export default Sidebar;
