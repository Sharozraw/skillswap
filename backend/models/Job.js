const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  payment: { type: String, required: true }, // e.g., "$20" or "Free help"
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null if not accepted
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);