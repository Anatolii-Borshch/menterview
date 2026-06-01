import { REGISTER_TEXT } from './RegisterConstants';

export type RegisterStep = 'info' | 'preferences' | 'verify';

export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  categoryId: number;
  levelId: number | undefined;
}

export interface RegisterStepMeta {
  title: string;
  subtitle: string;
}

export const createInitialRegisterForm = (): RegisterFormData => ({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  categoryId: 0,
  levelId: undefined,
});

export const getRegisterStepMeta = (step: RegisterStep, email: string): RegisterStepMeta => {
  if (step === 'info') {
    return {
      title: REGISTER_TEXT.INFO_TITLE,
      subtitle: REGISTER_TEXT.INFO_SUBTITLE,
    };
  }

  if (step === 'preferences') {
    return {
      title: REGISTER_TEXT.PREFERENCES_TITLE,
      subtitle: REGISTER_TEXT.PREFERENCES_SUBTITLE,
    };
  }

  return {
    title: REGISTER_TEXT.VERIFY_TITLE,
    subtitle: `We sent a 6-digit code to ${email}`,
  };
};

export const getStepDotClassName = (isCurrent: boolean, isDone: boolean) => {
  if (isCurrent) {
    return 'w-6 bg-cornflower';
  }

  if (isDone) {
    return 'w-4 bg-navy/30';
  }

  return 'w-4 bg-periwinkle';
};

export const updateRegisterFormField = (
  form: RegisterFormData,
  field: keyof RegisterFormData,
  value: string | number | undefined,
): RegisterFormData => ({
  ...form,
  [field]: value,
});
