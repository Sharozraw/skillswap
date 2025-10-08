import React from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicationsModal = ({ job, applications, onAccept, onClose }) => {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= Math.round(rating) ? 'text-gray-800' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Applications</h3>
              <p className="text-sm text-gray-600">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg p-1.5 transition-all"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-4">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-600 text-sm">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className={`border border-gray-300 rounded-xl p-4 transition-all ${
                    app.status === 'accepted'
                      ? 'border-gray-400 bg-gray-50'
                      : app.status === 'rejected'
                      ? 'border-gray-300 bg-gray-100 opacity-75'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center text-gray-800 font-semibold text-xl shadow-sm">
                        {app.applicantId.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {app.applicantId.name}
                          </h4>
                          {app.status === 'accepted' && (
                            <span className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                              Accepted
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                              Rejected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{app.applicantId.email}</p>
                        
                        {/* Bio */}
                        {app.applicantId.bio && (
                          <p className="text-xs text-gray-600 mb-2 italic">"{app.applicantId.bio}"</p>
                        )}

                        {/* Rating */}
                        <div className="mb-2">
                          {renderStars(app.applicantId.rating)}
                          {app.applicantId.ratingsCount > 0 && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {app.applicantId.ratingsCount} rating{app.applicantId.ratingsCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        {/* Application Reason */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
                          <p className="text-xs text-gray-700 font-medium mb-1">Why they should get this job:</p>
                          <p className="text-xs text-gray-600">{app.reason}</p>
                        </div>

                        {/* Applied Date */}
                        <p className="text-xs text-gray-500">
                          Applied on {new Date(app.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {app.status === 'pending' && (
                      <button
                        onClick={() => onAccept(app._id)}
                        className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/messages/${app.applicantId._id}`)}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-all shadow-sm"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-4 bg-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsModal;