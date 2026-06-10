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
