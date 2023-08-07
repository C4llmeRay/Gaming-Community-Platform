import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGamingGroup } from "../api";
import "../styles/CreateGamingGroup.css";

const CreateGamingGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rules: "",
    privacy: "public", // Privacy is set to 'public'
    game: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCreateGroup = async () => {
    try {
      const createdGroup = await createGamingGroup(formData);
      const groupId = createdGroup._id; // Assuming the group ID is stored in the _id field

      // After successfully creating the group, navigate to the group's details page with the correct groupId
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error("Error creating gaming group:", error);
    }
  };

  return (
    <div className="create-group-container">
      <h2 className="create-group-heading">Create a Gaming Group</h2>
      <label htmlFor="name" className="create-group-label">
        Name:
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="create-group-input"
      />
      <br />
      <label htmlFor="description" className="create-group-label">
        Description:
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        className="create-group-textarea"
      />
      <br />
      <label htmlFor="rules" className="create-group-label">
        Rules:
      </label>
      <textarea
        id="rules"
        name="rules"
        value={formData.rules}
        onChange={handleInputChange}
        className="create-group-textarea"
      />
      <br />
      <label htmlFor="privacy" className="create-group-label">
        Privacy:
      </label>
      <select
        id="privacy"
        name="privacy"
        value={formData.privacy}
        onChange={handleInputChange}
        className="create-group-select"
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="invite-only">Invite Only</option>
      </select>
      <br />
      <label htmlFor="game" className="create-group-label">
        Game:
      </label>
      <input
        type="text"
        id="game"
        name="game"
        value={formData.game}
        onChange={handleInputChange}
        className="create-group-input"
      />
      <br />
      <button onClick={handleCreateGroup} className="create-group-button">
        Create Group
      </button>
    </div>
  );
};

export default CreateGamingGroup;
