import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tutorconnect_token'));
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('tutorconnect_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data.user);
          setToken(savedToken);
        } catch {
          // Token invalid — clear
          localStorage.removeItem('tutorconnect_token');
          localStorage.removeItem('tutorconnect_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, token: newToken } = res.data.data;
    localStorage.setItem('tutorconnect_token', newToken);
    localStorage.setItem('tutorconnect_user', JSON.stringify(userData));
    setUser(userData);
    setToken(newToken);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const { user: userData, token: newToken } = res.data.data;
    localStorage.setItem('tutorconnect_token', newToken);
    localStorage.setItem('tutorconnect_user', JSON.stringify(userData));
    setUser(userData);
    setToken(newToken);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tutorconnect_token');
    localStorage.removeItem('tutorconnect_user');
    setUser(null);
    setToken(null);
  }, []);

  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
