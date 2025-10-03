import { Link } from 'react-router-dom';

const NavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold">SkillSwap</Link>
      <div>
        <Link to="/info" className="mx-2">Info</Link>
        {localStorage.getItem('token') ? (
          <>
            <Link to="/dashboard" className="mx-2">Dashboard</Link>
            <button onClick={handleLogout} className="mx-2">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mx-2">Login</Link>
            <Link to="/signup" className="mx-2">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;