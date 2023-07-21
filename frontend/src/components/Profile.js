import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../api';
import { getUserIdFromToken } from '../helpers';

const predefinedGames = [
  'Fortnite',
  'Minecraft',
  'Apex Legends',
  'League of Legends',
  'Counter-Strike: Global Offensive',
  // Add more games here
];

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    gamingPreferences: [],
    avatar: '',
    twitter: '',
    facebook: '',
    instagram: '',
  });

  useEffect(() => {
    // Get the userId from the token
    const userId = getUserIdFromToken();

    // If userId is available, fetch the user profile
    if (userId) {
      fetchUserProfile(userId);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      // Fetch the user profile using the userId
      const userProfile = await getUserProfile(userId);
      setUserProfile(userProfile);
      setFormData({
        username: userProfile.username,
        email: userProfile.email,
        bio: userProfile.bio || '',
        gamingPreferences: userProfile.gamingPreferences || [],
        avatar: userProfile.avatar || '',
        twitter: userProfile.socialLinks?.twitter || '',
        facebook: userProfile.socialLinks?.facebook || '',
        instagram: userProfile.socialLinks?.instagram || '',
      });
    } catch (error) {
      // Handle any errors, such as unauthorized access or server issues
      console.error('Error fetching user profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleEditButtonClick = () => {
    setEditMode(true);
  };

  const handleSaveButtonClick = async () => {
    try {
      // Make the API call to update the user profile
      const userId = getUserIdFromToken();
      const response = await updateUserProfile(userId, formData);
      if (response) {
        // If the update is successful, exit edit mode and refresh the user profile
        setEditMode(false);
        fetchUserProfile(userId);
      }
    } catch (error) {
      // Handle any errors, such as unauthorized access or server issues
      console.error('Error updating user profile:', error);
    }
  };

  const handleCancelButtonClick = () => {
    setEditMode(false);
  };

  const handleGamePreferenceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      if (checked) {
        return {
          ...prevFormData,
          gamingPreferences: [...prevFormData.gamingPreferences, value],
        };
      } else {
        return {
          ...prevFormData,
          gamingPreferences: prevFormData.gamingPreferences.filter((pref) => pref !== value),
        };
      }
    });
  };

  return (
    <div>
      <h2>User Profile</h2>
      {userProfile && !editMode ? (
        <div>
          <p>Username: {userProfile.username}</p>
          <p>Email: {userProfile.email}</p>
          <p>Bio: {userProfile.bio || 'No bio provided'}</p>
          <p>Gaming Preferences:</p>
          <ul>
            {userProfile.gamingPreferences.length === 0 ? (
              <li>No preferences provided</li>
            ) : (
              userProfile.gamingPreferences.map((pref) => <li key={pref}>{pref}</li>)
            )}
          </ul>
          {userProfile.avatar && <img src={userProfile.avatar} alt="User Avatar" />}
          {userProfile.socialLinks?.twitter && <p>Twitter: {userProfile.socialLinks.twitter}</p>}
          {userProfile.socialLinks?.facebook && <p>Facebook: {userProfile.socialLinks.facebook}</p>}
          {userProfile.socialLinks?.instagram && <p>Instagram: {userProfile.socialLinks.instagram}</p>}
          <button onClick={handleEditButtonClick}>Edit Profile</button>
        </div>
      ) : (
        <div>
          <form>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="gamingPreferences">Gaming Preferences:</label>
            {predefinedGames.map((game) => (
              <div key={game}>
                <input
                  type="checkbox"
                  id={game}
                  name="gamingPreferences"
                  value={game}
                  checked={formData.gamingPreferences.includes(game)}
                  onChange={handleGamePreferenceChange}
                />
                <label htmlFor={game}>{game}</label>
              </div>
            ))}
            <br />
            <label htmlFor="avatar">Avatar URL:</label>
            <input
              type="text"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="twitter">Twitter:</label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="facebook">Facebook:</label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="instagram">Instagram:</label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
            />
            <br />
          </form>
          <button onClick={handleSaveButtonClick}>Save Profile</button>
          <button onClick={handleCancelButtonClick}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
