import { Link } from 'react-router-dom';
import type { SessionDetailsDto } from '../../api/models/sessionModels';
import { HISTORY_DETAIL_TEXT } from './HistoryDetailConstants';
import { buildSessionStatItems, formatSessionDate, getScoreColorClassName } from './HistoryDetailHelpers';

interface HistoryDetailHeaderProps {
  session: SessionDetailsDto;
  score: number;
}

export const HistoryDetailHeader = ({ session, score }: HistoryDetailHeaderProps) => {
  const statItems = buildSessionStatItems(session, score);
  const scoreClassName = getScoreColorClassName(score);

  return (
    <>
      <Link to="/history" className="mb-6 inline-block text-sm text-navy/50 hover:text-navy">
        {HISTORY_DETAIL_TEXT.HISTORY_LINK}
      </Link>

      <div className="mb-6 rounded-2xl border border-periwinkle bg-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
              {session.category?.categoryName ?? HISTORY_DETAIL_TEXT.SESSION_FALLBACK_NAME}
            </h1>
            <p className="mt-1 text-sm text-navy/50">{formatSessionDate(session.time)}</p>
          </div>
          <span className={`text-3xl font-bold ${scoreClassName}`}>{score}%</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {statItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-periwinkle bg-snow p-3 text-center">
              <p className="text-lg font-semibold text-navy">{item.value}</p>
              <p className="mt-0.5 text-xs text-navy/40">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
