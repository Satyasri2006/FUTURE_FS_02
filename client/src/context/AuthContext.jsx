import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify existing token on backend
          const response = await API.get('/auth/me');
          setUser(response.data.data);
        } catch (error) {
          console.error('[Session Error] Token validation failed:', error.message);
          localStorage.removeItem('token'); // Clear corrupted/expired token
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Submit credentials to obtain JWT
   */
  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token, name, email: userEmail, _id } = response.data.data;
    
    // Persist token in local storage
    localStorage.setItem('token', token);
    setUser({ _id, name, email: userEmail });
    
    return response.data;
  };

  /**
   * Purge session states and tokens
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
