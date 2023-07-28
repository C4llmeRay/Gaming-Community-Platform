const express = require('express');
const authController = require('../controllers/authController');



const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.patch('/complete-second-phase', authController.completeSecondPhase);

module.exports = router;
