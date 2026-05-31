import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../api/useAuthStore';
import agent from '../../api/agent';

function decodeProfileInitialFromJwt(token: string | null): string {
  if (!token) return 'P';

  try {
    const parts = token.split('.');
    if (parts.length < 2) return 'P';

    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const claims = JSON.parse(atob(padded)) as Record<string, unknown>;

    const candidateValues = [
      claims.given_name,
      claims.name,
      claims.unique_name,
      claims.email,
      claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    ];

    for (const value of candidateValues) {
      if (typeof value === 'string') {
        const first = value.trim().charAt(0);
        if (first) return first.toUpperCase();
      }
    }
  } catch {
    return 'P';
  }

  return 'P';
}

export const Navbar = () => {
  const { isAuthenticated, role, accessToken } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const profileInitial = decodeProfileInitialFromJwt(accessToken);

  const handleLogout = async () => {
    await agent.auth.logout();
    toast.success('Signed out.');
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-snow border-b border-periwinkle">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/menterviewlogo.ico" alt="Menterview logo" className="w-6 h-6 object-contain" />
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
            <Link
              to="/interview/start"
              className={`text-sm font-medium transition-colors ${
                isActive('/interview/start') ? 'text-navy' : 'text-navy/50 hover:text-navy'
              }`}
            >
              Interview
            </Link>
            <Link
              to="/questions"
              className={`text-sm font-medium transition-colors ${
                isActive('/questions') ? 'text-navy' : 'text-navy/50 hover:text-navy'
              }`}
            >
              Questions
            </Link>
            <Link
              to="/history"
              className={`text-sm font-medium transition-colors ${
                isActive('/history') ? 'text-navy' : 'text-navy/50 hover:text-navy'
              }`}
            >
              History
            </Link>
            <Link
              to="/stats"
              className={`text-sm font-medium transition-colors ${
                isActive('/stats') ? 'text-navy' : 'text-navy/50 hover:text-navy'
              }`}
            >
              Stats
            </Link>
            {role === 'Administrator' && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin') ? 'text-navy' : 'text-navy/50 hover:text-navy'
                }`}
              >
                Admin
              </Link>
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
                {profileInitial}
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