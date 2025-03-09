import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SpriteSheet } from '../utils/spriteSheet';

// Import avatar sprite sheet
const avatarSheetSrc = '/avatars.jpg';
const avatarSheet = new SpriteSheet(avatarSheetSrc, 64, 64, 5, 3);

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user data from localStorage on component mount and route change
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (userData && isAuthenticated === 'true') {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  }, [location.pathname]); // Re-check on route change

  // Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('userData');
      localStorage.setItem('isAuthenticated', 'false');
      setUser(null);
      setDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              WebApp
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            <Link 
              to="/dashboard" 
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/users" 
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Users
            </Link>
            {/* Add more navigation links as needed */}
          </div>

          {/* User Avatar or Login Button */}
          <div className="ml-6 flex items-center">
            {user ? (
              <div className="relative">
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center cursor-pointer"
                >
                  <span className="mr-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user.first_name || user.name?.split(' ')[0] || 'User'}
                  </span>
                  <div 
                    className="h-8 w-8 rounded-full overflow-hidden"
                    style={avatarSheet.getSpriteCss(user.avatarIndex || 0)}
                  ></div>
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-10">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              location.pathname !== '/login' ? (
                <Link 
                  to="/login"
                  className="flex items-center"
                >
                  <span className="mr-2 text-sm font-medium text-gray-700 hidden md:block">
                    Sign in
                  </span>
                  {/* Gray circle placeholder */}
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;