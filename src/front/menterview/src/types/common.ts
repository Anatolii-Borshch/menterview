export type ColorVariant = 'navy' | 'cornflower' | 'periwinkle' | 'snow' | 'white';

export interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
}

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface ErrorResponse {
  message: string;
  errors?: string[];
}

export interface SuccessResponse<T> {
  data: T;
  message?: string;
}

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children?: React.ReactNode;
}

export interface WithId {
  id: string | number;
}
