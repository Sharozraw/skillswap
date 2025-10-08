import React, { useState } from 'react';

const JobCard = ({ 
  job, 
  onApply, 
  onComplete, 
  onViewApplications,
  currentUser, 
  showCompleteButton = false,
  showViewApplicationsButton = false 
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationReason, setApplicationReason] = useState('');

  const posterName = job.postedBy?.name || 'Unknown User';
  const posterId = job.postedBy?._id || job.postedBy;
  
  const isOwnJob = currentUser?.id && posterId && (posterId.toString() === currentUser.id.toString());
  
  const isAccepted = !!job.acceptedBy;
  const acceptedByName = job.acceptedBy?.name || 'Someone';
  
  const posterAvatarLetter = posterName.charAt(0).toUpperCase();
  const acceptedAvatarLetter = isAccepted ? acceptedByName.charAt(0).toUpperCase() : '';

  const canComplete = isOwnJob && isAccepted && showCompleteButton;

  const handleApplySubmit = () => {
    if (applicationReason.trim().length < 10) {
      alert('Please provide a reason with at least 10 characters');
      return;
    }
    onApply(job._id, applicationReason);
    setShowApplyModal(false);
    setApplicationReason('');
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-purple-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
            <p className="text-gray-600 mb-4">{job.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {/* Payment Info */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-xs text-green-600 font-semibold">Payment</p>
                  <p className="text-sm font-bold text-green-700">{job.payment}</p>
                </div>
              </div>

              {/* Posted By Info */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {posterAvatarLetter}
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-semibold">Posted by</p>
                  <p className="text-sm font-bold text-blue-700">{posterName}</p>
                </div>
              </div>

              {/* Applications Count */}
              {isOwnJob && job.applicationsCount > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-2 rounded-lg border border-orange-200">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="text-xs text-orange-600 font-semibold">Applications</p>
                    <p className="text-sm font-bold text-orange-700">{job.applicationsCount}</p>
                  </div>
                </div>
              )}

              {/* Accepted By Info */}
              {isAccepted && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-lg border border-purple-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {acceptedAvatarLetter}
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-semibold">Accepted by</p>
                    <p className="text-sm font-bold text-purple-700">{acceptedByName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Posted Date */}
            <div className="text-xs text-gray-500">
              Posted on {new Date(job.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            {/* Completed Date */}
            {job.isCompleted && job.completedAt && (
              <div className="text-xs text-green-600 font-semibold mt-1">
                ✅ Completed on {new Date(job.completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons / Status Messages */}
        {onApply && !isAccepted && !isOwnJob && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Apply for Job 🚀
          </button>
        )}

        {showViewApplicationsButton && isOwnJob && !isAccepted && job.applicationsCount > 0 && (
          <button
            onClick={() => onViewApplications(job._id)}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            View {job.applicationsCount} Application{job.applicationsCount !== 1 ? 's' : ''} 📋
          </button>
        )}

        {isOwnJob && !isAccepted && job.applicationsCount === 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 text-center">
            <p className="text-sm font-semibold text-yellow-700">
              📌 Waiting for applications
            </p>
          </div>
        )}

        {canComplete && onComplete && (
          <button
            onClick={() => onComplete(job._id)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Mark as Completed ✓
          </button>
        )}

        {isAccepted && isOwnJob && !canComplete && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-sm font-semibold text-green-700">
              ✅ Job Accepted by {acceptedByName}
            </p>
          </div>
        )}

        {isAccepted && !isOwnJob && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 text-center">
            <p className="text-sm font-semibold text-purple-700">
              ✓ You accepted this job
            </p>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Apply for Job</h3>
            <p className="text-gray-600 mb-4">Tell the job poster why you're the right person for this job:</p>
            
            <textarea
              value={applicationReason}
              onChange={(e) => setApplicationReason(e.target.value)}
              placeholder="Why should you get this job? Describe your skills, experience, or why you're interested..."
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none mb-2"
              rows="6"
              maxLength="1000"
            />
            <p className="text-xs text-gray-500 text-right mb-4">
              {applicationReason.length}/1000 characters
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleApplySubmit}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Submit Application
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setApplicationReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;