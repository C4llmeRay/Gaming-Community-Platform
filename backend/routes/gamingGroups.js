const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const gamingGroupsController = require('../controllers/gamingGroupsController');
const GamingGroup = require('../models/GamingGroup');


// Middleware to get the group by ID
const getGroupById = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await GamingGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    req.group = group;
    next();
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Failed to fetch group' });
  }
};

// Create a new gaming group
router.post('/', authMiddleware, gamingGroupsController.createGroup);

// Get details of a gaming group
router.get('/:groupId', authMiddleware, gamingGroupsController.getGroupDetails);

// Join a gaming group
router.post('/:groupId/join', authMiddleware, gamingGroupsController.joinGroup);

// Leave Group
router.post('/:groupId/leave', authMiddleware, getGroupById, gamingGroupsController.leaveGroup);

// Transfer Ownership
router.post('/:groupId/transfer-ownership', authMiddleware, getGroupById, gamingGroupsController.transferOwnership);

// Kick a member from the gaming group
router.post('/:groupId/kick', authMiddleware, getGroupById, gamingGroupsController.kickMember);

// Promote a member to a moderator
router.post('/:groupId/promote', authMiddleware, getGroupById, gamingGroupsController.promoteMember);

// Demote a moderator back to a regular member
router.post('/:groupId/demote', authMiddleware, getGroupById, gamingGroupsController.demoteMember);

module.exports = router;
