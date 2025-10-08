const Info = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 rounded-full opacity-10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center">
          <div className="inline-block mb-6 animate-bounce">
            <div className="text-7xl">🎓</div>
          </div>
          <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">About <span className="text-yellow-300">SkillSwap</span></h1>
          <p className="text-2xl text-purple-100 max-w-3xl mx-auto">
            Empowering students to collaborate, learn, and grow together 🚀
          </p>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Mission Section */}
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-16 mb-16 border-2 border-purple-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-7xl mb-8">🎯</div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            SkillSwap is a platform designed for students to exchange skills and help each other with various tasks. 
            We believe in the power of collaborative learning and mutual support within the student community. 
            Whether you need help with assignments, projects, or learning new skills, SkillSwap connects you with 
            peers who can assist you. 🤝
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-white">
          <div className="text-5xl mb-4">🤝</div>
          <h3 className="text-2xl font-bold mb-4">Skill Exchange</h3>
          <p className="text-indigo-100">
            Trade skills with fellow students. Help someone with math, get help with coding. 
            Everyone has something valuable to offer.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-white">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-2xl font-bold mb-4">Flexible Payment</h3>
          <p className="text-purple-100">
            Choose how you want to be compensated - cash, skill exchange, or other arrangements. 
            You're in control.
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-white">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold mb-4">Safe & Secure</h3>
          <p className="text-pink-100">
            Built with student safety in mind. Connect only with verified members of your 
            campus community.
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-white">
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold mb-4">Quick & Easy</h3>
          <p className="text-yellow-100">
            Post a job in seconds and get responses from interested students. No lengthy 
            processes or complicated steps.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-white">
          <div className="text-5xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold mb-4">Build Your Network</h3>
          <p className="text-green-100">
            Connect with talented peers across different majors and skill sets. 
            Expand your campus network organically.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-white">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-2xl font-bold mb-4">Learn Together</h3>
          <p className="text-blue-100">
            Collaborative learning leads to better outcomes. Share knowledge and grow 
            together with your peers.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-16 mb-16 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-400 rounded-full opacity-20 blur-2xl"></div>
        
        <h2 className="text-4xl font-extrabold text-center mb-16 relative z-10">How It Works ✨</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-white text-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-2xl">
              1
            </div>
            <h3 className="text-2xl font-bold mb-4">Sign Up 🚀</h3>
            <p className="text-purple-100 text-lg">
              Create your free account and set up your profile with your skills and interests
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-white text-purple-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-2xl">
              2
            </div>
            <h3 className="text-2xl font-bold mb-4">Post or Browse 📝</h3>
            <p className="text-purple-100 text-lg">
              Post jobs you need help with or browse available jobs you can help with
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-white text-pink-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-2xl">
              3
            </div>
            <h3 className="text-2xl font-bold mb-4">Connect & Complete 🤝</h3>
            <p className="text-purple-100 text-lg">
              Accept jobs, connect with students, and complete tasks together
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white transform hover:scale-110 transition-all">
          <div className="text-4xl font-extrabold mb-2">500+</div>
          <div className="text-indigo-100 font-medium">Active Students</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-8 text-center text-white transform hover:scale-110 transition-all">
          <div className="text-4xl font-extrabold mb-2">1000+</div>
          <div className="text-purple-100 font-medium">Tasks Completed</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl shadow-xl p-8 text-center text-white transform hover:scale-110 transition-all">
          <div className="text-4xl font-extrabold mb-2">50+</div>
          <div className="text-pink-100 font-medium">Skill Categories</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 text-center text-white transform hover:scale-110 transition-all">
          <div className="text-4xl font-extrabold mb-2">4.8★</div>
          <div className="text-yellow-100 font-medium">Average Rating</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-16 text-center border-2 border-purple-100">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Join thousands of students who are already helping each other succeed. 
          Your next opportunity is just a click away! ✨
        </p>
        <div className="flex gap-6 justify-center">
          <a 
            href="/signup" 
            className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-12 py-5 rounded-xl font-bold hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 text-lg"
          >
            Sign Up Now 🚀
          </a>
          <a 
            href="/" 
            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-12 py-5 rounded-xl font-bold hover:from-purple-200 hover:to-pink-200 transition-all shadow-lg text-lg border-2 border-purple-300"
          >
            Browse Jobs 📋
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Info;