const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createJob, getJobs, getJobById, acceptJob, getUserPostedJobs, getUserAcceptedJobs } = require('../controllers/jobController');

const router = express.Router();

router.get('/', getJobs); // All unaccepted jobs
router.post('/', protect, createJob);
router.get('/:id', getJobById);
router.put('/:id/accept', protect, acceptJob);
router.get('/user/posted', protect, getUserPostedJobs);
router.get('/user/accepted', protect, getUserAcceptedJobs);

module.exports = router;