const express = require('express');
const router = express.Router();
const messageController = require('../controllers/chatMessagesController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', messageController.sendMessage);

router.get('/:groupId', messageController.getMessagesByGroupId);

router.delete('/:messageId', authMiddleware, messageController.deleteMessage);

module.exports = router;
