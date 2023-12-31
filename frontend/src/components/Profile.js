import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, uploadAvatar } from "../api";
import { getUserIdFromToken } from "../helpers";
import '../styles/Profile.css'

const predefinedGames = [
  "Fortnite",
  "Minecraft",
  "Apex Legends",
  "League of Legends",
  "Counter-Strike: Global Offensive",
  // Add more games here
];

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    gamingPreferences: [],
    avatar: "",
    twitter: "",
    facebook: "",
    instagram: "",
  });

  // New state variable for avatar file
  const [avatarFile, setAvatarFile] = useState(null);

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
        bio: userProfile.bio || "",
        gamingPreferences: userProfile.gamingPreferences || [],
        avatar: userProfile.avatar || "",
        twitter: userProfile.socialLinks?.twitter || "",
        facebook: userProfile.socialLinks?.facebook || "",
        instagram: userProfile.socialLinks?.instagram || "",
      });
    } catch (error) {
      // Handle any errors, such as unauthorized access or server issues
      console.error("Error fetching user profile:", error);
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
      console.error("Error updating user profile:", error);
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
          gamingPreferences: prevFormData.gamingPreferences.filter(
            (pref) => pref !== value
          ),
        };
      }
    });
  };

  // New function to handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected Avatar File:", file);
    setAvatarFile(file);
  };

  const handleUploadAvatar = async () => {
    try {
      if (!avatarFile) {
        alert("Please select an avatar image");
        return;
      }

      // Call the API function to upload the avatar
      console.log("Uploading Avatar...");
      const response = await uploadAvatar(avatarFile);

      if (response && response.imageUrl) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          avatar: response.imageUrl,
        }));
        alert("Avatar uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("There was an error uploading the avatar. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-heading">User Profile</h2>
      {userProfile && !editMode ? (
        <div className="user-info">
          <p className="username">Username: {userProfile.username}</p>
          <p className="email">Email: {userProfile.email}</p>
          <p className="bio">Bio: {userProfile.bio || "No bio provided"}</p>
          <p className="gaming-prefs-heading">Gaming Preferences:</p>
          <ul className="gaming-prefs-list">
            {userProfile.gamingPreferences.length === 0 ? (
              <li>No preferences provided</li>
            ) : (
              userProfile.gamingPreferences.map((pref) => (
                <li key={pref} className="gaming-pref">
                  {pref}
                </li>
              ))
            )}
          </ul>
          {userProfile.avatar && (
            <img
              className="user-avatar"
              src={userProfile.avatar}
              alt="User Avatar"
            />
          )}
          {userProfile.socialLinks?.twitter && (
            <p className="twitter">
              Twitter: {userProfile.socialLinks.twitter}
            </p>
          )}
          {userProfile.socialLinks?.facebook && (
            <p className="facebook">
              Facebook: {userProfile.socialLinks.facebook}
            </p>
          )}
          {userProfile.socialLinks?.instagram && (
            <p className="instagram">
              Instagram: {userProfile.socialLinks.instagram}
            </p>
          )}
          <button
            className="edit-profile-button"
            onClick={handleEditButtonClick}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="user-info">
          <form className="edit-form" encType="multipart/form-data">
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
            {editMode ? (
              <>
                <label htmlFor="avatar">Select Avatar:</label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  onChange={handleAvatarChange}
                />
                <button
                  className="avatar-upload-button"
                  type="button"
                  onClick={handleUploadAvatar}
                >
                  Upload Avatar
                </button>
              </>
            ) : (
              <>
                <label htmlFor="avatar">Avatar URL:</label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </>
            )}
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
          {editMode ? (
            <>
              <button
                className="avatar-upload-button"
                onClick={handleSaveButtonClick}
              >
                Save Profile
              </button>
              <button
                className="avatar-upload-button"
                onClick={handleCancelButtonClick}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="edit-profile-button"
              onClick={handleEditButtonClick}
            >
              Edit Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
