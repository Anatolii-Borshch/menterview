import { COLORS, FONTS } from '../../constants';
import { SESSION_TEXT } from './sessionConstants';
import type { SessionCompleteProps } from './sessionTypes';

export const SessionCompleteCard = ({ onViewResults }: SessionCompleteProps) => {
  const cardStyles = `${COLORS.BG_SECONDARY} border ${COLORS.BORDER_PRIMARY} rounded-2xl p-10 text-center max-w-sm`;
  const containerStyles = `min-h-screen ${COLORS.BG_PAGE} flex items-center justify-center px-4`;
  const actionButtonStyles = `w-full ${COLORS.BG_PRIMARY} hover:bg-cornflower text-white py-2.5 rounded-xl text-sm font-medium transition-colors`;

  return (
    <div className={containerStyles}>
      <div className={cardStyles}>
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl text-navy mb-2" style={FONTS.SERIF_DISPLAY}>
          {SESSION_TEXT.INTERVIEW_COMPLETE}
        </h1>
        <p className={`${COLORS.TEXT_TERTIARY} text-sm mb-6`}>{SESSION_TEXT.ANSWERS_EVALUATED}</p>
        <button
          onClick={onViewResults}
          className={actionButtonStyles}
        >
          {SESSION_TEXT.VIEW_RESULTS}
        </button>
      </div>
    </div>
  );
};
