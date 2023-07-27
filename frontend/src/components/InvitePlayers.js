import React, { useState, useEffect } from "react";
import { getAllUsers, sendInvitation } from "../api"; 

const InvitePlayers = ({ sessionId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(); 
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInvite = async () => {
    try {
      // Send the invitation to the selected user
      await sendInvitation(sessionId, selectedUser); // Implement the sendInvitation API function
      alert(`Invitation sent to user with ID ${selectedUser}`);
      // Optionally, can update the list of invited users on the UI
      // by filtering the users array to remove the selected user
      // setUsers(users.filter((user) => user._id !== selectedUser));
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };

  return (
    <div>
      <h3>Invite Players</h3>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select a user to invite</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username}
          </option>
        ))}
      </select>
      <button onClick={handleInvite} disabled={!selectedUser}>
        Invite
      </button>
    </div>
  );
};

export default InvitePlayers;
