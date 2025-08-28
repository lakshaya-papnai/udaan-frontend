import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 3. Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 4. Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/'); // Redirect to homepage on successful login
    } catch (error) {
      console.error('Login failed', error);
      // Here you would set an error state to show the user
    }
  };

  // 5. Register function
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/'); // Redirect to homepage on successful registration
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  // 6. Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
