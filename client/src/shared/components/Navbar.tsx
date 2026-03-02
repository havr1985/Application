import { type FC, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  useAuthActions,
  useIsAuthenticated,
  useUser,
} from '../../features/auth/store/auth.selectors';
import Logo from '../../assets/logo.svg';
import { LogOut, User } from 'lucide-react';

export const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-accent-600'
        : 'text-text-secondary hover:text-text-primary'
    }`;

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex shrink-0 items-center">
            <img src={Logo} alt="EventHub" className="h-8 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className={navLinkClass('/')}>
              Events
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/my-events" className={navLinkClass('/my-events')}>
                  My Events
                </Link>
                <Link to="/events/create" className="btn-accent text-sm">
                  + Create Event
                </Link>
              </>
            )}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <>
                <span className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <User />
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-text-tertiary transition-colors hover:text-danger-500 cursor-pointer"
                  title="Logout"
                >
                  <LogOut />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-outline text-sm">
                  Log in
                </Link>
                <Link to="/register" className="btn-accent text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className={navLinkClass('/')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-events"
                    className={navLinkClass('/my-events')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Events
                  </Link>
                  <Link
                    to="/events/create"
                    className="btn-accent text-center text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    + Create Event
                  </Link>
                  <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm text-text-secondary">
                      {user?.name}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm font-medium text-danger-500"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-1 flex flex-col gap-2 border-t border-border pt-3">
                  <Link
                    to="/login"
                    className="btn-outline text-center text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="btn-accent text-center text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
