import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import UsersPage from './pages/UsersPage';

const isExtensionContext = window.location.protocol === 'chrome-extension:';

const safeStorage = {
  getItem: (key) => {
    if (isExtensionContext) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage access error:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    if (isExtensionContext) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage access error:', error);
    }
  }
};

// Create a LogoutButton component that will safely use useNavigate
const LogoutButton = ({ setIsAuthenticated }) => {
  // This is now safe because it's used within the Router context
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // First update state
    setIsAuthenticated(false);
    
    // Then update localStorage
    try {
      safeStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('userData');
      
      // Force navigation to refresh the Header component
      navigate('/login');
    } catch (error) {
      console.error('Error clearing authentication:', error);
    }
  };
  
  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Remove the useNavigate hook from here
  
  useEffect(() => {
    try {
      const authStatus = safeStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  }, []);
  
  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header appears on every page */}
        <Header />
        
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <AuthPage setIsAuthenticated={setIsAuthenticated} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                  <div className="bg-white shadow rounded-lg p-6">
                    <p className="mb-4">Welcome to your dashboard!</p>
                    {/* Use the LogoutButton component instead */}
                    <LogoutButton setIsAuthenticated={setIsAuthenticated} />
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;