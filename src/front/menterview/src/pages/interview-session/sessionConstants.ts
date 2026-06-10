export const SESSION_CONSTANTS = {
  WS_CONFIG: {
    MAX_RECONNECT_ATTEMPTS: 8,
    RECONNECT_DELAY_BASE: 500,
    COUNTDOWN_DURATION: 10,
    COUNTDOWN_INTERVAL: 1000,
  },
  WS_EVENTS: {
    QUESTION: 'question',
    SESSION_FINISHED: 'session_finished',
    SESSION_STARTED: 'session_started',
    ANSWER_FEEDBACK: 'answer_feedback',
    QUESTION_TIMEOUT: 'question_timeout',
  },
  WS_CLOSE_CODES: {
    UNAUTHORIZED: 1008,
  },
} as const;

export const SESSION_TEXT = {
  INTERVIEW_SESSION: 'Interview session',
  END_SESSION: 'End session',
  CONNECTING: 'Connecting to session…',
  WAITING_FOR_QUESTION: 'Waiting for question…',
  FAILED_TO_CONNECT: 'Failed to connect to the interview session.',
  START_NEW_SESSION: 'Start a new session',
  INTERVIEW_COMPLETE: 'Interview complete!',
  ANSWERS_EVALUATED: 'Your answers have been evaluated by AI.',
  VIEW_RESULTS: 'View results',
  QUESTION_PREFIX: 'Question',
  REPHRASED_BADGE: 'Rephrased by AI',
  AI_FEEDBACK: 'AI feedback',
  ACCURACY: 'Accuracy',
  CORRECTNESS: 'Correctness',
  COMPLETENESS: 'Completeness',
  NEXT_QUESTION_IN: 'Next question in',
  NEXT_QUESTION_READY: 'Next question is ready.',
  WAITING_NEXT: 'Waiting for next question...',
  NEXT_BUTTON: 'Next question',
  ANSWER_PLACEHOLDER: 'Type your answer… (Enter to send, Shift+Enter for new line)',
  SEND_BUTTON: 'Send answer →',
  SENDING_BUTTON: 'Sending…',
  SESSION_DATA_MISSING: 'Session data missing. Cannot connect.',
  FAILED_TO_SEND: 'Failed to send answer. Please try again.',
  SESSION_FAILED: 'Session authorization failed. Please start a new interview.',
  NO_FEEDBACK: 'No feedback returned by AI.',
  TIMEOUT: 'Time limit exceeded for this question.',
} as const;

export const SESSION_STATUS = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;
