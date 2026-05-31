import axiosInstance from './axiosInstance';
import type { ApiResponseData } from './models/authModels';
import type {
  QuestionListItemDto,
  QuestionDetailsDto,
  QuestionsQuery,
  SuggestQuestionRequest,
  CheckAnswerRequest,
  CheckAnswerResponse,
  PagedResult,
} from './models/questionModels';

const questionsApi = {
  getQuestions: (query: QuestionsQuery = {}) =>
    axiosInstance.get<ApiResponseData<PagedResult<QuestionListItemDto>>>('/api/questions', {
      params: query,
      paramsSerializer: {
        serialize: (params) => {
          const serialized = new URLSearchParams();

          Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') return;

            if (Array.isArray(value)) {
              value.forEach((item) => serialized.append(key, String(item)));
              return;
            }

            serialized.append(key, String(value));
          });

          return serialized.toString();
        },
      },
    }),

  getQuestion: (questionId: number) =>
    axiosInstance.get<ApiResponseData<QuestionDetailsDto>>(`/api/questions/${questionId}`),

  rephrase: (questionId: number) =>
    axiosInstance.post<ApiResponseData<{ rephrased: string }>>(`/api/questions/${questionId}/rephrase`),

  checkAnswer: (questionId: number, data: CheckAnswerRequest) =>
    axiosInstance.post<ApiResponseData<CheckAnswerResponse>>(`/api/questions/${questionId}/check-answer`, data),

  suggest: (data: SuggestQuestionRequest) =>
    axiosInstance.post<ApiResponseData<number>>('/api/questions/suggest', data),
};

export default questionsApi;
