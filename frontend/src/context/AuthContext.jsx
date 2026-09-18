import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cybershield_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cybershield_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('cybershield_user', JSON.stringify(res.data));
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (emailOrCredentials, passwordParam) => {
    const payload = typeof emailOrCredentials === 'object' && emailOrCredentials !== null
      ? emailOrCredentials
      : { email: emailOrCredentials, password: passwordParam };
    const res = await authService.login(payload);
    if (res.success && res.data) {
      const { accessToken, refreshToken, user: userData } = res.data;
      localStorage.setItem('cybershield_token', accessToken);
      localStorage.setItem('cybershield_refresh_token', refreshToken);
      localStorage.setItem('cybershield_user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.success && res.data) {
      const { accessToken, refreshToken, user: userData } = res.data;
      localStorage.setItem('cybershield_token', accessToken);
      localStorage.setItem('cybershield_refresh_token', refreshToken);
      localStorage.setItem('cybershield_user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('cybershield_refresh_token');
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (ignored) {
    } finally {
      localStorage.removeItem('cybershield_token');
      localStorage.removeItem('cybershield_refresh_token');
      localStorage.removeItem('cybershield_user');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ROLE_ADMIN',
    isInvestigator: user?.role === 'ROLE_INVESTIGATOR' || user?.role === 'ROLE_ADMIN',
    isUser: user?.role === 'ROLE_USER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
