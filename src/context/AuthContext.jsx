import React, { createContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const userData = await loginApi(email, password);
      setUser(userData);
      
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
      
      return userData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const userData = await registerApi(name, email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Default remember on register
      return userData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin và thử lại.';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

