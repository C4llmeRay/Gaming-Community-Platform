const express = require('express');
const authController = require('../controllers/authController');
const uploadAvatar = require("../middleware/uploadAvatar");



const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.patch('/complete-second-phase', authController.completeSecondPhase);
router.post("/upload-avatar", uploadAvatar.single('avatar'), authController.uploadAvatar);

module.exports = router;
