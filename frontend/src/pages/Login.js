import { useState } from 'react';
import { login } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    
    try {
      const { data } = await login(formData);
      localStorage.setItem('token', data.token);
      setUser(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-600">Sign in to continue to SkillSwap</p>
        </div>

        {/* Login Form Card */}
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gray-700 focus:ring-gray-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-gray-700 hover:text-gray-800 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Login Options */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600">Or continue with</span>
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

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-gray-700 hover:text-gray-800 font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-4">
          By signing in, you agree to our{' '}
          <a href="#" className="text-gray-700 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;