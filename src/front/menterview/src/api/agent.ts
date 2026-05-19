import axiosInstance from "./axiosInstance";
import type {
  ApiResponse,
  ApiResponseData,
  AuthResponse,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "./models/authModels";
import { useAuthStore } from "./useAuthStore";

const authAgent = {
  register: (data: RegisterRequest) =>
    axiosInstance.post<ApiResponse>("/api/auth/register", data),

  verifyEmail: (data: VerifyEmailRequest) =>
    axiosInstance.post<ApiResponse>("/api/auth/register/verify", data),

  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post<ApiResponseData<AuthResponse>>(
      "/api/auth/login",
      data,
    );
    if (response.data.isSuccess) {
      useAuthStore.getState().setAuth(response.data.data);
    }
    return response;
  },

  googleLogin: async (data: GoogleLoginRequest) => {
    const response = await axiosInstance.post<ApiResponseData<AuthResponse>>(
      "/api/auth/login/google",
      data,
    );
    if (response.data.isSuccess) {
      useAuthStore.getState().setAuth(response.data.data);
    }
    return response;
  },

  logout: async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) return;

    const data: LogoutRequest = { refreshToken };
    const response = await axiosInstance.post<ApiResponse>(
      "/api/auth/logout",
      data,
    );
    useAuthStore.getState().clearAuth();
    return response;
  },

  refresh: async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) return;

    const response = await axiosInstance.post<ApiResponseData<AuthResponse>>(
      "/api/auth/refresh",
      { refreshToken },
    );
    if (response.data.isSuccess) {
      useAuthStore.getState().setAuth(response.data.data);
    }
    return response;
  },

  forgotPassword: (data: ForgotPasswordRequest) =>
    axiosInstance.post<ApiResponse>("/api/auth/password/forgot", data),

  resetPassword: (data: ResetPasswordRequest) =>
    axiosInstance.post<ApiResponse>("/api/auth/password/reset", data),
};

const agent = {
  auth: authAgent,
};

export default agent;
