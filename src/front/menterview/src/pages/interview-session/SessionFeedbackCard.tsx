import { COLORS } from '../../constants';
import { SESSION_TEXT, SESSION_CONSTANTS } from './sessionConstants';
import type { SessionFeedbackProps } from './sessionTypes';

export const SessionFeedbackCard = ({
  feedback,
  countdown,
  pendingNextQuestion,
  onNextQuestion,
}: SessionFeedbackProps) => {
  const nextQuestionMessage =
    countdown !== null
      ? `${SESSION_TEXT.NEXT_QUESTION_IN} ${countdown}s`
      : pendingNextQuestion
        ? SESSION_TEXT.NEXT_QUESTION_READY
        : SESSION_TEXT.WAITING_NEXT;

  return (
    <div className={`${COLORS.BG_SECONDARY} border ${COLORS.BORDER_PRIMARY} rounded-2xl p-4 mb-4`}>
      <p className={`text-xs ${COLORS.TEXT_LIGHT} mb-2`}>{SESSION_TEXT.AI_FEEDBACK}</p>

      {countdown !== null && (
        <div className="w-full h-1.5 bg-periwinkle/30 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-cornflower transition-all duration-1000 ease-linear"
            style={{ width: `${Math.max(0, (countdown / SESSION_CONSTANTS.WS_CONFIG.COUNTDOWN_DURATION) * 100)}%` }}
          />
        </div>
      )}

      <p className="text-sm text-navy mb-3 whitespace-pre-wrap">{feedback.aiReply}</p>

      <div className="flex flex-wrap gap-2 text-xs mb-3">
        {typeof feedback.accuracy === 'number' && (
          <span className={`px-2 py-1 rounded-full border ${COLORS.BORDER_PRIMARY} text-navy/70`}>
            {SESSION_TEXT.ACCURACY}: {feedback.accuracy}%
          </span>
        )}
        {typeof feedback.correctness === 'number' && (
          <span className={`px-2 py-1 rounded-full border ${COLORS.BORDER_PRIMARY} text-navy/70`}>
            {SESSION_TEXT.CORRECTNESS}: {feedback.correctness}%
          </span>
        )}
        {typeof feedback.completeness === 'number' && (
          <span className={`px-2 py-1 rounded-full border ${COLORS.BORDER_PRIMARY} text-navy/70`}>
            {SESSION_TEXT.COMPLETENESS}: {feedback.completeness}%
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className={`text-xs ${COLORS.TEXT_TERTIARY}`}>{nextQuestionMessage}</p>
        <button
          onClick={onNextQuestion}
          disabled={!pendingNextQuestion && countdown === null}
          className={`${COLORS.BG_PRIMARY} hover:bg-cornflower text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50`}
        >
          {SESSION_TEXT.NEXT_BUTTON}
        </button>
      </div>
    </div>
  );
};
