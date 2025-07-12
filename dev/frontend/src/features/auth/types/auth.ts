export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  token: string;
  message: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}