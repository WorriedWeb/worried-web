// client/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from './api';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  // convenience helper that calls backend /auth/login
  loginWithCredentials?: (email: string, password: string) => Promise<void>;
  // refresh user from backend (explicit)
  refreshUser?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const token = localStorage.getItem('admin_token');
      const email = localStorage.getItem('admin_email');
      if (token && email) {
        return { token, email };
      }
    } catch (e) {
      console.error('Failed to access local storage', e);
    }
    return null;
  });

  // core setter used by UI and after login response
  const login = (token: string, email: string) => {
    try {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_email', email);
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
    setUser({ token, email });
  };

  const logout = () => {
    try {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
    } catch (e) {
      console.error('Failed to remove localStorage keys', e);
    }
    setUser(null);
  };

  // fetch current user info from backend (if token exists)
  const refreshUser = async () => {
    try {
      // this endpoint should validate the token and return user info (or 401)
      const data = await api.get<AdminUser>('/api/auth/me');
      // merge token from storage (so AdminUser preserves token/email shape you expect)
      const token = localStorage.getItem('admin_token') || undefined;
      const email = data?.email || localStorage.getItem('admin_email') || undefined;
      setUser({ token: token as string, email: email as string } as AdminUser);
    } catch (err) {
      // If token invalid or request fails, clear auth
      console.warn('refreshUser failed', err);
      logout();
    }
  };

  // Convenience: call backend login and store returned token
  const loginWithCredentials = async (email: string, password: string) => {
    // adjust endpoint and shape according to your backend contract
    const payload = { email, password };
    const res = await api.post<{ token: string; email?: string }>('/api/auth/login', payload);
    if (!res || !res.token) throw new Error('Invalid login response from server');
    // use returned email if provided; otherwise fallback to input email
    login(res.token, res.email || email);
    // optionally refresh user profile
    try {
      await refreshUser();
    } catch {
      /* ignore */
    }
  };

  // On mount, validate token by calling backend once.
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // fire-and-forget but handle errors in refreshUser
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loginWithCredentials,
        refreshUser,
      }}
    >
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
