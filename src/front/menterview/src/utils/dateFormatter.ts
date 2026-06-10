import { FORMAT } from '../constants/ui';

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
};

export const formatDate = (isoString: string): string => {
  try {
    return new Date(isoString).toLocaleDateString(
      FORMAT.LOCALE,
      FORMAT.DATE_OPTIONS as Intl.DateTimeFormatOptions
    );
  } catch {
    return '';
  }
};

export const formatFullDate = (isoString: string): string => {
  try {
    return new Date(isoString).toLocaleDateString(FORMAT.LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export const formatTime24 = (isoString: string): string => {
  try {
    return new Date(isoString).toLocaleTimeString(FORMAT.LOCALE, {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
