export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface GoogleOAuthUserData {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}
