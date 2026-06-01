import { Link } from 'react-router-dom';
import { ROUTES, COLORS, MESSAGES } from '../../constants';

const BROWSE_QUESTIONS_SUBTITLE = 'Explore the question bank';

export const DashboardBrowseQuestionsAction = () => {
  return (
    <Link
      to={ROUTES.QUESTIONS}
      className={`group ${COLORS.BG_SECONDARY} ${COLORS.BORDER_HOVER} border ${COLORS.BORDER_PRIMARY} text-navy rounded-2xl p-6 flex items-center gap-4 transition-colors`}
    >
      <div className={`w-10 h-10 ${COLORS.CORNFLOWER_10} rounded-xl flex items-center justify-center shrink-0`}>
        <svg className="w-5 h-5 text-cornflower" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <div>
        <p className="font-medium text-sm">{MESSAGES.BUTTONS.BROWSE_QUESTIONS}</p>
        <p className={`${COLORS.TEXT_SECONDARY} text-xs mt-0.5`}>{BROWSE_QUESTIONS_SUBTITLE}</p>
      </div>
    </Link>
  );
};