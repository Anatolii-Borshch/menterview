export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  categoryId: number;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface ApiResponse {
  isSuccess: boolean;
  errors: string[];
}

export interface ApiResponseData<T> extends ApiResponse {
  data: T;
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}