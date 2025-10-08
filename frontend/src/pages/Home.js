import { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getJobs();
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to SkillSwap
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Connect with fellow students, exchange skills, and get tasks done together. 
              Your campus community for collaborative learning.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/signup" 
                className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all"
              >
                Get Started
              </a>
              <a 
                href="/info" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{jobs.length}</div>
            <div className="text-gray-600 font-medium">Available Jobs</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">Active</div>
            <div className="text-gray-600 font-medium">Community Status</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">Live</div>
            <div className="text-gray-600 font-medium">Platform Status</div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Available Jobs
            </h2>
            <p className="text-gray-600">Browse jobs posted by students in your community</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all font-medium text-sm">
              Filter
            </button>
            <button className="px-6 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all font-medium text-sm">
              Sort
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs available</h3>
            <p className="text-gray-600 mb-8">Be the first to post a job and get help from the community</p>
            <a 
              href="/signup" 
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all"
            >
              Post a Job
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Sign up now and start exchanging skills with students around you
          </p>
          <a 
            href="/signup" 
            className="inline-block bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all text-lg"
          >
            Create Your Free Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;