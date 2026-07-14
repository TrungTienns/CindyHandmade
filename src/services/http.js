import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api',
  timeout: 120000, 
  withCredentials: true, 
});

http.interceptors.request.use(
  config => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        // Ignore parse error
      }
    }

  
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
