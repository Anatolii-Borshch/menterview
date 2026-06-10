export const INTERVIEW_START_CONSTANTS = {
  QUESTION_AMOUNTS: [5, 10, 15, 20, 25, 30],
  RANGE_MIN: 5,
  RANGE_MAX: 30,
  RANGE_STEP: 5,
  WEAK_TOPIC_RATIO: 0.3,
} as const;

export const INTERVIEW_START_TEXT = {
  TITLE: 'Configure interview',
  DESCRIPTION: 'Customise your mock session before starting.',
  LOADING_OPTIONS: 'Loading options…',
  CATEGORY: 'Category',
  DIFFICULTY: 'Difficulty',
  ANY: 'Any',
  QUESTIONS_PREFIX: 'Number of questions:',
  WEAK_TOPICS: 'Focus on weak topics',
  STARTING: 'Starting…',
  START_INTERVIEW: 'Start interview',
  LOAD_FAILED: 'Failed to load options.',
  START_FAILED: 'Failed to start interview. Please try again.',
} as const;
