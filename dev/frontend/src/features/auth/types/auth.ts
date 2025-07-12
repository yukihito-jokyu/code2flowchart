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

export interface AuthError {
  message: string;
  code?: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}