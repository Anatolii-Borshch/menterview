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
  question: string;
  answer: string;
  authorEmail: string;
  createdAt: string;
  status: 'PendingReview' | 'Approved' | 'Rejected';
}

export interface AssignRoleRequest {
  roleId: number;
}

export interface RejectSuggestionRequest {
  reason: string;
}
