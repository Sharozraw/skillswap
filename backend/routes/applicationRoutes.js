const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  applyForJob, 
  getJobApplications, 
  acceptApplication,
  getMyApplications 
} = require('../controllers/applicationController');

const router = express.Router();

router.post('/', protect, applyForJob);
router.get('/my-applications', protect, getMyApplications);
router.get('/job/:jobId', protect, getJobApplications);
router.put('/:id/accept', protect, acceptApplication);

module.exports = router;