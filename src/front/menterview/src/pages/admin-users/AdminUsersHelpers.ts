export const getRoleBadgeClasses = (role: string): string => {
  const base = 'text-xs border rounded-full px-2.5 py-0.5 font-medium';
  if (role === 'Administrator') {
    return `${base} border-purple-100 bg-purple-50 text-purple-600`;
  }

  return `${base} border-periwinkle text-navy/60`;
};

export const formatUserDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const calculateTotalPages = (totalCount: number, pageSize: number): number => {
  return Math.ceil(totalCount / pageSize);
};
