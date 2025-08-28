import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify'; // Make sure toast is imported

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 3. Check if user is logged in on initial load
  useEffect(() => {
    // Corrected to use 'user' to match your other components
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 4. Login function with error handling
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/'); // Redirect to homepage on successful login
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password.';
      toast.error(message);
    }
  };

  // 5. Register function with error handling
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome, ${data.name}!`);
      navigate('/'); // Redirect to homepage on successful registration
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  // 6. Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </Auth-Context.Provider>
  );
};

// 7. Custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
