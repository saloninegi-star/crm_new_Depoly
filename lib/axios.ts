import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kongos-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 15000 se badha kar 60000 (60 seconds) kar diya gaya hai Render wake-up ke liye
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