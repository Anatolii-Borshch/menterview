import axiosInstance from './axiosInstance';
import type { ApiResponseData, ApiResponse } from './models/authModels';
import type {
  StartSessionRequest,
  SessionStartedDto,
  SessionListItemDto,
  SessionDetailsDto,
  UserSessionStatsDto,
  SessionsQuery,
  StatsRangeQuery,
  FinishSessionRequest,
} from './models/sessionModels';
import type { PagedResult } from './models/questionModels';

const interviewApi = {
  start: (data: StartSessionRequest) =>
    axiosInstance.post<ApiResponseData<SessionStartedDto>>('/api/sessions/start', data),

  finish: (data: FinishSessionRequest) =>
    axiosInstance.post<ApiResponse>('/api/sessions/finish', data),

  getSessions: (query: SessionsQuery = {}) =>
    axiosInstance.get<ApiResponseData<PagedResult<SessionListItemDto>>>('/api/sessions', {
      params: query,
    }),

  getSession: (sessionId: string) =>
    axiosInstance.get<ApiResponseData<SessionDetailsDto>>(`/api/sessions/${sessionId}`),

  getStats: (query: StatsRangeQuery = {}) =>
    axiosInstance.get<ApiResponseData<UserSessionStatsDto>>('/api/sessions/stats', {
      params: query,
    }),

  exportPdf: (sessionId: string) =>
    axiosInstance.get(`/api/sessions/${sessionId}/export`, { responseType: 'blob' }),
};

export default interviewApi;
