import { COLORS, FONTS } from '../../constants';
import { SESSION_TEXT } from './sessionConstants';
import type { SessionQuestionProps } from './sessionTypes';

export const SessionQuestionCard = ({ question, totalQuestions }: SessionQuestionProps) => {
  const hasQuestionNumber = typeof question.number === 'number';
  const hasTotalQuestions = typeof totalQuestions === 'number';
  const questionNumberText: string = SESSION_TEXT.QUESTION_PREFIX;
  const questionCountTextParts: string[] = [];

  if (hasQuestionNumber) {
    questionCountTextParts.push(String(question.number));

    if (hasTotalQuestions) {
      questionCountTextParts.push(`/${String(totalQuestions)}`);
    }
  }

  return (
    <div className={`${COLORS.BG_SECONDARY} border ${COLORS.BORDER_PRIMARY} rounded-2xl p-8 mb-4`}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <p className={`text-xs ${COLORS.TEXT_LIGHT}`}>
          {questionNumberText}
          {questionCountTextParts.join('')}
        </p>
        {question.isRephrased && (
          <span className="text-[11px] px-2 py-1 rounded-full border border-cornflower/30 bg-cornflower/10 text-cornflower">
            {SESSION_TEXT.REPHRASED_BADGE}
          </span>
        )}
      </div>
      <h2 className="text-xl text-navy leading-relaxed" style={FONTS.SERIF_DISPLAY}>
        {question.text}
      </h2>
    </div>
  );
};
