import axiosInstance from './axiosInstance';
import type { ApiResponse, ApiResponseData } from './models/authModels';
import type {
  CategoryDto,
  DifficultyDto,
  LevelDto,
  TagDto,
  CountryDto,
  LanguageDto,
  ThemeDto,
  RoleDto,
} from './models/referenceModels';

const adminReferenceApi = {
  createCategory: (name: string) =>
    axiosInstance.post<ApiResponseData<CategoryDto>>('/api/admin/reference/categories', { categoryName: name }),
  updateCategory: (id: number, name: string) =>
    axiosInstance.put<ApiResponse>(`/api/admin/reference/categories/${id}`, { categoryName: name }),
  deleteCategory: (id: number) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/reference/categories/${id}`),

  createTag: (name: string) =>
    axiosInstance.post<ApiResponseData<TagDto>>('/api/admin/reference/tags', { tagName: name }),
  updateTag: (id: number, name: string) =>
    axiosInstance.put<ApiResponse>(`/api/admin/reference/tags/${id}`, { tagName: name }),
  deleteTag: (id: number) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/reference/tags/${id}`),

  createDifficulty: (name: string) =>
    axiosInstance.post<ApiResponseData<DifficultyDto>>('/api/admin/reference/difficulties', { difficultyName: name }),
  updateDifficulty: (id: number, name: string) =>
    axiosInstance.put<ApiResponse>(`/api/admin/reference/difficulties/${id}`, { difficultyName: name }),
  deleteDifficulty: (id: number) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/reference/difficulties/${id}`),

  createLevel: (name: string) =>
    axiosInstance.post<ApiResponseData<LevelDto>>('/api/admin/reference/levels', { levelName: name }),
  updateLevel: (id: number, name: string) =>
    axiosInstance.put<ApiResponse>(`/api/admin/reference/levels/${id}`, { levelName: name }),
  deleteLevel: (id: number) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/reference/levels/${id}`),

  createCountry: (name: string) =>
    axiosInstance.post<ApiResponseData<CountryDto>>('/api/admin/reference/countries', { countryName: name }),
  updateCountry: (id: number, name: string) =>
    axiosInstance.put<ApiResponse>(`/api/admin/reference/countries/${id}`, { countryName: name }),
  deleteCountry: (id: number) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/reference/countries/${id}`),

  createLanguage: (name: string) =>
    axiosInstance.post<ApiResponseData<LanguageDto>>('/api/admin/reference/languages', { languageName: name }),
  updateLanguage: (id: number, name: string) =>
    axiosInstance.put<ApiResponse>(`/api/admin/reference/languages/${id}`, { languageName: name }),
  deleteLanguage: (id: number) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/reference/languages/${id}`),

  createRole: (name: string) =>
    axiosInstance.post<ApiResponseData<RoleDto>>('/api/admin/reference/roles', { roleName: name }),
  updateRole: (id: number, name: string) =>
    axiosInstance.put<ApiResponse>(`/api/admin/reference/roles/${id}`, { roleName: name }),
  deleteRole: (id: number) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/reference/roles/${id}`),

  createTheme: (name: string) =>
    axiosInstance.post<ApiResponseData<ThemeDto>>('/api/admin/reference/themes', { themeName: name }),
  updateTheme: (id: number, name: string) =>
    axiosInstance.put<ApiResponse>(`/api/admin/reference/themes/${id}`, { themeName: name }),
  deleteTheme: (id: number) =>
    axiosInstance.delete<ApiResponse>(`/api/admin/reference/themes/${id}`),
};

export default adminReferenceApi;
