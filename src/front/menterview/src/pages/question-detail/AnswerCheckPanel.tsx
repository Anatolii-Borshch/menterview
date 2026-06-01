import { QUESTION_DETAIL_TEXT } from './QuestionDetailConstants';
import type { AnswerCheckPanelProps } from './QuestionDetailTypes';

export const AnswerCheckPanel = ({
  userAnswer,
  checking,
  checkResult,
  onUserAnswerChange,
  onCheckAnswer,
  onClearResult,
}: AnswerCheckPanelProps) => (
  <div className="mb-8 border-t border-periwinkle pt-6">
    <h2 className="mb-3 text-sm font-medium text-navy">{QUESTION_DETAIL_TEXT.TRY_YOUR_ANSWER}</h2>
    <textarea
      value={userAnswer}
      onChange={(event) => onUserAnswerChange(event.target.value)}
      rows={5}
      placeholder={QUESTION_DETAIL_TEXT.ANSWER_PLACEHOLDER}
      className="w-full rounded-xl border border-periwinkle bg-white px-4 py-3 text-sm text-navy outline-none focus:border-cornflower"
    />

    <div className="mt-3 flex gap-2">
      <button
        onClick={onCheckAnswer}
        disabled={checking}
        className="rounded-lg border border-cornflower px-4 py-2 text-xs text-cornflower transition-colors hover:bg-cornflower hover:text-white disabled:opacity-50"
      >
        {checking ? QUESTION_DETAIL_TEXT.CHECKING : QUESTION_DETAIL_TEXT.CHECK_WITH_AI}
      </button>

      {checkResult && (
        <button onClick={onClearResult} className="px-3 py-2 text-xs text-navy/40 hover:text-navy">
          {QUESTION_DETAIL_TEXT.CLEAR_RESULT}
        </button>
      )}
    </div>

    {checkResult && (
      <div className="mt-4 rounded-xl border border-periwinkle bg-snow p-4">
        <div className="mb-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-lg border border-periwinkle bg-white px-3 py-2">
            <div className="text-navy/50">{QUESTION_DETAIL_TEXT.ACCURACY}</div>
            <div className="font-semibold text-navy">{checkResult.accuracy}%</div>
          </div>
          <div className="rounded-lg border border-periwinkle bg-white px-3 py-2">
            <div className="text-navy/50">{QUESTION_DETAIL_TEXT.CORRECTNESS}</div>
            <div className="font-semibold text-navy">{checkResult.correctness}%</div>
          </div>
          <div className="rounded-lg border border-periwinkle bg-white px-3 py-2">
            <div className="text-navy/50">{QUESTION_DETAIL_TEXT.COMPLETENESS}</div>
            <div className="font-semibold text-navy">{checkResult.completeness}%</div>
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs text-navy/50">{QUESTION_DETAIL_TEXT.AI_FEEDBACK}</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy">
            {checkResult.aiReply || QUESTION_DETAIL_TEXT.NO_FEEDBACK}
          </p>
        </div>
      </div>
    )}
  </div>
);
