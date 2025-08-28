import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Ticket } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-50 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
              Udaan
            </h1>
          </Link>

          {/* User Info Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Link to="/my-bookings" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <Ticket size={18} />
                  <span className="hidden sm:inline">My Bookings</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-800 font-semibold text-sm hidden md:block">
                    {user.name}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 font-semibold text-sm shadow-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 sm:px-4 py-2 text-slate-700 hover:text-blue-600 font-medium transition-colors duration-300 text-sm">Login</Link>
                <Link to="/register" className="px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-md text-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
