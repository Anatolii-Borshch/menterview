import axiosInstance from './axiosInstance';
import type { ApiResponseData } from './models/authModels';
import type { CategoryDto, DifficultyDto, LevelDto, TagDto } from './models/referenceModels';

const referenceApi = {
  getCategories: () =>
    axiosInstance.get<ApiResponseData<CategoryDto[]>>('/api/reference/categories'),

  getDifficulties: () =>
    axiosInstance.get<ApiResponseData<DifficultyDto[]>>('/api/reference/difficulties'),

  getLevels: () =>
    axiosInstance.get<ApiResponseData<LevelDto[]>>('/api/reference/levels'),

  getTags: () =>
    axiosInstance.get<ApiResponseData<TagDto[]>>('/api/reference/tags'),
};

export default referenceApi;
