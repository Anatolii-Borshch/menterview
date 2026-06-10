export const ADMIN_REFERENCE_TEXT = {
  TITLE: 'Entities',
  SUBTITLE: 'Create, update, and delete reference entities used across interviews and profiles.',
  LOADING: 'Loading…',
  NO_ITEMS: 'No items yet.',
  NEW_PLACEHOLDER: (tableName: string) => `New ${tableName.toLowerCase().replace(/s$/, '')} name…`,
  ADD_BUTTON: 'Add',
  SAVE_BUTTON: 'Save',
  CANCEL_BUTTON: 'Cancel',
  DELETE_CONFIRM_MESSAGE: (name: string) =>
    `Delete "${name}"? This may affect existing questions.`,
  DELETE_CONFIRM_TITLE: 'Confirm deletion',
  DELETE_CONFIRM_BUTTON: 'Delete',
  CREATED: 'Created.',
  UPDATED: 'Updated.',
  DELETED: 'Deleted.',
  FAILED_TO_CREATE: 'Failed to create.',
  FAILED_TO_UPDATE: 'Failed to update.',
  FAILED_TO_DELETE: 'Failed to delete.',
  FAILED_TO_LOAD: (tableName: string) => `Failed to load ${tableName}.`,
} as const;

export const TABLE_LABELS = {
  categories: 'Categories',
  difficulties: 'Difficulties',
  levels: 'Levels',
  tags: 'Tags',
  countries: 'Countries',
  languages: 'Languages',
  themes: 'Themes',
  roles: 'Roles',
} as const;

export const ALL_TABLES = [
  'categories',
  'difficulties',
  'levels',
  'tags',
  'countries',
  'languages',
  'themes',
  'roles',
] as const;
