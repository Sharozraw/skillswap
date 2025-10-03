import { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getJobs();
        setJobs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Available Jobs</h1>
      {jobs.map((job) => <JobCard key={job._id} job={job} />)}
    </div>
  );
};

export default Home;