import { COLORS } from '../../constants';
import { SESSION_TEXT } from './sessionConstants';
import type { SessionAnswerProps } from './sessionTypes';

export const SessionAnswerCard = ({
  answer,
  sending,
  disabled,
  onAnswerChange,
  onSubmit,
  onKeyDown,
}: SessionAnswerProps) => {
  return (
    <div className={`${COLORS.BG_SECONDARY} border ${COLORS.BORDER_PRIMARY} rounded-2xl p-4`}>
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={SESSION_TEXT.ANSWER_PLACEHOLDER}
        rows={5}
        disabled={disabled}
        className="w-full text-sm text-navy focus:outline-none resize-none placeholder:text-navy/30 disabled:opacity-60"
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={onSubmit}
          disabled={sending || !answer.trim() || disabled}
          className={`${COLORS.BG_PRIMARY} hover:bg-cornflower text-white text-sm px-6 py-2 rounded-lg transition-colors disabled:opacity-50`}
        >
          {sending ? SESSION_TEXT.SENDING_BUTTON : SESSION_TEXT.SEND_BUTTON}
        </button>
      </div>
    </div>
  );
};
