import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const register = (data) => API.post('/users/register', data);
export const login = (data) => API.post('/users/login', data);
export const getJobs = () => API.get('/jobs');
export const createJob = (data) => API.post('/jobs', data);
export const acceptJob = (id) => API.put(`/jobs/${id}/accept`);
export const getPostedJobs = () => API.get('/jobs/user/posted');
export const getAcceptedJobs = () => API.get('/jobs/user/accepted');