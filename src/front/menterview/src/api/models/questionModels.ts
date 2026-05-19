import type { TagDto } from './referenceModels';

export interface QuestionListItemDto {
  questionId: number;
  question: string;
  categoryId: number;
  categoryName: string;
  difficultyId: number;
  difficultyName: string;
  tags: TagDto[];
}

export interface QuestionDetailsDto extends QuestionListItemDto {
  answer: string;
}

export interface QuestionsQuery {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  difficultyId?: number;
  levelId?: number;
  tagIds?: number[];
  search?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SuggestQuestionRequest {
  questionText: string;
  answer: string;
  categoryId: number;
  difficultyId: number;
  tagIds?: number[];
}
