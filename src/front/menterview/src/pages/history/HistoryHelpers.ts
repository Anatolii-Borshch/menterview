import { HISTORY_CONSTANTS } from './HistoryConstants';

export const getHistoryPageFromSearchParam = (value: string | null): number => {
  const parsed = Number.parseInt(value ?? '1', 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
};

export const getHistoryTotalPages = (totalCount: number): number =>
  Math.max(1, Math.ceil(totalCount / HISTORY_CONSTANTS.PAGE_SIZE));

export const formatSessionDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const formatSessionDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const getAccuracyBadgeClass = (accuracy: number): string => {
  if (accuracy >= 80) {
    return 'bg-green-50 text-green-700';
  }

  if (accuracy >= 60) {
    return 'bg-yellow-50 text-yellow-700';
  }

  return 'bg-red-50 text-red-600';
};
