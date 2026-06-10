import { Link } from 'react-router-dom';
import { QUESTION_DETAIL_TEXT } from './QuestionDetailConstants';
import type { QuestionTopBarProps } from './QuestionDetailTypes';

export const QuestionTopBar = ({ isAdmin, deleting, onDelete }: QuestionTopBarProps) => (
  <div className="mb-6 flex items-center justify-between">
    <Link to="/questions" className="inline-block text-sm text-navy/50 hover:text-navy">
      {QUESTION_DETAIL_TEXT.QUESTIONS}
    </Link>

    {isAdmin && (
      <button
        onClick={onDelete}
        disabled={deleting}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? QUESTION_DETAIL_TEXT.DELETING : QUESTION_DETAIL_TEXT.DELETE_QUESTION}
      </button>
    )}
  </div>
);
