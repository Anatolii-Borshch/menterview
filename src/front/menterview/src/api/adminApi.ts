import axiosInstance from './axiosInstance';
import type { ApiResponseData, ApiResponse } from './models/authModels';
import type {
  AdminUserListItemDto,
  AdminUserDetailsDto,
  AdminQuestionListItemDto,
  AssignRoleRequest,
  RejectSuggestionRequest,
} from './models/adminModels';
import type { PagedResult } from './models/questionModels';

const adminApi = {
  getUsers: (params: { page?: number; pageSize?: number; search?: string } = {}) =>
    axiosInstance.get<ApiResponseData<PagedResult<AdminUserListItemDto>>>('/api/admin/users', { params }),

  getUser: (userId: string) =>
    axiosInstance.get<ApiResponseData<AdminUserDetailsDto>>(`/api/admin/users/${userId}`),

  assignRole: (userId: string, data: AssignRoleRequest) =>
    axiosInstance.put<ApiResponse>(`/api/admin/users/${userId}/role`, data),

  softDeleteUser: (userId: string) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/users/${userId}`),

  hardDeleteUser: (userId: string) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/users/${userId}/permanent`),

  getPendingQuestions: () =>
    axiosInstance.get<ApiResponseData<PagedResult<AdminQuestionListItemDto>>>('/api/admin/questions/pending'),

  approveQuestion: (suggestionId: number) =>
    axiosInstance.post<ApiResponse>(`/api/admin/questions/${suggestionId}/approve`),

  rejectQuestion: (suggestionId: number, data: RejectSuggestionRequest) =>
    axiosInstance.post<ApiResponse>(`/api/admin/questions/${suggestionId}/reject`, data),
};

export default adminApi;
