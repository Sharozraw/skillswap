const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  createJob, 
  getJobs, 
  getJobById, 
  completeJob,
  getUserPostedJobs, 
  getUserAcceptedJobs,
  getUserCompletedJobs,
  getJobsToRate
} = require('../controllers/jobController');

const router = express.Router();

// CRITICAL: Specific routes MUST come BEFORE parameterized routes (:id)
router.get('/user/posted', protect, getUserPostedJobs);
router.get('/user/accepted', protect, getUserAcceptedJobs);
router.get('/user/completed', protect, getUserCompletedJobs);
router.get('/user/to-rate', protect, getJobsToRate);

// General routes
router.get('/', getJobs);
router.post('/', protect, createJob);

// Parameterized routes come LAST
router.get('/:id', getJobById);
router.put('/:id/complete', protect, completeJob);

module.exports = router;