const Job = require('../models/Job');

const createJob = async (req, res) => {
  const { title, description, payment } = req.body;
  const job = await Job.create({ title, description, payment, postedBy: req.user._id });
  res.status(201).json(job);
};

const getJobs = async (req, res) => {
  const jobs = await Job.find({ acceptedBy: null }).populate('postedBy', 'name');
  res.json(jobs);
};

const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name');
  if (job) res.json(job);
  else res.status(404).json({ message: 'Job not found' });
};

const acceptJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.acceptedBy) return res.status(400).json({ message: 'Already accepted' });

  job.acceptedBy = req.user._id;
  await job.save();
  res.json(job);
};

const getUserPostedJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).populate('acceptedBy', 'name');
  res.json(jobs);
};

const getUserAcceptedJobs = async (req, res) => {
  const jobs = await Job.find({ acceptedBy: req.user._id }).populate('postedBy', 'name');
  res.json(jobs);
};

module.exports = { createJob, getJobs, getJobById, acceptJob, getUserPostedJobs, getUserAcceptedJobs };