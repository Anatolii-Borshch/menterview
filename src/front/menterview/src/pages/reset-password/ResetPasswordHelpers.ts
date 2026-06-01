import { RESET_PASSWORD_TEXT } from './ResetPasswordConstants';
import type { ResetPasswordField, ResetPasswordFormData } from './ResetPasswordTypes';

export const createInitialResetPasswordForm = (searchParams: URLSearchParams): ResetPasswordFormData => ({
  email: searchParams.get('email') ?? '',
  token: searchParams.get('token') ?? '',
  newPassword: '',
  confirmPassword: '',
});

export const getResetPasswordSubtitle = (hasLinkedToken: boolean) => {
  if (hasLinkedToken) {
    return RESET_PASSWORD_TEXT.LINKED_TOKEN_SUBTITLE;
  }

  return RESET_PASSWORD_TEXT.MANUAL_TOKEN_SUBTITLE;
};

export const updateResetPasswordField = (
  form: ResetPasswordFormData,
  field: ResetPasswordField,
  value: string,
): ResetPasswordFormData => ({
  ...form,
  [field]: value,
});
