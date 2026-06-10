import { QUESTION_DETAIL_TEXT } from './QuestionDetailConstants';
import type { RephraseActionsProps } from './QuestionDetailTypes';

export const RephraseActions = ({
  rephrased,
  rephrasing,
  onRephrase,
  onShowOriginal,
}: RephraseActionsProps) => {
  let buttonText: string = QUESTION_DETAIL_TEXT.REPHRASE_WITH_AI;
  if (rephrased) {
    buttonText = QUESTION_DETAIL_TEXT.REPHRASE_AGAIN;
  }
  if (rephrasing) {
    buttonText = QUESTION_DETAIL_TEXT.REPHRASING;
  }

  return (
    <>
      {rephrased && <p className="mb-4 text-xs italic text-navy/40">{QUESTION_DETAIL_TEXT.AI_REPHRASED_VERSION}</p>}

      <div className="mb-8 flex gap-2">
        <button
          onClick={onRephrase}
          disabled={rephrasing}
          className="rounded-lg border border-periwinkle px-4 py-2 text-xs text-navy transition-colors hover:border-cornflower hover:text-cornflower disabled:opacity-50"
        >
          {buttonText}
        </button>

        {rephrased && (
          <button onClick={onShowOriginal} className="px-3 py-2 text-xs text-navy/40 hover:text-navy">
            {QUESTION_DETAIL_TEXT.SHOW_ORIGINAL}
          </button>
        )}
      </div>
    </>
  );
};
