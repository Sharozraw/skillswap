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
            className={`text-sm ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Applications</h3>
              <p className="text-indigo-100 mt-1">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition-all"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-6">
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className={`border-2 rounded-2xl p-6 transition-all ${
                    app.status === 'accepted'
                      ? 'border-green-300 bg-green-50'
                      : app.status === 'rejected'
                      ? 'border-gray-300 bg-gray-50 opacity-60'
                      : 'border-purple-200 bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {app.applicantId.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xl font-bold text-gray-800">
                            {app.applicantId.name}
                          </h4>
                          {app.status === 'accepted' && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              Accepted
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              Rejected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{app.applicantId.email}</p>
                        
                        {/* Bio */}
                        {app.applicantId.bio && (
                          <p className="text-sm text-gray-600 mb-2 italic">"{app.applicantId.bio}"</p>
                        )}

                        {/* Rating */}
                        <div className="mb-3">
                          {renderStars(app.applicantId.rating)}
                          {app.applicantId.ratingsCount > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {app.applicantId.ratingsCount} rating{app.applicantId.ratingsCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        {/* Application Reason */}
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-3">
                          <p className="text-xs text-purple-600 font-semibold mb-2">Why they should get this job:</p>
                          <p className="text-sm text-gray-700">{app.reason}</p>
                        </div>

                        {/* Applied Date */}
                        <p className="text-xs text-gray-500">
                          Applied on {new Date(app.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {app.status === 'pending' && (
                      <button
                        onClick={() => onAccept(app._id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
                      >
                        Accept Application ✓
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/messages/${app.applicantId._id}`)}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      💬 Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-400 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsModal;