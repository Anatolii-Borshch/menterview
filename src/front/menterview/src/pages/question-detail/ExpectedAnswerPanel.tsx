import { QUESTION_DETAIL_TEXT } from './QuestionDetailConstants';
import type { ExpectedAnswerPanelProps } from './QuestionDetailTypes';

export const ExpectedAnswerPanel = ({
  answer,
  showAnswer,
  onToggleShowAnswer,
}: ExpectedAnswerPanelProps) => (
  <div className="border-t border-periwinkle pt-6">
    <button
      onClick={onToggleShowAnswer}
      className="flex items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-cornflower"
    >
      <svg
        className={`h-4 w-4 transition-transform ${showAnswer ? 'rotate-90' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      {showAnswer ? QUESTION_DETAIL_TEXT.HIDE_ANSWER : QUESTION_DETAIL_TEXT.SHOW_ANSWER}
    </button>

    {showAnswer && (
      <div className="mt-4 whitespace-pre-wrap rounded-xl border border-periwinkle bg-snow p-4 text-sm leading-relaxed text-navy">
        {answer}
      </div>
    )}
  </div>
);
