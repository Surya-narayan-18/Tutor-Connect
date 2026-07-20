import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = isAuthenticated
    ? user?.role === 'admin'
      ? [
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/tutor-approvals', label: 'Approvals' },
          { to: '/admin/bookings', label: 'Bookings' },
        ]
      : user?.role === 'tutor'
      ? [
          { to: '/tutor/dashboard', label: 'Dashboard' },
          { to: '/tutor/profile', label: 'Profile' },
          { to: '/tutor/availability', label: 'Availability' },
          { to: '/tutor/bookings', label: 'Bookings' },
          { to: '/tutor/reviews', label: 'Reviews' },
        ]
      : [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/tutors', label: 'Find Tutors' },
          { to: '/recommendations', label: 'AI Match' },
          { to: '/bookings', label: 'Bookings' },
        ]
    : [
        { to: '/tutors', label: 'Browse Tutors' },
        { to: '/how-it-works', label: 'How It Works' },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 glass border-b border-surface-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <span className="text-xl font-bold font-display text-surface-50 group-hover:text-primary-400 transition-colors">
              Tutor<span className="text-primary-400">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-surface-300 hover:text-surface-100 hover:bg-surface-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800 border border-surface-700">
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <span className="text-surface-200 font-medium">{user?.name?.split(' ')[0]}</span>
                    <span className="ml-1.5 badge badge-primary text-[10px] py-0">{user?.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-surface-300 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-surface-700/50 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-surface-300 hover:text-surface-100 hover:bg-surface-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-surface-700/50 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-surface-400">
                      Signed in as <span className="text-surface-200 font-medium">{user?.name}</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm mx-4">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary btn-sm mx-4">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm mx-4">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
