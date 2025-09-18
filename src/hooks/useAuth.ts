import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { User, LoginCredentials, SignupCredentials, GoogleOAuthUserData } from '../lib/types/auth';
import { useToastActions } from './useToastActions';

export const useAuth = () => {
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useToastActions();
  
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user_info');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(credentials);
      
      // Store token and user info in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_info', JSON.stringify(response.user));
      
      setUser(response.user);
      showSuccess('Login Successful', `Welcome back, ${response.user.name}!`);
      router.push('/');
      
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      showError('Login Failed', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.signup(credentials);
      
      // Show success message about email verification
      showSuccess(
        'Account Created!', 
        'Please check your email and click the verification link to complete your registration.',
        8000 // 8 seconds
      );
      
      // Redirect to login page with a message
      setTimeout(() => {
        showInfo(
          'Check Your Email', 
          'We sent a verification link to your email address. Please verify to login.',
          10000
        );
        router.push('/login');
      }, 2000);
      
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup';
      setError(errorMessage);
      showError('Signup Failed', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.verifyEmail(token);
      
      // Store token and user info in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_info', JSON.stringify(response.user));
      
      setUser(response.user);
      showSuccess('Email Verified!', `Welcome to Jubili, ${response.user.name}!`);
      
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Email verification failed';
      setError(errorMessage);
      showError('Verification Failed', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    showInfo('Logged Out', 'You have been successfully logged out.');
    router.push('/login');
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };

  const getUserId = () => {    
    if (user) {
      return user.userId;
    }
    return null;
  };

  const loginWithGoogle = () => {
    try {
      authService.loginWithGoogle();
    } catch (error) {
      console.error('Google OAuth initiation failed:', error);
      showError('Authentication Error', 'Failed to start Google login');
    }
  };

  const handleOAuthSuccess = async (token: string, userData: GoogleOAuthUserData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = authService.handleOAuthSuccess(token, userData);
      
      // Store token and user info in localStorage (same as normal login)
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_info', JSON.stringify(response.user));
      
      setUser(response.user);
      showSuccess('Login Successful', `Welcome, ${response.user.name}!`);
      
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'OAuth login failed';
      setError(errorMessage);
      showError('Login Failed', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token: getToken(),
    userId: getUserId(),
    loading,
    error,
    login,
    signup,
    verifyEmail,
    logout,
    loginWithGoogle,
    handleOAuthSuccess,
  };
};