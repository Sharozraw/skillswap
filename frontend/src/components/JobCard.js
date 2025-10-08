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
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{job.description}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Payment Info */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <span className="text-xl"></span>
                <div>
                  <p className="text-xs text-gray-700 font-medium">Payment</p>
                  <p className="text-sm font-semibold text-gray-800">{job.payment}</p>
                </div>
              </div>

              {/* Posted By Info */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <div className="w-7 h-7 bg-gray-300 rounded-lg flex items-center justify-center text-gray-800 font-semibold text-sm">
                  {posterAvatarLetter}
                </div>
                <div>
                  <p className="text-xs text-gray-700 font-medium">Posted by</p>
                  <p className="text-sm font-semibold text-gray-800">{posterName}</p>
                </div>
              </div>

              {/* Applications Count */}
              {isOwnJob && job.applicationsCount > 0 && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <span className="text-xl"></span>
                  <div>
                    <p className="text-xs text-gray-700 font-medium">Applications</p>
                    <p className="text-sm font-semibold text-gray-800">{job.applicationsCount}</p>
                  </div>
                </div>
              )}

              {/* Accepted By Info */}
              {isAccepted && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <div className="w-7 h-7 bg-gray-300 rounded-lg flex items-center justify-center text-gray-800 font-semibold text-sm">
                    {acceptedAvatarLetter}
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 font-medium">Accepted by</p>
                    <p className="text-sm font-semibold text-gray-800">{acceptedByName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Posted Date */}
            <div className="text-xs text-gray-500">
              Posted on {new Date(job.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            {/* Completed Date */}
            {job.isCompleted && job.completedAt && (
              <div className="text-xs text-gray-700 font-medium mt-1">
                ✅ Completed on {new Date(job.completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
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
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm"
          >
            Apply for Job
          </button>
        )}

        {showViewApplicationsButton && isOwnJob && !isAccepted && job.applicationsCount > 0 && (
          <button
            onClick={() => onViewApplications(job._id)}
            className="w-full bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-all shadow-sm mt-2"
          >
            View {job.applicationsCount} Application{job.applicationsCount !== 1 ? 's' : ''}
          </button>
        )}

        {isOwnJob && !isAccepted && job.applicationsCount === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-sm font-medium text-gray-700">
              📌 Waiting for applications
            </p>
          </div>
        )}

        {canComplete && onComplete && (
          <button
            onClick={() => onComplete(job._id)}
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm mt-2"
          >
            Mark as Completed
          </button>
        )}

        {isAccepted && isOwnJob && !canComplete && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-sm font-medium text-gray-700">
              ✅ Job Accepted by {acceptedByName}
            </p>
          </div>
        )}

        {isAccepted && !isOwnJob && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-sm font-medium text-gray-700">
              ✓ You accepted this job
            </p>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Apply for Job</h3>
            <p className="text-sm text-gray-600 mb-3">Tell the job poster why you're the right person for this job:</p>
            
            <textarea
              value={applicationReason}
              onChange={(e) => setApplicationReason(e.target.value)}
              placeholder="Why should you get this job? Describe your skills, experience, or why you're interested..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all resize-none mb-2"
              rows="5"
              maxLength="1000"
            />
            <p className="text-xs text-gray-500 text-right mb-3">
              {applicationReason.length}/1000 characters
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleApplySubmit}
                className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm"
              >
                Submit Application
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setApplicationReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition-all shadow-sm"
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