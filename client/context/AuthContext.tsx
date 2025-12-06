import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use lazy initialization to set state synchronously from localStorage
  // This prevents the "flash of unauthenticated content" or redirects on reload
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const token = localStorage.getItem('admin_token');
      const email = localStorage.getItem('admin_email');
      if (token && email) {
        return { token, email };
      }
    } catch (e) {
      console.error("Failed to access local storage", e);
    }
    return null;
  });

  const login = (token: string, email: string) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_email', email);
    setUser({ token, email });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};