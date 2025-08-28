import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/splash-screen-img.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8" // Added px-4 for smaller screens
      style={{ backgroundImage: `url(${bgImage})`}}
    >
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800"> 
          Login
        </h2>

        <div className="mb-5"> 
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6"> 
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="••••••••" //
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold shadow-md transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
