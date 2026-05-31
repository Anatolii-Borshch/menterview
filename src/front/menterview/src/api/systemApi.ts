import axiosInstance from './axiosInstance';
import type { ApiResponseData } from './models/authModels';

export interface ApiHealth {
  isHealthy: boolean;
  status: string;
  error?: string;
}

export interface DatabaseHealth {
  isConnected: boolean;
  status: string;
  userCount: number;
  sessionCount: number;
  questionCount: number;
  error?: string;
}

export interface WorkerHealth {
  isHealthy: boolean;
  status: string;
  activeWorkers: number;
  maxWorkers: number;
  error?: string;
}

export interface ManagerHealth {
  isHealthy: boolean;
  status: string;
  error?: string;
}

export interface SystemStatus {
  api: ApiHealth;
  database: DatabaseHealth;
  workers: WorkerHealth;
  manager: ManagerHealth;
  checkedAt: string;
}

export const systemApi = {
  getStatus: async (): Promise<SystemStatus> => {
    const response = await axiosInstance.get<ApiResponseData<SystemStatus>>('/api/admin/system/status');
    return response.data.data;
  },
};
