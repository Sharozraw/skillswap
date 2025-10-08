const Rating = require('../models/Rating');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Rate a user after job completion
// @route   POST /api/ratings
// @access  Private
const rateUser = async (req, res) => {
  try {
    const { jobId, ratedUserId, rating, comment } = req.body;

    if (!jobId || !ratedUserId || !rating) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const job = await Job.findById(jobId)
      .populate('postedBy', 'name')
      .populate('acceptedBy', 'name');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only job poster can rate the person who accepted
    if (job.postedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the job poster can rate' });
    }

    // Can only rate the person who accepted the job
    if (job.acceptedBy._id.toString() !== ratedUserId) {
      return res.status(400).json({ message: 'You can only rate the person who accepted your job' });
    }

    // Job must be completed
    if (!job.isCompleted) {
      return res.status(400).json({ message: 'Job must be completed before rating' });
    }

    // Check if already rated
    if (job.isRated) {
      return res.status(400).json({ message: 'You have already rated this user for this job' });
    }

    // Create rating
    const newRating = await Rating.create({
      jobId,
      raterId: req.user._id,
      ratedUserId,
      rating,
      comment: comment || '',
    });

    // Update user's rating
    const ratedUser = await User.findById(ratedUserId);
    ratedUser.totalRatingScore += rating;
    ratedUser.ratingsCount += 1;
    ratedUser.rating = ratedUser.totalRatingScore / ratedUser.ratingsCount;
    await ratedUser.save();

    // Mark job as rated
    job.isRated = true;
    await job.save();

    // Create notification
    await Notification.create({
      userId: ratedUserId,
      message: `${job.postedBy.name} rated you ${rating} stars for completing "${job.title}".`,
      type: 'general',
      jobId: job._id,
    });

    await newRating.populate('ratedUserId', 'name email rating');

    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error rating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get ratings for a user
// @route   GET /api/ratings/user/:userId
// @access  Public
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUserId: req.params.userId })
      .populate('raterId', 'name')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  rateUser,
  getUserRatings,
};