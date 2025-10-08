const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyForJob = async (req, res) => {
  try {
    const { jobId, reason } = req.body;

    if (!jobId || !reason) {
      return res.status(400).json({ message: 'Please provide job ID and reason' });
    }

    const job = await Job.findById(jobId).populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if job is already accepted
    if (job.acceptedBy) {
      return res.status(400).json({ message: 'This job has already been accepted by someone' });
    }

    // Prevent applying to own job
    if (job.postedBy._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot apply to your own job' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ 
      jobId, 
      applicantId: req.user._id 
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user._id,
      reason,
    });

    // Update job applications count
    job.applicationsCount += 1;
    await job.save();

    // Populate applicant info
    await application.populate('applicantId', 'name email bio rating');
    await application.populate('jobId', 'title');

    // Create notification for job poster
    await Notification.create({
      userId: job.postedBy._id,
      message: `${req.user.name} has applied for your job "${job.title}".`,
      type: 'job_accepted',
      jobId: job._id,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only job poster can see applications
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('applicantId', 'name email bio rating ratingsCount')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Accept an application
// @route   PUT /api/applications/:id/accept
// @access  Private
const acceptApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('applicantId', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = application.jobId;

    // Only job poster can accept applications
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this application' });
    }

    // Check if job already has someone accepted
    if (job.acceptedBy) {
      return res.status(400).json({ message: 'This job has already been accepted by someone' });
    }

    // Update application status
    application.status = 'accepted';
    await application.save();

    // Update job
    job.acceptedBy = application.applicantId._id;
    await job.save();

    // Reject all other applications for this job
    await Application.updateMany(
      { jobId: job._id, _id: { $ne: application._id } },
      { status: 'rejected' }
    );

    // Create notification for accepted applicant
    await Notification.create({
      userId: application.applicantId._id,
      message: `Congratulations! Your application for "${job.title}" has been accepted.`,
      type: 'job_accepted',
      jobId: job._id,
    });

    res.json(application);
  } catch (error) {
    console.error('Error accepting application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id })
      .populate('jobId')
      .populate({
        path: 'jobId',
        populate: { path: 'postedBy', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyForJob,
  getJobApplications,
  acceptApplication,
  getMyApplications,
};