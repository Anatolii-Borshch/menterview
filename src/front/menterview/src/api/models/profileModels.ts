import type { CategoryDto, DifficultyDto, LevelDto } from './referenceModels';

export interface UserSettingsDto {
  theme: { themeId: number; themeName: string };
  language: { languageId: number; languageName: string };
  country: { countryId: number; countryName: string };
}

export interface UserProfileDto {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  category: CategoryDto;
  difficulty: DifficultyDto;
  level: LevelDto | null;
  role: { roleId: number; roleName: string };
  settings: UserSettingsDto | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface UpdateCategoryRequest {
  categoryId: number;
}

export interface UpdateLevelRequest {
  levelId: number;
}
