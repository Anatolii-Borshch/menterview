import type { CategoryDto, DifficultyDto } from './referenceModels';

export interface SessionListItemDto {
  sessionId: number;
  time: string;
  questionsAmount: number;
  answeredCount: number;
  totalTime: number;
  averageAccuracy: number;
  category: CategoryDto;
  difficulty: DifficultyDto;
}

export interface AnswerBreakdownDto {
  answerId: number;
  questionText: string;
  rephrasedText?: string;
  answerText: string;
  aiReply: string;
  correctness?: number;
  completeness?: number;
  accuracy: number;
  answeringTime: number;
  wasRephrased: boolean;
  wasWeakTopicReview: boolean;
  category: CategoryDto;
  difficulty: DifficultyDto;
}

export interface SessionDetailsDto {
  sessionId: number;
  time: string;
  questionsAmount: number;
  answeredCount: number;
  totalTime: number;
  averageAccuracy: number;
  category: CategoryDto;
  difficulty: DifficultyDto;
  answers: AnswerBreakdownDto[];
}

export interface UserSessionStatsDto {
  trend: SessionTrendPointDto[];
  overallAverageAccuracy: number;
  overallAverageTime: number;
  totalSessionsCount: number;
}

export interface SessionTrendPointDto {
  sessionId: number;
  time: string;
  averageAccuracy: number;
  totalTime: number;
  answeredCount: number;
}

export interface StartSessionRequest {
  categoryId?: number;
  difficultyId?: number;
  questionsAmount: number;
  tagIds?: number[];
  weakTopicRatio?: number;
}

export interface SessionStartedDto {
  sessionId: string;
  sessionToken: string;
  workerWsHost: string;
  workerGrpcHost: string;
  expiresAt: string;
}

export interface FinishSessionRequest {
  sessionId: string;
  totalTime: number;
  answers: {
    questionId: number;
    answer: string;
    aiReply: string;
    correctness: number;
    completeness: number;
    accuracy: number;
    answeringTime: string;
  }[];
  aiGeneratedQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface SessionsQuery {
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
  categoryId?: number;
}

export interface StatsRangeQuery {
  from?: string;
  to?: string;
  granularity?: 'day' | 'week' | 'month';
}
