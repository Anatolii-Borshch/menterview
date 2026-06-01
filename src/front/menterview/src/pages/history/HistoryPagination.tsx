import { HISTORY_TEXT } from './HistoryConstants';
import type { HistoryPaginationProps } from './HistoryTypes';

export const HistoryPagination = ({ page, totalPages, onPrevious, onNext }: HistoryPaginationProps) => (
  <div className="flex items-center justify-center gap-3">
    <button
      disabled={page <= 1}
      onClick={onPrevious}
      className="rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy transition-colors hover:border-navy/30 disabled:opacity-40"
    >
      {HISTORY_TEXT.PREV}
    </button>
    <span className="text-sm text-navy/50">
      {HISTORY_TEXT.PAGE_PREFIX} {page} {HISTORY_TEXT.PAGE_OF} {totalPages}
    </span>
    <button
      disabled={page >= totalPages}
      onClick={onNext}
      className="rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy transition-colors hover:border-navy/30 disabled:opacity-40"
    >
      {HISTORY_TEXT.NEXT}
    </button>
  </div>
);
