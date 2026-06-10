export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  QUESTIONS: '/questions',
  QUESTION_DETAIL: (questionId: string | number) => `/questions/${questionId}`,
  HISTORY: '/history',
  HISTORY_DETAIL: (sessionId: string | number) => `/history/${sessionId}`,
  STATS: '/stats',
  SUGGEST_QUESTION: '/suggest-question',

  INTERVIEW: {
    START: '/interview/start',
    SESSION: (sessionId: string | number) => `/interview/session/${sessionId}`,
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_DETAIL: (userId: string | number) => `/admin/users/${userId}`,
    PENDING_QUESTIONS: '/admin/pending-questions',
    REFERENCES: '/admin/references',
  },
} as const;
