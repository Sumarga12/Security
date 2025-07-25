import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types.ts';
import { useNotification } from './NotificationContext.tsx';
import { authAPI } from '../src/api/auth.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string, rememberMe: boolean) => Promise<boolean | 'mfa'>;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateUser: (userData: User) => void;
  verifyMfa: (email: string, code: string, rememberMe: boolean) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('homeglam_token');
    localStorage.removeItem('homeglam_user');
    localStorage.removeItem('homeglam_login_time');
    sessionStorage.removeItem('homeglam_token');
    sessionStorage.removeItem('homeglam_user');
    sessionStorage.removeItem('homeglam_login_time');
    addNotification('You have been logged out.', 'error');
  }, [addNotification]);

  useEffect(() => {
    try {
        const userStr = localStorage.getItem('homeglam_user') || sessionStorage.getItem('homeglam_user');
        const token = localStorage.getItem('homeglam_token') || sessionStorage.getItem('homeglam_token');
        
        console.log('AuthContext - userStr:', userStr);
        console.log('AuthContext - token:', token);
        
        if (userStr && token) {
            // Set user immediately if we have both user data and token
            console.log('AuthContext - Setting user from storage');
            setUser(JSON.parse(userStr));
        } else {
            console.log('AuthContext - No user data or token found in storage');
        }
    } catch(e) {
        console.error("Failed to get user from storage", e);
        // Don't call authAPI.logout() here as it might cause issues
        setUser(null);
    }
    setLoading(false);
  }, []);

  // Check for session expiration every minute (only for new sessions with timestamps)
  useEffect(() => {
    if (!user) return;

    const checkSessionExpiration = () => {
      const loginTime = localStorage.getItem('homeglam_login_time') || sessionStorage.getItem('homeglam_login_time');
      if (loginTime) {
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        console.log('Session expiration check:', {
          now,
          loginTimestamp,
          timeDiff: now - loginTimestamp,
          oneHour,
          isExpired: now - loginTimestamp > oneHour
        });
        
        if (now - loginTimestamp > oneHour) {
          console.log('Session expired, logging out');
          logout();
          addNotification('Your session has expired. Please log in again.', 'error');
        }
      }
      // If no login time exists (legacy session), don't expire it automatically
    };

    const interval = setInterval(checkSessionExpiration, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, logout, addNotification]);

  const login = useCallback(async (email: string, pass: string, rememberMe: boolean): Promise<boolean | 'mfa'> => {
    setLoading(true);
    try {
        const response = await authAPI.login({ email, password: pass });
        if (response.mfaRequired) {
          addNotification('A verification code has been sent to your email.', 'info');
          setLoading(false);
          return 'mfa';
        }
        setUser(response.user);
        // Store in localStorage or sessionStorage based on rememberMe
        if (response.token) {
          const loginTime = Date.now().toString();
          if (rememberMe) {
            localStorage.setItem('homeglam_token', response.token);
            localStorage.setItem('homeglam_user', JSON.stringify(response.user));
            localStorage.setItem('homeglam_login_time', loginTime);
          } else {
            sessionStorage.setItem('homeglam_token', response.token);
            sessionStorage.setItem('homeglam_user', JSON.stringify(response.user));
            sessionStorage.setItem('homeglam_login_time', loginTime);
          }
        }
        addNotification(`Welcome back, ${response.user.name}!`, 'success');
        setLoading(false);
        return true;
    } catch (error: any) {
        addNotification(error.message || 'Login failed. Please try again.', 'error');
        setLoading(false);
        return false;
    }
  }, [addNotification]);

  const signup = useCallback(async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
        const response = await authAPI.signup({ name, email, password: pass });
        addNotification('Account created successfully! Please log in.', 'success');
        setLoading(false);
        return true;
    } catch (error: any) {
        addNotification(error.message || 'Signup failed. Please try again.', 'error');
        setLoading(false);
        return false;
    }
  }, [addNotification]);



  const changePassword = useCallback(async (oldPass: string, newPass: string): Promise<boolean> => {
    try {
        await authAPI.changePassword({ currentPassword: oldPass, newPassword: newPass });
        addNotification('Password changed successfully!', 'success');
        return true;
    } catch (error: any) {
        addNotification(error.message || 'Password change failed.', 'error');
        return false;
    }
  }, [addNotification]);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    try {
        await authAPI.requestPasswordReset(email);
        addNotification('If an account exists, a reset link has been sent.', 'info');
    } catch (error: any) {
        addNotification(error.message || 'Password reset request failed.', 'error');
    }
  }, [addNotification]);

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('homeglam_user', JSON.stringify(userData));
    sessionStorage.setItem('homeglam_user', JSON.stringify(userData));
  }, []);

  const verifyMfa = useCallback(async (email: string, code: string, rememberMe: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.verifyMfa(email, code);
      setUser(response.user);
      // Store in localStorage or sessionStorage based on rememberMe
      if (response.token) {
        const loginTime = Date.now().toString();
        if (rememberMe) {
          localStorage.setItem('homeglam_token', response.token);
          localStorage.setItem('homeglam_user', JSON.stringify(response.user));
          localStorage.setItem('homeglam_login_time', loginTime);
        } else {
          sessionStorage.setItem('homeglam_token', response.token);
          sessionStorage.setItem('homeglam_user', JSON.stringify(response.user));
          sessionStorage.setItem('homeglam_login_time', loginTime);
        }
      }
      addNotification(`Welcome back, ${response.user.name}!`, 'success');
      setLoading(false);
      return true;
    } catch (error: any) {
      addNotification(error.message || 'Verification failed. Please try again.', 'error');
      setLoading(false);
      return false;
    }
  }, [addNotification]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, changePassword, requestPasswordReset, updateUser,
    verifyMfa,
    }}>
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