import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh') || '');
  const [user, setUser] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${apiUrl}token/`, { username, password });
      const newToken = response.data.access;
      const newRefreshToken = response.data.refresh;
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('refresh', newRefreshToken);
      localStorage.setItem('user', username);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(username);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
        await axios.post(`${apiUrl}register/`, { username, email, password });
        await login(username, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  const refresh = async () => {
    try {
      const response = await axios.post(`${apiUrl}token/refresh/`, { refresh: refreshToken });
      const newToken = response.data.access;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    setToken('');
    setRefreshToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };


  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      setUser(localStorage.getItem('user'));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);


  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refresh();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            setUser(localStorage.getItem('user'));
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  const value = {
    isAuthenticated,
    token,
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
