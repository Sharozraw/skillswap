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
      await fetchData();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-black border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Users Button */}
              <button
                onClick={() => navigate('/users')}
                className="relative bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-all"
                title="Users"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>

              {/* Messages Button */}
              <button
                onClick={() => navigate('/messages')}
                className="relative bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-all"
                title="Messages"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-all"
                  title="Notifications"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-black hover:text-gray-700 font-semibold underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`p-4 hover:bg-gray-50 transition-all cursor-pointer ${
                              !notif.isRead ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{notif.message}</p>
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
                                <div className="w-2 h-2 bg-black rounded-full mt-1"></div>
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
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-full px-4 py-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">Account</p>
                  <p className="font-semibold text-gray-900 text-sm">{user.email}</p>
                </div>
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {avatarLetter}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Jobs Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1 flex gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('available')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                  activeTab === 'available'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Available</span>
                  <span className={`${activeTab === 'available' ? 'bg-white/20' : 'bg-gray-100'} px-2 py-0.5 rounded-full text-xs`}>{jobs.length}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('posted')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                  activeTab === 'posted'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Posted</span>
                  <span className={`${activeTab === 'posted' ? 'bg-white/20' : 'bg-gray-100'} px-2 py-0.5 rounded-full text-xs`}>{postedJobs.length}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                  activeTab === 'accepted'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Accepted</span>
                  <span className={`${activeTab === 'accepted' ? 'bg-white/20' : 'bg-gray-100'} px-2 py-0.5 rounded-full text-xs`}>{acceptedJobs.length}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                  activeTab === 'completed'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Completed</span>
                  <span className={`${activeTab === 'completed' ? 'bg-white/20' : 'bg-gray-100'} px-2 py-0.5 rounded-full text-xs`}>{completedJobs.length}</span>
                </div>
              </button>
              {jobsToRate.length > 0 && (
                <button
                  onClick={() => setActiveTab('to-rate')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                    activeTab === 'to-rate'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>To Rate</span>
                    <span className={`${activeTab === 'to-rate' ? 'bg-white/20' : 'bg-gray-100'} px-2 py-0.5 rounded-full text-xs`}>{jobsToRate.length}</span>
                  </div>
                </button>
              )}
            </div>

            {/* Jobs Display */}
            <div className="space-y-3">
              {activeTab === 'available' && (
                <>
                  {jobs.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No Available Jobs</h3>
                      <p className="text-gray-600 text-sm">Check back later for new opportunities</p>
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No Posted Jobs</h3>
                      <p className="text-gray-600 text-sm">Post your first job using the form</p>
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No Accepted Jobs</h3>
                      <p className="text-gray-600 text-sm">Start applying to jobs to see them here</p>
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No Completed Jobs</h3>
                      <p className="text-gray-600 text-sm">Completed jobs will appear here</p>
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No Jobs to Rate</h3>
                      <p className="text-gray-600 text-sm">Jobs waiting for your rating will appear here</p>
                    </div>
                  ) : (
                    jobsToRate.map((job) => (
                      <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">Completed by <span className="font-semibold">{job.acceptedBy.name}</span></p>
                            <p className="text-xs text-gray-500">
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
                          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
                        >
                          Rate User
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Post New Job</h2>
              
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    name="title"
                    placeholder="e.g., Help with Math Assignment"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-sm"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none bg-white text-sm"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
                >
                  Post Job
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