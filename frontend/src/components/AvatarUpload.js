import React, { useState } from "react";
import axios from "axios";

const AvatarUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const response = await axios.post(
        "http://localhost:5000/avatars/uploadAvatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Avatar uploaded:", response.data.avatarUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <div>
      <h2>Upload Avatar</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default AvatarUpload;
