export const QUESTIONS_CONSTANTS = {
  PAGE_SIZE: 15,
  SKELETON_ITEMS: 6,
} as const;

export const QUESTIONS_TEXT = {
  TITLE: 'Questions',
  SUGGEST_QUESTION: '+ Suggest a question',
  SEARCH_PLACEHOLDER: 'Search questions…',
  ALL_CATEGORIES: 'All categories',
  ALL_DIFFICULTIES: 'All difficulties',
  TAGS: 'Tags',
  CLEAR_FILTERS: 'Clear filters',
  LOADING: 'Loading…',
  NO_QUESTIONS_FOUND: 'No questions found',
  DELETE: 'Delete',
  DELETING: 'Deleting…',
  DELETE_CONFIRM_MESSAGE: 'Delete this question?',
  DELETE_CONFIRM_TITLE: 'Confirm deletion',
  DELETE_CONFIRM_ACTION: 'Delete',
  QUESTION_DELETED: 'Question deleted.',
  DELETE_FAILED: 'Failed to delete question.',
  PREV: '← Prev',
  NEXT: 'Next →',
  PAGE: 'Page',
  OF: 'of',
} as const;

export const QUESTION_DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'text-green-600 bg-green-50 border-green-100',
  Medium: 'text-yellow-600 bg-yellow-50 border-yellow-100',
  Hard: 'text-red-600 bg-red-50 border-red-100',
};
