import type { AnswerBreakdownDto } from '../../api/models/sessionModels';
import { HISTORY_DETAIL_TEXT } from './HistoryDetailConstants';
import {
  formatTime,
  getAnswerCompleteness,
  getAnswerCorrectness,
  getAnswerSafeText,
  getCorrectnessColorClassName,
} from './HistoryDetailHelpers';

interface HistoryDetailAnswerItemProps {
  answer: AnswerBreakdownDto;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

export const HistoryDetailAnswerItem = ({
  answer,
  index,
  isExpanded,
  onToggle,
}: HistoryDetailAnswerItemProps) => {
  const correctness = getAnswerCorrectness(answer);
  const completeness = getAnswerCompleteness(answer);
  const correctnessClassName = getCorrectnessColorClassName(correctness);
  const answerText = getAnswerSafeText(answer.answerText);

  return (
    <div className="overflow-hidden rounded-xl border border-periwinkle bg-white">
      <button
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
        onClick={() => onToggle(index)}
      >
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm text-navy">{answer.questionText}</p>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="text-xs text-navy/40">{formatTime(answer.answeringTime)}</span>
            <span className={`text-xs font-medium ${correctnessClassName}`}>
              {`${correctness}${HISTORY_DETAIL_TEXT.CORRECT_SUFFIX}`}
            </span>
          </div>
        </div>
        <svg
          className={`mt-0.5 h-4 w-4 shrink-0 text-navy/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-4 border-t border-periwinkle p-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-navy/40">{HISTORY_DETAIL_TEXT.YOUR_ANSWER}</p>
            {answerText ? (
              <p className="text-sm text-navy">{answerText}</p>
            ) : (
              <span className="text-sm italic text-navy/30">{HISTORY_DETAIL_TEXT.NO_ANSWER_PROVIDED}</span>
            )}
          </div>

          {answer.aiReply && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-navy/40">{HISTORY_DETAIL_TEXT.AI_FEEDBACK}</p>
              <p className="text-sm text-navy/80">{answer.aiReply}</p>
            </div>
          )}

          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-navy">{correctness}%</p>
              <p className="text-xs text-navy/40">{HISTORY_DETAIL_TEXT.CORRECTNESS}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-navy">{completeness}%</p>
              <p className="text-xs text-navy/40">{HISTORY_DETAIL_TEXT.COMPLETENESS}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-navy">{answer.accuracy}%</p>
              <p className="text-xs text-navy/40">{HISTORY_DETAIL_TEXT.ACCURACY}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
