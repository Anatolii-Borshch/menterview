import { QUESTION_DETAIL_TEXT } from './QuestionDetailConstants';
import type { QuestionMetaProps } from './QuestionDetailTypes';

export const QuestionMeta = ({ question, rephrased, difficultyClassName }: QuestionMetaProps) => (
  <>
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-periwinkle px-2.5 py-0.5 text-xs text-navy/40">
          {question.categoryName}
        </span>
      </div>
      <span
        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyClassName}`}
      >
        {question.difficultyName}
      </span>
    </div>

    <h1 className="mb-6 text-xl leading-relaxed text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
      {rephrased ?? question.question}
    </h1>

    <div className="mb-6">
      <p className="mb-2 text-[11px] uppercase tracking-wide text-navy/35">{QUESTION_DETAIL_TEXT.TAGS}</p>
      <div className="flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <span key={tag.tagId} className="rounded-full border border-periwinkle px-2.5 py-0.5 text-xs text-navy/50">
            {tag.tagName}
          </span>
        ))}
      </div>
    </div>
  </>
);
