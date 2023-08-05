import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { completeSecondPhase } from "../api";
import "../styles/SecondPhase.css";

const predefinedGames = [
  "Fortnite",
  "Minecraft",
  "Apex Legends",
  "League of Legends",
  "Counter-Strike: Global Offensive",
];

const predefinedAvatars = [
  "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const SecondPhase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state ?? {};

  const [formData, setFormData] = useState({
    gamingPreferences: "",
    avatar: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCompleteButtonClick = async () => {
    try {
      const { gamingPreferences, avatar } = formData;

      if (!gamingPreferences && !avatar) {
        alert('Please select at least one option or click "Skip"');
        return;
      }

      const response = await completeSecondPhase(
        userId,
        gamingPreferences,
        avatar
      );
      if (response) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error completing second phase:", error);
      alert(
        "There was an error completing the second phase. Please try again later."
      );
    }
  };

  const handleSkipButtonClick = () => {
    navigate("/login");
  };

  return (
    <div className="second-phase-container">
      <h2 className="second-phase-heading">Second Phase</h2>
      <label className="second-phase-label" htmlFor="gamingPreferences">
        Gaming Preferences
      </label>
      <select
        id="gamingPreferences"
        name="gamingPreferences"
        value={formData.gamingPreferences}
        onChange={handleInputChange}
      >
        <option value="">Select a game</option>
        {predefinedGames.map((game) => (
          <option key={game} value={game}>
            {game}
          </option>
        ))}
      </select>
      <br />
      <label className="second-phase-label" htmlFor="avatar">
        Avatar
      </label>
      <select
        id="avatar"
        name="avatar"
        value={formData.avatar}
        onChange={handleInputChange}
      >
        <option value="">Select an avatar</option>
        {predefinedAvatars.map((avatar) => (
          <option key={avatar} value={avatar}>
            {avatar}
          </option>
        ))}
      </select>
      <br />
      <button className="complete-button" onClick={handleCompleteButtonClick}>
        Complete Second Phase
      </button>
      <button className="skip-button" onClick={handleSkipButtonClick}>
        Skip
      </button>
    </div>
  );
};

export default SecondPhase;
