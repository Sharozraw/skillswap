import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  getJobs, 
  createJob, 
  completeJob,
  getPostedJobs, 
  getAcceptedJobs,
  getCompletedJobs,
  getJobsToRate,
  applyForJob,
  getJobApplications,
  acceptApplication,
  rateUser,
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadMessageCount
} from '../services/api';
import JobCard from '../components/JobCard';
import ApplicationsModal from '../components/ApplicationsModal';
import RatingModal from '../components/RatingModal';
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [jobsToRate, setJobsToRate] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', payment: '' });
  const [activeTab, setActiveTab] = useState('available');
  const [user, setUser] = useState({ id: null, name: 'User', email: 'user@example.com' });
  
  // Modal states
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJobApplications, setSelectedJobApplications] = useState([]);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedJobForRating, setSelectedJobForRating] = useState(null);

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes, msgCountRes] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
        getUnreadMessageCount()
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
      setUnreadMessages(msgCountRes.data.count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id || decoded.userId || decoded.sub || null;
        const userName = decoded.name || decoded.username || decoded.fullName || 'User';
        const userEmail = decoded.email || decoded.mail || 'user@example.com';
        
        setUser({
          id: userId,
          name: userName,
          email: userEmail
        });
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    fetchData();
    fetchNotifications();

    const notificationInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(notificationInterval);
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, postedRes, acceptedRes, completedRes, toRateRes] = await Promise.all([
        getJobs(), 
        getPostedJobs(), 
        getAcceptedJobs(),
        getCompletedJobs(),
        getJobsToRate()
      ]);
      
      setJobs(jobsRes.data);
      setPostedJobs(postedRes.data);
      setAcceptedJobs(acceptedRes.data);
      setCompletedJobs(completedRes.data);
      setJobsToRate(toRateRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await createJob(newJob);
      setNewJob({ title: '', description: '', payment: '' });
      
      // Refresh all job lists to show the new job
      await fetchData();
      
      // Switch to posted tab to show the newly created job
      setActiveTab('posted');
      
      alert('Job posted successfully!');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    }
  };

  const handleApply = async (jobId, reason) => {
    try {
      await applyForJob(jobId, reason);
      
      const jobsRes = await getJobs();
      setJobs(jobsRes.data);
      
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert(error.response?.data?.message || 'Failed to apply for job. Please try again.');
    }
  };

  const handleComplete = async (id) => {
    try {
      const confirmed = window.confirm('Are you sure you want to mark this job as completed?');
      if (!confirmed) return;

      await completeJob(id);
      
      const [postedRes, toRateRes] = await Promise.all([
        getPostedJobs(),
        getJobsToRate()
      ]);
      
      setPostedJobs(postedRes.data);
      setJobsToRate(toRateRes.data);
      
      alert('Job marked as completed! Please rate the user who completed it.');
      
      // Switch to jobs to rate tab if there are jobs to rate
      if (toRateRes.data.length > 0) {
        setActiveTab('to-rate');
      }
    } catch (error) {
      console.error('Error completing job:', error);
      alert(error.response?.data?.message || 'Failed to complete job. Please try again.');
    }
  };

  const handleViewApplications = async (jobId) => {
    try {
      const job = postedJobs.find(j => j._id === jobId);
      const applicationsRes = await getJobApplications(jobId);
      setSelectedJobForApplications(job);
      setSelectedJobApplications(applicationsRes.data);
      setShowApplicationsModal(true);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to load applications');
    }
  };

  const handleAcceptApplication = async (applicationId) => {
    try {
      await acceptApplication(applicationId);
      setShowApplicationsModal(false);
      
      const [postedRes, jobsRes] = await Promise.all([
        getPostedJobs(),
        getJobs()
      ]);
      
      setPostedJobs(postedRes.data);
      setJobs(jobsRes.data);
      
      alert('Application accepted successfully!');
    } catch (error) {
      console.error('Error accepting application:', error);
      alert(error.response?.data?.message || 'Failed to accept application');
    }
  };

  const handleRateUser = async (jobId, ratedUserId, rating, comment) => {
    try {
      await rateUser(jobId, ratedUserId, rating, comment);
      setShowRatingModal(false);
      
      const toRateRes = await getJobsToRate();
      setJobsToRate(toRateRes.data);
      
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error rating user:', error);
      alert(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const avatarLetter = user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-md">Dashboard</h1>
              <p className="text-indigo-100 mt-2 text-lg">Welcome back, {user.name}! 👋</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Users Button */}
              <button
                onClick={() => navigate('/users')}
                className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all"
              >
                <span className="text-2xl">👥</span>
              </button>

              {/* Messages Button */}
              <button
                onClick={() => navigate('/messages')}
                className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all"
              >
                <span className="text-2xl">💬</span>
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <span className="text-2xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-purple-100 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-purple-600 hover:text-purple-800 font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <span className="text-4xl block mb-2">📭</span>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`p-4 hover:bg-purple-50 transition-all cursor-pointer ${
                              !notif.isRead ? 'bg-purple-50/50' : ''
                            }`}
                            onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">
                                {notif.type === 'job_completed' ? '🎉' : '📢'}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notif.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              {!notif.isRead && (
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-right">
                  <p className="text-xs text-indigo-200 font-medium uppercase tracking-wide">Account</p>
                  <p className="font-semibold text-white">{user.email}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white/30">
                  {avatarLetter}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Jobs Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-2 flex gap-2 border border-purple-100 overflow-x-auto">
              <button
                onClick={() => setActiveTab('available')}
                className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'available'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📋</span>
                  <span>Available</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{jobs.length}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('posted')}
                className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'posted'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📝</span>
                  <span>Posted</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{postedJobs.length}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'accepted'
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>✅</span>
                  <span>Accepted</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{acceptedJobs.length}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'completed'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🎉</span>
                  <span>Completed</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{completedJobs.length}</span>
                </div>
              </button>
              {jobsToRate.length > 0 && (
                <button
                  onClick={() => setActiveTab('to-rate')}
                  className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'to-rate'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>⭐</span>
                    <span>To Rate</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{jobsToRate.length}</span>
                  </div>
                </button>
              )}
            </div>

            {/* Jobs Display */}
            <div className="space-y-4">
              {activeTab === 'available' && (
                <>
                  {jobs.length === 0 ? (
                    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg p-16 text-center border border-indigo-100">
                      <div className="text-6xl mb-6">📋</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Available Jobs</h3>
                      <p className="text-gray-600">Check back later for new opportunities!</p>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <JobCard 
                        key={job._id} 
                        job={job} 
                        onApply={handleApply} 
                        currentUser={user} 
                      />
                    ))
                  )}
                </>
              )}
              {activeTab === 'posted' && (
                <>
                  {postedJobs.length === 0 ? (
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-16 text-center border border-purple-100">
                      <div className="text-6xl mb-6">📝</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Posted Jobs</h3>
                      <p className="text-gray-600">Post your first job using the form on the right!</p>
                    </div>
                  ) : (
                    postedJobs.map((job) => (
                      <JobCard 
                        key={job._id} 
                        job={job} 
                        currentUser={user}
                        onComplete={handleComplete}
                        onViewApplications={handleViewApplications}
                        showCompleteButton={true}
                        showViewApplicationsButton={true}
                      />
                    ))
                  )}
                </>
              )}
              {activeTab === 'accepted' && (
                <>
                  {acceptedJobs.length === 0 ? (
                    <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-lg p-16 text-center border border-pink-100">
                      <div className="text-6xl mb-6">✅</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Accepted Jobs</h3>
                      <p className="text-gray-600">Start applying to jobs to see them here!</p>
                    </div>
                  ) : (
                    acceptedJobs.map((job) => (
                      <JobCard 
                        key={job._id} 
                        job={job} 
                        currentUser={user} 
                      />
                    ))
                  )}
                </>
              )}
              {activeTab === 'completed' && (
                <>
                  {completedJobs.length === 0 ? (
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-16 text-center border border-green-100">
                      <div className="text-6xl mb-6">🎉</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Completed Jobs</h3>
                      <p className="text-gray-600">Completed jobs will appear here!</p>
                    </div>
                  ) : (
                    completedJobs.map((job) => (
                      <JobCard 
                        key={job._id} 
                        job={job} 
                        currentUser={user} 
                      />
                    ))
                  )}
                </>
              )}
              {activeTab === 'to-rate' && (
                <>
                  {jobsToRate.length === 0 ? (
                    <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-lg p-16 text-center border border-yellow-100">
                      <div className="text-6xl mb-6">⭐</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Jobs to Rate</h3>
                      <p className="text-gray-600">Jobs waiting for your rating will appear here!</p>
                    </div>
                  ) : (
                    jobsToRate.map((job) => (
                      <div key={job._id} className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                            <p className="text-gray-600 mb-4">Completed by <span className="font-semibold">{job.acceptedBy.name}</span></p>
                            <p className="text-sm text-gray-500">
                              Completed on {new Date(job.completedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedJobForRating(job);
                            setShowRatingModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md"
                        >
                          ⭐ Rate User
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Create Job Form */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 sticky top-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  ✨
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Post New Job</h2>
              </div>
              
              <form onSubmit={handleCreateJob} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    name="title"
                    placeholder="e.g., Help with Math Assignment"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe what you need help with..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none bg-white"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment
                  </label>
                  <input
                    name="payment"
                    placeholder="e.g., $20 or Skill Exchange"
                    value={newJob.payment}
                    onChange={(e) => setNewJob({...newJob, payment: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white py-4 rounded-xl font-bold hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Post Job 🚀
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApplicationsModal && selectedJobForApplications && (
        <ApplicationsModal
          job={selectedJobForApplications}
          applications={selectedJobApplications}
          onAccept={handleAcceptApplication}
          onClose={() => setShowApplicationsModal(false)}
        />
      )}

      {showRatingModal && selectedJobForRating && (
        <RatingModal
          job={selectedJobForRating}
          onRate={handleRateUser}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;