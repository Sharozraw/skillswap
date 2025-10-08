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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6 animate-bounce">
              <div className="text-7xl">🎓</div>
            </div>
            <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">
              Welcome to <span className="text-yellow-300">SkillSwap</span>
            </h1>
            <p className="text-2xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with fellow students, exchange skills, and get tasks done together. 
              Your campus community for collaborative learning. 🚀
            </p>
            <div className="flex gap-6 justify-center">
              <a 
                href="/signup" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-110 text-lg"
              >
                Get Started ✨
              </a>
              <a 
                href="/info" 
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/30 text-lg"
              >
                Learn More 📚
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-center text-white transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">🎯</div>
            <div className="text-4xl font-extrabold mb-2">{jobs.length}</div>
            <div className="text-indigo-100 font-medium">Available Jobs</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-8 text-center text-white transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">🤝</div>
            <div className="text-4xl font-extrabold mb-2">500+</div>
            <div className="text-purple-100 font-medium">Active Students</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl shadow-2xl p-8 text-center text-white transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">⭐</div>
            <div className="text-4xl font-extrabold mb-2">1000+</div>
            <div className="text-pink-100 font-medium">Tasks Completed</div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Available Jobs
            </h2>
            <p className="text-gray-600 text-lg">Browse jobs posted by students in your community</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-all font-semibold text-purple-700 shadow-md">
              🔍 Filter
            </button>
            <button className="px-6 py-3 bg-white border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-all font-semibold text-purple-700 shadow-md">
              📊 Sort
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="w-20 h-20 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">⏳</div>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-20 text-center border-2 border-purple-100">
            <div className="text-8xl mb-6">📭</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No jobs available</h3>
            <p className="text-gray-600 text-lg mb-8">Be the first to post a job and get help from the community!</p>
            <a 
              href="/signup" 
              className="inline-block bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-10 py-4 rounded-xl font-bold hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 transition-all shadow-lg transform hover:scale-105"
            >
              Post a Job 🚀
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-extrabold mb-6">Ready to Join Our Community?</h2>
          <p className="text-2xl text-purple-100 mb-10 max-w-3xl mx-auto">
            Sign up now and start exchanging skills with students around you
          </p>
          <a 
            href="/signup" 
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-5 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-2xl hover:shadow-yellow-500/50 text-xl transform hover:scale-110"
          >
            Create Your Free Account ✨
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;