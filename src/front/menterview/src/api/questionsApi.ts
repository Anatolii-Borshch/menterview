import axiosInstance from './axiosInstance';
import type { ApiResponseData } from './models/authModels';
import type {
  QuestionListItemDto,
  QuestionDetailsDto,
  QuestionsQuery,
  SuggestQuestionRequest,
  PagedResult,
} from './models/questionModels';

const questionsApi = {
  getQuestions: (query: QuestionsQuery = {}) =>
    axiosInstance.get<ApiResponseData<PagedResult<QuestionListItemDto>>>('/api/questions', {
      params: query,
    }),

  getQuestion: (questionId: number) =>
    axiosInstance.get<ApiResponseData<QuestionDetailsDto>>(`/api/questions/${questionId}`),

  rephrase: (questionId: number) =>
    axiosInstance.post<ApiResponseData<{ rephrased: string }>>(`/api/questions/${questionId}/rephrase`),

  suggest: (data: SuggestQuestionRequest) =>
    axiosInstance.post<ApiResponseData<number>>('/api/questions/suggest', data),
};

export default questionsApi;
