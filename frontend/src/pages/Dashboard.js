import React, { useEffect, useState } from "react";
import { getJobs, createJob, acceptJob, getPostedJobs, getAcceptedJobs } from '../services/api';
import JobCard from '../components/JobCard';
import { jwtDecode } from "jwt-decode";  // Install: npm install jwt-decode

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '', payment: '' });
  const user = jwtDecode(localStorage.getItem('token')); // Get user from token

  useEffect(() => {
    const fetchData = async () => {
      const [jobsRes, postedRes, acceptedRes] = await Promise.all([getJobs(), getPostedJobs(), getAcceptedJobs()]);
      setJobs(jobsRes.data);
      setPostedJobs(postedRes.data);
      setAcceptedJobs(acceptedRes.data);
    };
    fetchData();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    await createJob(newJob);
    setNewJob({ title: '', description: '', payment: '' });
    // Refresh jobs
    const postedRes = await getPostedJobs();
    setPostedJobs(postedRes.data);
  };

  const handleAccept = async (id) => {
    await acceptJob(id);
    // Refresh
    const [jobsRes, acceptedRes] = await Promise.all([getJobs(), getAcceptedJobs()]);
    setJobs(jobsRes.data);
    setAcceptedJobs(acceptedRes.data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
        {jobs.map((job) => <JobCard key={job._id} job={job} onAccept={handleAccept} />)}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
        <p>Name: {user.name}</p> {/* Assuming token has name; adjust if needed */}
        <p>Email: {user.email}</p>
        <h3 className="font-bold mt-4">Post New Job</h3>
        <form onSubmit={handleCreateJob}>
          <input name="title" placeholder="Title" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} className="border p-2 mb-2 w-full" />
          <textarea name="description" placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} className="border p-2 mb-2 w-full" />
          <input name="payment" placeholder="Payment (e.g., $20)" value={newJob.payment} onChange={(e) => setNewJob({...newJob, payment: e.target.value})} className="border p-2 mb-2 w-full" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">Post Job</button>
        </form>
        <h3 className="font-bold mt-4">Your Posted Jobs</h3>
        {postedJobs.map((job) => <JobCard key={job._id} job={job} />)}
        <h3 className="font-bold mt-4">Your Accepted Jobs</h3>
        {acceptedJobs.map((job) => <JobCard key={job._id} job={job} />)}
      </div>
    </div>
  );
};

export default Dashboard;