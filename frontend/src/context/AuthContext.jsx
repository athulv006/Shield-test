import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('badminton_auth_token');
    const savedUser = localStorage.getItem('badminton_user_profile');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('badminton_auth_token');
        localStorage.removeItem('badminton_user_profile');
      }
    }
    setLoading(false);
  }, []);

  const loginWithOtp = async (phone, otp, name) => {
    const data = await api.verifyOtp(phone, otp, name);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('badminton_auth_token', data.token);
      localStorage.setItem('badminton_user_profile', JSON.stringify(data.user));
      return { success: true };
    }
    return { success: false, error: data.error || 'Failed to authenticate' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('badminton_auth_token');
    localStorage.removeItem('badminton_user_profile');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
