import { useState } from 'react';
import { register } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { data } = await register(formData);
      localStorage.setItem('token', data.token);
      setUser(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-gray-300 rounded-lg mb-3">
            <div className="text-3xl text-gray-800">🎓</div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Join SkillSwap</h1>
          <p className="text-sm text-gray-600">Create your account and start exchanging skills</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="your.email@university.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Use your university email address</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                className="w-4 h-4 mt-1 rounded border-gray-300 text-gray-700 focus:ring-gray-500" 
                required 
              />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-gray-700 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Social Signup Options */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all">
                <span className="text-lg">🔵</span>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all">
                <span className="text-lg">📘</span>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-700 hover:text-gray-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Why join SkillSwap?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-gray-700">✓</span>
              Connect with students in your campus
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-700">✓</span>
              Exchange skills or earn money
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-700">✓</span>
              Build your professional network
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-700">✓</span>
              100% free to join and use
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signup;