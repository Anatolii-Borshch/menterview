import { QUESTIONS_CONSTANTS } from './QuestionsConstants';

export const parseOptionalInt = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const parsePageNumber = (value: string | null): number => {
  const parsed = Number.parseInt(value ?? '1', 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
};

export const parseTagIds = (value: string | null): number[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => Number.parseInt(entry, 10))
    .filter((entry) => Number.isFinite(entry));
};

export const getTotalPages = (totalCount: number): number =>
  Math.max(1, Math.ceil(totalCount / QUESTIONS_CONSTANTS.PAGE_SIZE));
