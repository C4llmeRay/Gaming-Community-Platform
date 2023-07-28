const express = require('express');
const avatarController = require('../controllers/avatarController');
const uploadAvatar = require("../middleware/uploadAvatar");

const router = express.Router();

// Route to handle the avatar image upload
router.post("/uploadAvatar", uploadAvatar.single('avatar'), avatarController.uploadAvatar);

module.exports = router;
