import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/users/register', userData);
export const login = (credentials) => api.post('/users/login', credentials);

// User APIs
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateBio = (bio) => api.put('/users/bio', { bio });
export const getCurrentUser = () => api.get('/users/profile');

// Job APIs
export const getJobs = () => api.get('/jobs');
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (jobData) => api.post('/jobs', jobData);
export const completeJob = (id) => api.put(`/jobs/${id}/complete`);
export const getPostedJobs = () => api.get('/jobs/user/posted');
export const getAcceptedJobs = () => api.get('/jobs/user/accepted');
export const getCompletedJobs = () => api.get('/jobs/user/completed');
export const getJobsToRate = () => api.get('/jobs/user/to-rate');

// Application APIs
export const applyForJob = (jobId, reason) => api.post('/applications', { jobId, reason });
export const getJobApplications = (jobId) => api.get(`/applications/job/${jobId}`);
export const acceptApplication = (id) => api.put(`/applications/${id}/accept`);
export const getMyApplications = () => api.get('/applications/my-applications');

// Message APIs
export const sendMessage = (receiverId, message) => api.post('/messages', { receiverId, message });
export const getConversation = (userId) => api.get(`/messages/conversation/${userId}`);
export const getConversations = () => api.get('/messages/conversations');
export const getUnreadMessageCount = () => api.get('/messages/unread-count');

// Rating APIs
export const rateUser = (jobId, ratedUserId, rating, comment) => 
  api.post('/ratings', { jobId, ratedUserId, rating, comment });
export const getUserRatings = (userId) => api.get(`/ratings/user/${userId}`);

// Notification APIs
export const getNotifications = () => api.get('/notifications');
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => api.put('/notifications/read-all');

export default api;