const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware');
const followController = require('../controllers/followController');
const friendController = require('../controllers/friendController');



const router = express.Router();



// Route to get other user's profile by their ID
router.get('/:userId/profile', userController.getOtherUserProfile);

// Route to get other user's profile by their ID
router.get('/:userId', userController.getUserProfile);

// Update user profile
router.patch('/:userId', userController.updateUserProfile);

// Follow a user
router.post('/follow/:userId', authMiddleware, followController.followUser);

// Unfollow a user
router.post('/unfollow/:userId', authMiddleware, followController.unfollowUser);

// Send a friend request
router.post('/friend/request/:userId', authMiddleware, friendController.sendFriendRequest);

// Accept a friend request
router.post('/friend/accept/:requestId', authMiddleware, friendController.acceptFriendRequest);

// Reject a friend request
router.post('/friend/reject/:requestId', authMiddleware, friendController.rejectFriendRequest);

router.get('/friend-requests', authMiddleware, friendController.getFriendRequests);




module.exports = router;
