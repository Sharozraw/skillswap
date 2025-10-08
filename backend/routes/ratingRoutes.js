const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { rateUser, getUserRatings } = require('../controllers/ratingController');

const router = express.Router();

router.post('/', protect, rateUser);
router.get('/user/:userId', getUserRatings);

module.exports = router;