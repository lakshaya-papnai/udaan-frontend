import axios from 'axios';

// Get the backend URL from the environment variablesfrom vercel
// VITE_API_URL is the variable we set on Vercel.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export default api;
