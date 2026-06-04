import axios from 'axios';

// Khởi tạo instance axios với cấu hình mặc định
const http = axios.create({
  baseURL: 'http://localhost:8080/api', // Địa chỉ BE của bạn
  timeout: 10000,
});

// Bạn có thể thêm Interceptor ở đây nếu cần truyền Token sau này
http.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
