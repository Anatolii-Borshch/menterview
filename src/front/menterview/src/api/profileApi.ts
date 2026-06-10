import axiosInstance from './axiosInstance';
import type { ApiResponseData } from './models/authModels';
import type {
  UserProfileDto,
  UpdateProfileRequest,
  UpdateCategoryRequest,
  UpdateLevelRequest,
} from './models/profileModels';
import type { ApiResponse } from './models/authModels';

const profileApi = {
  getProfile: () =>
    axiosInstance.get<ApiResponseData<UserProfileDto>>('/api/profile'),

  updateProfile: (data: UpdateProfileRequest) =>
    axiosInstance.put<ApiResponse>('/api/profile', data),

  deleteAccount: () =>
    axiosInstance.delete<ApiResponse>('/api/profile'),

  updateCategory: (data: UpdateCategoryRequest) =>
    axiosInstance.put<ApiResponse>('/api/profile/category', data),

  updateLevel: (data: UpdateLevelRequest) =>
    axiosInstance.put<ApiResponse>('/api/profile/level', data),
};

export default profileApi;
