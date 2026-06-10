import type { HistoryLoadingListProps } from './HistoryTypes';

export const HistoryLoadingList = ({ itemCount }: HistoryLoadingListProps) => (
  <div className="space-y-3">
    {Array.from({ length: itemCount }).map((_, index) => (
      <div
        key={`history-loading-${index + 1}`}
        className="h-20 rounded-xl border border-periwinkle bg-white animate-pulse"
      />
    ))}
  </div>
);
