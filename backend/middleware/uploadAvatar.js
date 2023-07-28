const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2; 



cloudinary.config({
  cloud_name: "dh65ma6ig",
  api_key: "892759473582777",
  api_secret: "YJsOUOcPeh_jfiIkH-vofdIh8Rs",
});


const storage = multer.memoryStorage(); 

// Create the multer upload object
const uploadAvatar = multer({ storage: storage });

module.exports = uploadAvatar;
