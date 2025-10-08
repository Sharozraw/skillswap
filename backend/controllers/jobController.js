const Job = require('../models/Job');
const Notification = require('../models/Notification');
const Application = require('../models/Application');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const { title, description, payment } = req.body;

    if (!title || !description || !payment) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const job = await Job.create({
      title,
      description,
      payment,
      postedBy: req.user._id,
    });

    await job.populate('postedBy', 'name email');

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all unaccepted jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ acceptedBy: null, isCompleted: false })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('acceptedBy', 'name email rating');

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark job as completed
// @route   PUT /api/jobs/:id/complete
// @access  Private
const completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('acceptedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the job poster can mark it as completed' });
    }

    if (!job.acceptedBy) {
      return res.status(400).json({ message: 'Job must be accepted before it can be completed' });
    }

    if (job.isCompleted) {
      return res.status(400).json({ message: 'Job is already completed' });
    }

    job.isCompleted = true;
    job.completedAt = new Date();
    await job.save();

    await Notification.create({
      userId: job.acceptedBy._id,
      message: `Congratulations! The job "${job.title}" you completed has been marked as finished by ${job.postedBy.name}. Please wait for them to rate your work.`,
      type: 'job_completed',
      jobId: job._id,
    });

    console.log('Notification created for user:', job.acceptedBy._id);

    res.json(job);
  } catch (error) {
    console.error('Error completing job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get jobs posted by the logged-in user
// @route   GET /api/jobs/user/posted
// @access  Private
const getUserPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id, isCompleted: false })
      .populate('postedBy', 'name email')
      .populate('acceptedBy', 'name email rating')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get jobs accepted by the logged-in user
// @route   GET /api/jobs/user/accepted
// @access  Private
const getUserAcceptedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ acceptedBy: req.user._id, isCompleted: false })
      .populate('postedBy', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching accepted jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get completed jobs for the logged-in user
// @route   GET /api/jobs/user/completed
// @access  Private
const getUserCompletedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ 
      acceptedBy: req.user._id, 
      isCompleted: true 
    })
      .populate('postedBy', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ completedAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching completed jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get jobs that need rating by the logged-in user
// @route   GET /api/jobs/user/to-rate
// @access  Private
const getJobsToRate = async (req, res) => {
  try {
    const jobs = await Job.find({ 
      postedBy: req.user._id, 
      isCompleted: true,
      isRated: false
    })
      .populate('postedBy', 'name email')
      .populate('acceptedBy', 'name email rating')
      .sort({ completedAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs to rate:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  completeJob,
  getUserPostedJobs,
  getUserAcceptedJobs,
  getUserCompletedJobs,
  getJobsToRate,
};