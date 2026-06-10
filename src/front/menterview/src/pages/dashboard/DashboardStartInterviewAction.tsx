import { Link } from 'react-router-dom';
import { ROUTES, COLORS, MESSAGES } from '../../constants';

const START_INTERVIEW_SUBTITLE = 'Launch an AI-powered mock session';

export const DashboardStartInterviewAction = () => {
  return (
    <Link
      to={ROUTES.INTERVIEW.START}
      className={`group ${COLORS.BG_PRIMARY} hover:bg-cornflower text-white rounded-2xl p-6 flex items-center gap-4 transition-colors`}
    >
      <div className={`w-10 h-10 ${COLORS.WHITE_10} rounded-xl flex items-center justify-center shrink-0`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <p className="font-medium text-sm">{MESSAGES.BUTTONS.START_INTERVIEW}</p>
        <p className={`${COLORS.WHITE_60} text-xs mt-0.5`}>{START_INTERVIEW_SUBTITLE}</p>
      </div>
    </Link>
  );
};