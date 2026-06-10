import { Link } from 'react-router-dom';
import { HISTORY_TEXT } from './HistoryConstants';
import { getAccuracyBadgeClass } from './HistoryHelpers';
import type { HistorySessionListProps } from './HistoryTypes';

export const HistorySessionList = ({ sessions, onFormatTime, onFormatDate }: HistorySessionListProps) => (
  <div className="mb-6 space-y-3">
    {sessions.map((session) => (
      <Link
        key={session.sessionId}
        to={`/history/${session.sessionId}`}
        className="block rounded-xl border border-periwinkle bg-white p-5 transition-colors hover:border-cornflower/40"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-navy">
              {session.category?.categoryName ?? HISTORY_TEXT.CATEGORY_FALLBACK}
            </p>
            <p className="mt-1 text-xs text-navy/40">
              {session.questionsAmount} questions · {onFormatTime(session.totalTime)} · {onFormatDate(session.time)}
            </p>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-sm font-semibold ${getAccuracyBadgeClass(
              session.averageAccuracy || 0
            )}`}
          >
            {session.averageAccuracy !== undefined && session.averageAccuracy !== null ? `${Math.round(session.averageAccuracy)}%` : '—'}
          </div>
        </div>
      </Link>
    ))}
  </div>
);
