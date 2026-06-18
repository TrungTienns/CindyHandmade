import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api',
  timeout: 10000,
});

http.interceptors.request.use(
  config => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default http;
