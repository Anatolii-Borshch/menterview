export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

export const fromCamelCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const removeWhitespace = (str: string): string => {
  return str.replace(/\s/g, '');
};

export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || !str.trim();
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]/g, '-')
    .replace(/-+/g, '-');
};
