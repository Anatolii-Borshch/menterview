export const ADMIN_USERS_CONSTANTS = {
  PAGE_SIZE: 15,
} as const;

export const ADMIN_USERS_TEXT = {
  TITLE: 'Users',
  SUBTITLE: 'Search users, inspect details, manage roles, and apply delete actions.',
  SEARCH_PLACEHOLDER: 'Search by name or email…',
  NO_USERS_FOUND: 'No users found.',
  USER_COLUMN: 'User',
  CATEGORY_COLUMN: 'Category',
  ROLE_COLUMN: 'Role',
  JOINED_COLUMN: 'Joined',
  DETAILS_LINK: 'Details',
  PREVIOUS_PAGE: '← Prev',
  NEXT_PAGE: 'Next →',
  PAGE_OF: (page: number, totalPages: number) => `Page ${page} of ${totalPages}`,
  FAILED_TO_LOAD_USERS: 'Failed to load users.',
} as const;
