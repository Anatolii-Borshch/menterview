import { Link } from 'react-router-dom';
import { QUESTIONS_TEXT } from './QuestionsConstants';
import type { QuestionListProps } from './QuestionsTypes';

export const QuestionList = ({
  questions,
  isAdmin,
  deletingId,
  onDelete,
  difficultyColor,
}: QuestionListProps) => (
  <div className="space-y-2">
    {questions.map((question) => (
      <Link
        key={question.questionId}
        to={`/questions/${question.questionId}`}
        className="block rounded-xl border border-periwinkle bg-white p-4 transition-colors hover:border-cornflower/40"
      >
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm text-navy">{question.question}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-navy/40">{question.categoryName}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wide text-navy/35">{QUESTIONS_TEXT.TAGS}</span>
              {question.tags.slice(0, 6).map((tag) => (
                <span key={tag.tagId} className="rounded-full border border-periwinkle px-2 py-0.5 text-xs text-navy/50">
                  {tag.tagName}
                </span>
              ))}
              {question.tags.length > 6 && (
                <span className="text-xs text-navy/40">+{question.tags.length - 6} more</span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                difficultyColor[question.difficultyName] ?? 'border-periwinkle bg-white text-navy/60'
              }`}
            >
              {question.difficultyName}
            </span>

            {isAdmin && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDelete(question.questionId);
                }}
                disabled={deletingId === question.questionId}
                className="rounded-full border border-red-200 px-2.5 py-0.5 text-xs text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === question.questionId ? QUESTIONS_TEXT.DELETING : QUESTIONS_TEXT.DELETE}
              </button>
            )}
          </div>
        </div>
      </Link>
    ))}
  </div>
);
