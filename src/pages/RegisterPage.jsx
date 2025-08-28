import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/splash-screen-img.png';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    register(name, email, password);
  };

  return (
   <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleRegister}
        className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800"> 
          Create an Account
        </h2>

        <div className="mb-5"> {/* Reduced margin bottom */}
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Your name"
            required
          />
        </div>

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
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow-md transition duration-300"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;