const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserById, 
  updateBio,
  getCurrentUser 
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, getAllUsers);
router.get('/profile', protect, getCurrentUser);
router.put('/bio', protect, updateBio);
router.get('/:id', protect, getUserById);

module.exports = router;