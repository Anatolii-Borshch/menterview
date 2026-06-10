import type { SessionStateProps } from './sessionTypes';

export const SessionStatusMessage = ({ message }: SessionStateProps) => {
  if (!message) return null;

  return (
    <div className="w-full mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
      {message}
    </div>
  );
};
