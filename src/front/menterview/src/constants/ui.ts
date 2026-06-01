/**
 * UI component constants and configuration
 * Toast messages, pagination, defaults, etc.
 */

export const TOAST_CONFIG = {
  POSITION: 'top-right' as const,
  AUTO_CLOSE: 4000,
  HIDE_PROGRESS_BAR: false,
  NEWEST_ON_TOP: true,
  CLOSE_ON_CLICK: true,
  PAUSE_ON_HOVER: true,
  THEME: 'light' as const,
  TOAST_CLASS: '!font-sans !text-sm !text-navy !rounded-xl !border !border-periwinkle !shadow-sm',
} as const;

export const MESSAGES = {
  // Auth messages
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully',
    SIGNING_IN: 'Signing in...',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Account created successfully',
    PASSWORD_RESET_SENT: 'Password reset link sent to your email',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  },

  // Loading
  LOADING: 'Loading…',
  SUBMITTING: 'Submitting...',

  // Empty states
  EMPTY: {
    NO_SESSIONS: 'No sessions yet',
    NO_QUESTIONS: 'No questions found',
    NO_USERS: 'No users found',
  },

  // Buttons/Actions
  BUTTONS: {
    SIGN_IN: 'Sign in',
    SIGNING_IN: 'Signing in...',
    SIGN_UP: 'Sign up',
    SIGNING_UP: 'Signing up...',
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    EDIT: 'Edit',
    SAVE: 'Save',
    START_INTERVIEW: 'Start Interview',
    BROWSE_QUESTIONS: 'Browse Questions',
    VIEW_ALL: 'View all →',
  },

  // Validation
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    INVALID_EMAIL: 'Invalid email address',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DASHBOARD_SESSIONS_LIMIT: 3,
  QUESTIONS_PER_PAGE: 20,
  USERS_PER_PAGE: 15,
} as const;

export const ANIMATION = {
  TOAST_AUTO_CLOSE_TIME: 4000,
  DEBOUNCE_DELAY: 300,
  SEARCH_DEBOUNCE_DELAY: 500,
} as const;

export const STAT_CARD_LABELS = {
  SESSIONS_DONE: 'Sessions done',
  AVG_SCORE: 'Avg. score',
  FOCUS_AREA: 'Focus area',
  LEVEL: 'Level',
  DEFAULT_STAT: '—',
  NOT_SET: 'Not set',
  TOTAL: 'total',
  LAST_3_SESSIONS: 'last 3 sessions',
  CATEGORY: 'category',
  CURRENT_LEVEL: 'current level',
} as const;

export const HOME_PAGE = {
  BETA_LABEL: 'Now in beta',
  HERO_TITLE: 'Ace your next ',
  HERO_TITLE_ITALIC: 'technical',
  HERO_TITLE_CONTINUED: ' interview',
  HERO_SUBTITLE: 'Practice real interview questions, track your progress, and land the job you deserve.',
  CTA_START: 'Start for free',
  CTA_BROWSE: 'Browse problems',
  STATS: [
    { value: '2,400+', label: 'Problems' },
    { value: '180K+', label: 'Active users' },
    { value: '94%', label: 'Success rate' },
  ],
} as const;

export const FORMAT = {
  DATE_OPTIONS: {
    month: 'short' as const,
    day: 'numeric' as const,
  },
  LOCALE: 'en-US',
} as const;
