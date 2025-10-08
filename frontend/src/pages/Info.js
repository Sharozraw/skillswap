import { Link } from 'react-router-dom';

const Info = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Hero Section */}
    <div className="bg-gray-100 border-b border-gray-300 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="text-5xl">🎓</div>
          </div>
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">About <span className="text-gray-600">SkillSwap</span></h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering students to collaborate, learn, and grow together
          </p>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Mission Section */}
      <div className="bg-white rounded-xl shadow-md p-12 mb-12 border border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">🎯</div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Our Mission
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            SkillSwap is a platform designed for students to exchange skills and help each other with various tasks. 
            We believe in the power of collaborative learning and mutual support within the student community. 
            Whether you need help with assignments, projects, or learning new skills, SkillSwap connects you with 
            peers who can assist you.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:bg-gray-100 transition-all">
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Skill Exchange</h3>
          <p className="text-sm text-gray-600">
            Trade skills with fellow students. Help someone with math, get help with coding. 
            Everyone has something valuable to offer.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:bg-gray-100 transition-all">
          <div className="text-4xl mb-3">💰</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Flexible Payment</h3>
          <p className="text-sm text-gray-600">
            Choose how you want to be compensated - cash, skill exchange, or other arrangements. 
            You're in control.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:bg-gray-100 transition-all">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Safe & Secure</h3>
          <p className="text-sm text-gray-600">
            Built with student safety in mind. Connect only with verified members of your 
            campus community.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:bg-gray-100 transition-all">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick & Easy</h3>
          <p className="text-sm text-gray-600">
            Post a job in seconds and get responses from interested students. No lengthy 
            processes or complicated steps.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:bg-gray-100 transition-all">
          <div className="text-4xl mb-3">🌟</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Build Your Network</h3>
          <p className="text-sm text-gray-600">
            Connect with talented peers across different majors and skill sets. 
            Expand your campus network organically.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:bg-gray-100 transition-all">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Learn Together</h3>
          <p className="text-sm text-gray-600">
            Collaborative learning leads to better outcomes. Share knowledge and grow 
            together with your peers.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100 rounded-xl shadow-md p-12 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center text-2xl font-semibold mx-auto mb-4 shadow-sm">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Sign Up</h3>
            <p className="text-sm text-gray-600">
              Create your free account and set up your profile with your skills and interests
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center text-2xl font-semibold mx-auto mb-4 shadow-sm">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Post or Browse</h3>
            <p className="text-sm text-gray-600">
              Post jobs you need help with or browse available jobs you can help with
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center text-2xl font-semibold mx-auto mb-4 shadow-sm">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Connect & Complete</h3>
            <p className="text-sm text-gray-600">
              Accept jobs, connect with students, and complete tasks together
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-semibold text-gray-800 mb-1">500+</div>
          <div className="text-sm text-gray-600 font-medium">Active Students</div>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-semibold text-gray-800 mb-1">1000+</div>
          <div className="text-sm text-gray-600 font-medium">Tasks Completed</div>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-semibold text-gray-800 mb-1">50+</div>
          <div className="text-sm text-gray-600 font-medium">Skill Categories</div>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-semibold text-gray-800 mb-1">4.8★</div>
          <div className="text-sm text-gray-600 font-medium">Average Rating</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
          Join thousands of students who are already helping each other succeed. 
          Your next opportunity is just a click away!
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm text-base"
          >
            Sign Up Now
          </Link>
          <Link 
            to="/" 
            className="bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-400 transition-all shadow-sm text-base border border-gray-400"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Info;