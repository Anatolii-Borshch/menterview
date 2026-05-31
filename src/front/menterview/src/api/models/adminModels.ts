import type { CategoryDto, DifficultyDto, TagDto } from './referenceModels';

export interface AdminUserListItemDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  categoryName: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface AdminUserDetailsDto extends AdminUserListItemDto {
  difficultyName: string;
  levelName: string | null;
  sessionCount: number;
}

export interface AdminQuestionListItemDto {
  suggestionId: number;
  questionText: string;
  type: string;
  submittedByUserId?: string;
  submittedByName?: string;
  createdAt: string;
  status: 'PendingReview' | 'Approved' | 'Rejected';
}

export interface PendingQuestionDetailsDto extends AdminQuestionListItemDto {
  answer: string;
  category: CategoryDto;
  difficulty: DifficultyDto;
  tags: TagDto[];
}

export interface AssignRoleRequest {
  roleId: number;
}

export interface RejectSuggestionRequest {
  rejectionReason?: string;
}

export interface UpdateSuggestionTagsRequest {
  tagIds: number[];
}
