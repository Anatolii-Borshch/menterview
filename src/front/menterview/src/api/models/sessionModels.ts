export interface SessionListItemDto {
  sessionId: string;
  categoryName: string;
  questionsAmount: number;
  totalTime: number;
  score: number;
  createdAt: string;
}

export interface AnswerBreakdownDto {
  questionId: number;
  question: string;
  answer: string;
  aiReply: string;
  correctness: number;
  completeness: number;
  accuracy: number;
  answeringTime: string;
}

export interface SessionDetailsDto {
  sessionId: string;
  categoryName: string;
  questionsAmount: number;
  unansweredCount: number;
  totalTime: number;
  averageCorrectness: number;
  averageCompleteness: number;
  score: number;
  createdAt: string;
  answers: AnswerBreakdownDto[];
}

export interface UserSessionStatsDto {
  trend: SessionTrendPointDto[];
  overallAverageAccuracy: number;
  overallAverageTime: number;
  totalSessionsCount: number;
}

export interface SessionTrendPointDto {
  date: string;
  score: number;
  averageCorrectness: number;
  averageCompleteness: number;
}

export interface StartSessionRequest {
  categoryId?: number;
  levelId?: number;
  difficultyId?: number;
  questionCount: number;
  tagIds?: number[];
  includeWeakTopics?: boolean;
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
