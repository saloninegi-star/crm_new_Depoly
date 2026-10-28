import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rice-mill-kongos-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, 
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;