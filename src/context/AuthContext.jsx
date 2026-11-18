import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  signIn,
  signUp,
  signOut,
  resetPassword,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true;
    async function initAuth() {
      try {
        const current = await getCurrentUser();
        if (isMounted && current) {
          setUser(current);
          setProfile(current.profile || { role: 'user', full_name: current.user_metadata?.full_name });
        }
      } catch (err) {
        console.error('Auth initialization error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ email, password }) => {
    setError(null);
    try {
      const res = await signIn({ email, password });
      setUser(res.user);
      setProfile(res.profile);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const signup = async ({ email, password, fullName }) => {
    setError(null);
    try {
      const res = await signUp({ email, password, fullName });
      setUser(res.user);
      setProfile(res.profile || { role: 'user', full_name: fullName });
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const handleForgotPassword = async (email) => {
    return resetPassword(email);
  };

  const isAdmin = profile?.role === 'admin';
  const isAuthenticated = Boolean(user);

  const value = {
    user,
    profile,
    isAdmin,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
    forgotPassword: handleForgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
