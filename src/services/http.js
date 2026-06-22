import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true, // Send HttpOnly cookies with every request
});

export default http;
