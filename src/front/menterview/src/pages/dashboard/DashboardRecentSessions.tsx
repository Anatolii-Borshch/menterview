import { Link } from 'react-router-dom';
import { ROUTES, COLORS, FONTS, MESSAGES } from '../../constants';
import { formatTime, formatDate } from '../../utils';
import { getAccuracyColor } from './dashboardHelpers';
import type { DashboardSessionItem } from './dashboardTypes';

interface DashboardRecentSessionsProps {
  sessions: DashboardSessionItem[];
}

export const DashboardRecentSessions = ({ sessions }: DashboardRecentSessionsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-navy" style={FONTS.SERIF_DISPLAY}>
          Recent sessions
        </h2>
        <Link to={ROUTES.HISTORY} className="text-sm text-cornflower hover:underline">
          {MESSAGES.BUTTONS.VIEW_ALL}
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className={`${COLORS.BG_SECONDARY} ${COLORS.BORDER_PRIMARY} rounded-2xl p-8 text-center border`}>
          <p className={`${COLORS.TEXT_LIGHT} text-sm mb-3`}>{MESSAGES.EMPTY.NO_SESSIONS}</p>
          <Link
            to={ROUTES.INTERVIEW.START}
            className={`inline-block ${COLORS.BG_PRIMARY} text-white text-sm px-4 py-2 rounded-lg hover:bg-cornflower transition-colors`}
          >
            {MESSAGES.BUTTONS.START_INTERVIEW}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((ses) => {
            const accuracyColor = getAccuracyColor(ses.averageAccuracy);
            return (
              <Link
                key={ses.sessionId}
                to={ROUTES.HISTORY_DETAIL(ses.sessionId)}
                className={`block ${COLORS.BG_SECONDARY} ${COLORS.BORDER_PRIMARY} rounded-xl p-4 ${COLORS.BORDER_HOVER} transition-colors border`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy">
                      {ses.category?.categoryName ?? 'Category'}
                    </p>
                    <p className={`text-xs ${COLORS.TEXT_LIGHT} mt-0.5`}>
                      {ses.questionsAmount} questions · {formatTime(ses.totalTime)} · {formatDate(ses.time)}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${accuracyColor.bgClass} ${accuracyColor.textClass}`}
                  >
                    {Math.round(ses.averageAccuracy)}%
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
