import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:8080/api',
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
