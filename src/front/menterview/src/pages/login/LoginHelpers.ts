import type { LoginFormData, LoginLocationState } from './LoginTypes';

export const createInitialLoginForm = (): LoginFormData => ({
  email: '',
  password: '',
});

export const getLoginSuccessMessage = (state: LoginLocationState | null): string | undefined => state?.message;

export const updateLoginFormField = (
  form: LoginFormData,
  field: keyof LoginFormData,
  value: string,
): LoginFormData => ({
  ...form,
  [field]: value,
});
