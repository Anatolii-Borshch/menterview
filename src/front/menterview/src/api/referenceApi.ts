import axiosInstance from './axiosInstance';
import type { ApiResponseData } from './models/authModels';
import type { CategoryDto, DifficultyDto, LevelDto, TagDto, CountryDto, LanguageDto, ThemeDto, RoleDto } from './models/referenceModels';

const referenceApi = {
  getCategories: () =>
    axiosInstance.get<ApiResponseData<CategoryDto[]>>('/api/reference/categories'),

  getDifficulties: () =>
    axiosInstance.get<ApiResponseData<DifficultyDto[]>>('/api/reference/difficulties'),

  getLevels: () =>
    axiosInstance.get<ApiResponseData<LevelDto[]>>('/api/reference/levels'),

  getTags: () =>
    axiosInstance.get<ApiResponseData<TagDto[]>>('/api/reference/tags'),

  getCountries: () =>
    axiosInstance.get<ApiResponseData<CountryDto[]>>('/api/reference/countries'),

  getLanguages: () =>
    axiosInstance.get<ApiResponseData<LanguageDto[]>>('/api/reference/languages'),

  getThemes: () =>
    axiosInstance.get<ApiResponseData<ThemeDto[]>>('/api/reference/themes'),

  getRoles: () =>
    axiosInstance.get<ApiResponseData<RoleDto[]>>('/api/reference/roles'),
};

export default referenceApi;
