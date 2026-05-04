import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../api/useAuthStore';
import agent from '../../api/agent';

export const Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await agent.auth.logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-snow border-b border-periwinkle">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
            <span className="text-snow text-sm font-bold">M</span>
          </div>
          <span
            className="text-navy text-xl tracking-tight"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Menterview
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/problems" className="text-navy/60 hover:text-navy text-sm font-medium transition-colors">
            Problems
          </Link>
          <Link to="/leaderboard" className="text-navy/60 hover:text-navy text-sm font-medium transition-colors">
            Leaderboard
          </Link>
          <Link to="/discuss" className="text-navy/60 hover:text-navy text-sm font-medium transition-colors">
            Discuss
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center text-navy text-sm font-semibold hover:bg-cornflower hover:text-snow transition-colors"
              >
                U
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-navy/60 hover:text-navy transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-navy hover:text-cornflower transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-navy text-snow px-4 py-2 rounded-lg hover:bg-cornflower transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};