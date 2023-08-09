import React from "react";

const Logout = () => {
  const handleLogout = () => {
    // Clear token from local storage
    localStorage.removeItem("token");

    // Refresh the page to reflect the logout state
    window.location.reload();
  };

  return (
    <div className="logout-button" onClick={handleLogout}>
      <i className="fas fa-sign-out-alt"></i> Logout
    </div>
  );
};

export default Logout;
