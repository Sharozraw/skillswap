import { Link } from 'react-router-dom';

const NavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav className="bg-gray-100 border-b border-gray-300 p-3 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-lg font-semibold text-gray-800 hover:text-gray-900 transition-all">
        SkillSwap
      </Link>
      <div className="flex items-center gap-2">
        <Link
          to="/info"
          className="text-sm text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all"
        >
          Info
        </Link>
        {localStorage.getItem('token') ? (
          <>
            <Link
              to="/dashboard"
              className="text-sm text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;