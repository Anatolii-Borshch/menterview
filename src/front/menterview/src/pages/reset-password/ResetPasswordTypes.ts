export interface ResetPasswordFormData {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export type ResetPasswordField = keyof ResetPasswordFormData;

export interface ResetPasswordSubmitEvent {
  preventDefault: () => void;
}
