export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return minLength && hasUpperCase && hasNumber;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export const isEmptyObject = (obj: unknown): boolean => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).length === 0
  );
};

export const isValidLength = (
  value: string | unknown[],
  min?: number,
  max?: number
): boolean => {
  const length = Array.isArray(value) || typeof value === 'string'
    ? value.length
    : 0;

  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;

  return true;
};
