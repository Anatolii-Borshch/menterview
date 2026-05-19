import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../api/useAuthStore';
import agent from '../../api/agent';

export const Navbar = () => {
  const { isAuthenticated, role } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await agent.auth.logout();
    toast.success('Signed out.');
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        isActive(to) ? 'text-navy' : 'text-navy/50 hover:text-navy'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-snow border-b border-periwinkle">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
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

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/interview/start" label="Interview" />
            <NavLink to="/questions" label="Questions" />
            <NavLink to="/history" label="History" />
            <NavLink to="/stats" label="Stats" />
            {role === 'Administrator' && (
              <NavLink to="/admin/users" label="Admin" />
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isActive('/profile')
                    ? 'bg-navy text-snow'
                    : 'bg-periwinkle text-navy hover:bg-cornflower hover:text-snow'
                }`}
              >
                P
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-navy/50 hover:text-navy transition-colors"
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