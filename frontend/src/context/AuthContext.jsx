import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh') || '');
    const [followStatus, setFollowStatus] = useState([]);
    const [user, setUser] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
    const headers = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

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
            setUser(username);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
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
    };

    const refresh = useCallback(async () => {
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
    }, [refreshToken]);

    const logout = () => {
        setToken('');
        setRefreshToken('');
        setFollowStatus([]);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
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
                        return axios(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [refresh]);

    useEffect(() => {
        let isMounted = true;
        const fetchFollowStatus = async () => {
            if (!isAuthenticated || !user) return;
            try {
                const response = await axios.get(`${apiUrl}following/${user}/`, { headers });
                console.log('Fetched follow status:', response.data);
                if (isMounted) setFollowStatus(response.data);
            } catch (error) {
                console.error('Error fetching follow status:', error);
            }
        };
        fetchFollowStatus();
        return () => { isMounted = false; };
    }, [isAuthenticated, user, token]);

    const value = {
        isAuthenticated,
        token,
        user,
        followStatus,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

