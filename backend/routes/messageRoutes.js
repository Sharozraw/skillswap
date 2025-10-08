const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  sendMessage, 
  getConversation, 
  getConversations,
  getUnreadCount 
} = require('../controllers/messageController');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.get('/conversation/:userId', protect, getConversation);

module.exports = router;