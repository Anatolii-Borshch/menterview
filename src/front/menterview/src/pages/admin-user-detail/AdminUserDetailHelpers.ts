export const ADMIN_USER_ROLE_OPTIONS = [
  { roleId: 1, roleName: 'Administrator' },
  { roleId: 2, roleName: 'User' },
] as const;

export const formatJoinedDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
