import { AuthResponse, LoginCredentials, SignupCredentials, GoogleOAuthUserData } from '../lib/types/auth';
import { API_ENDPOINTS } from '../lib/constants/api';

// New interface for signup response (different from login)
interface SignupResponse {
  message: string;
  email: string;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API URL not found in environment variables');
    }
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const queryParams = new URLSearchParams({
        email: credentials.email,
        password: credentials.password
      });
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}?${queryParams}`, {
        method: 'GET',
        credentials: 'include', // Include cookies
      });      
      if (!response.ok) {
        const error = await response.json(); 
        throw new Error(error.message || 'Failed to login');
      }
      const data: AuthResponse = await response.json();      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async signup(credentials: SignupCredentials): Promise<SignupResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for future requests
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign up');
      }

      const data: SignupResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/verify?token=${token}`, {
        method: 'GET',
        credentials: 'include', // Important for cookies
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Email verification failed');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initiate Google OAuth login by redirecting to backend OAuth endpoint
   */
  loginWithGoogle(): void {
    const oauthUrl = `${this.baseUrl}${API_ENDPOINTS.AUTH.GOOGLE_OAUTH}`;
    window.location.href = oauthUrl;
  }

  /**
   * Handle OAuth success by processing the token and user data from URL params
   */
  handleOAuthSuccess(token: string, userData: GoogleOAuthUserData): AuthResponse {
    try {
      // Parse the user data passed from backend
      const user = {
        userId: userData.userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
      };
      
      return {
        message: 'OAuth login successful',
        user: user,
        token: token
      };
      
    } catch (error) {
      console.error('OAuth success handling error:', error);
      throw new Error('Failed to process OAuth login');
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }
}

export const authService = new AuthService();