const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage for the uploaded avatars
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure that the destination directory exists
    const targetDirectory = path.join(__dirname, "../uploads/avatars");
    fs.mkdirSync(targetDirectory, { recursive: true });
    cb(null, targetDirectory);
  },
  filename: function (req, file, cb) {
    console.log(file)
    // Generate a unique filename using a timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Create the multer upload object
const uploadAvatar = multer({ storage: storage });

module.exports = uploadAvatar;
