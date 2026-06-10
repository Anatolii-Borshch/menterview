import { COLORS } from '../../constants';
import { SESSION_TEXT } from './sessionConstants';
import { getSessionStatusColor } from './sessionHelpers';
import type { SessionHeaderProps } from './sessionTypes';

export const SessionHeader = ({ status, onEndSession }: SessionHeaderProps) => {
  const statusColor = getSessionStatusColor(status);

  return (
    <div className={`${COLORS.BG_SECONDARY} border-b ${COLORS.BORDER_PRIMARY} px-6 py-3 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-navy">{SESSION_TEXT.INTERVIEW_SESSION}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${statusColor.borderClass} ${statusColor.bgClass} ${statusColor.textClass}`}
        >
          {status}
        </span>
      </div>
      <button
        onClick={onEndSession}
        className={`text-xs ${COLORS.TEXT_LIGHT} hover:text-navy transition-colors`}
      >
        {SESSION_TEXT.END_SESSION}
      </button>
    </div>
  );
};
