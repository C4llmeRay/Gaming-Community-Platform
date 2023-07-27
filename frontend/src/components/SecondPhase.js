import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { completeSecondPhase } from '../api';

const predefinedGames = [
  'Fortnite',
  'Minecraft',
  'Apex Legends',
  'League of Legends',
  'Counter-Strike: Global Offensive',
];

const predefinedAvatars = [
  "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const SecondPhase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state ?? {}; // Get the userId from the state passed through the location

  const [formData, setFormData] = useState({
    gamingPreferences: '', 
    avatar: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCompleteButtonClick = async () => {
    try {
      const { gamingPreferences, avatar } = formData;

      // Check if the user has completed at least one of the options
      if (!gamingPreferences && !avatar) {
        alert('Please select at least one option or click "Skip"');
        return;
      }

      // Call the API to complete the second phase with gaming preferences and avatar
      const response = await completeSecondPhase(userId, gamingPreferences, avatar);
      if (response) {
        // If the second phase is completed successfully, redirect to the profile page
        navigate('/profile');
      }
    } catch (error) {
      // Handle any errors, such as server issues
      console.error('Error completing second phase:', error);
      alert('There was an error completing the second phase. Please try again later.');
    }
  };

  const handleSkipButtonClick = () => {
    // If the user chooses to skip the second phase, redirect to the profile page
    navigate('/profile');
  };

  return (
    <div>
      <h2>Second Phase</h2>
      <label htmlFor="gamingPreferences">Gaming Preferences:</label>
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
      <label htmlFor="avatar">Avatar:</label>
      <select id="avatar" name="avatar" value={formData.avatar} onChange={handleInputChange}>
        <option value="">Select an avatar</option>
        {predefinedAvatars.map((avatar) => (
          <option key={avatar} value={avatar}>
            {avatar}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleCompleteButtonClick}>Complete Second Phase</button>
      <button onClick={handleSkipButtonClick}>Skip</button>
    </div>
  );
};

export default SecondPhase;
