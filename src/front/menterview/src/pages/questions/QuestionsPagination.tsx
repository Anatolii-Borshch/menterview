import { QUESTIONS_TEXT } from './QuestionsConstants';
import type { QuestionsPaginationProps } from './QuestionsTypes';

export const QuestionsPagination = ({ page, totalPages, onPrevious, onNext }: QuestionsPaginationProps) => (
  <div className="mt-8 flex items-center justify-center gap-2">
    <button
      disabled={page <= 1}
      onClick={onPrevious}
      className="rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy transition-colors hover:border-navy/30 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {QUESTIONS_TEXT.PREV}
    </button>

    <span className="text-sm text-navy/50">
      {QUESTIONS_TEXT.PAGE} {page} {QUESTIONS_TEXT.OF} {totalPages}
    </span>

    <button
      disabled={page >= totalPages}
      onClick={onNext}
      className="rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy transition-colors hover:border-navy/30 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {QUESTIONS_TEXT.NEXT}
    </button>
  </div>
);
