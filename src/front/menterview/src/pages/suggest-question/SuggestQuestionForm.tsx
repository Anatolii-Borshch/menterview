import { SUGGEST_QUESTION_CONSTRAINTS, SUGGEST_QUESTION_TEXT } from './SuggestQuestionConstants';
import type { SuggestQuestionFormProps } from './SuggestQuestionTypes';
import { TagSelector } from './TagSelector';

export const SuggestQuestionForm = ({
  form,
  categories,
  difficulties,
  tags,
  loading,
  tagsLoading,
  tagsError,
  onFormChange,
  onToggleTag,
  onRetryTags,
  onCancel,
  onSubmit,
}: SuggestQuestionFormProps) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-5 rounded-2xl border border-periwinkle bg-white p-6">
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">{SUGGEST_QUESTION_TEXT.QUESTION_LABEL}</label>
        <textarea
          value={form.questionText}
          onChange={(event) => onFormChange({ ...form, questionText: event.target.value })}
          rows={3}
          className="w-full resize-none rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy transition-colors focus:border-cornflower focus:outline-none"
          placeholder={SUGGEST_QUESTION_TEXT.QUESTION_PLACEHOLDER}
          required
          minLength={SUGGEST_QUESTION_CONSTRAINTS.MIN_TEXT_LENGTH}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">{SUGGEST_QUESTION_TEXT.ANSWER_LABEL}</label>
        <textarea
          value={form.answer}
          onChange={(event) => onFormChange({ ...form, answer: event.target.value })}
          rows={5}
          className="w-full resize-none rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy transition-colors focus:border-cornflower focus:outline-none"
          placeholder={SUGGEST_QUESTION_TEXT.ANSWER_PLACEHOLDER}
          required
          minLength={SUGGEST_QUESTION_CONSTRAINTS.MIN_TEXT_LENGTH}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/60">{SUGGEST_QUESTION_TEXT.CATEGORY_LABEL}</label>
          <select
            value={form.categoryId}
            onChange={(event) => onFormChange({ ...form, categoryId: Number(event.target.value) })}
            className="w-full rounded-lg border border-periwinkle bg-white px-3 py-2.5 text-sm text-navy transition-colors focus:border-cornflower focus:outline-none"
            required
          >
            <option value={0} disabled>
              {SUGGEST_QUESTION_TEXT.SELECT_OPTION}
            </option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/60">{SUGGEST_QUESTION_TEXT.DIFFICULTY_LABEL}</label>
          <select
            value={form.difficultyId}
            onChange={(event) => onFormChange({ ...form, difficultyId: Number(event.target.value) })}
            className="w-full rounded-lg border border-periwinkle bg-white px-3 py-2.5 text-sm text-navy transition-colors focus:border-cornflower focus:outline-none"
            required
          >
            <option value={0} disabled>
              {SUGGEST_QUESTION_TEXT.SELECT_OPTION}
            </option>
            {difficulties.map((difficulty) => (
              <option key={difficulty.difficultyId} value={difficulty.difficultyId}>
                {difficulty.difficultyName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-navy/60">{SUGGEST_QUESTION_TEXT.TAGS_LABEL}</label>
        <TagSelector
          tags={tags}
          selectedTagIds={form.tagIds}
          tagsLoading={tagsLoading}
          tagsError={tagsError}
          onToggleTag={onToggleTag}
          onRetryTags={onRetryTags}
        />
      </div>
    </div>

    <div className="flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-lg border border-periwinkle py-2.5 text-sm text-navy transition-colors hover:border-navy/40"
      >
        {SUGGEST_QUESTION_TEXT.CANCEL}
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 rounded-lg bg-navy py-2.5 text-sm font-medium text-snow transition-colors hover:bg-cornflower disabled:opacity-50"
      >
        {loading ? SUGGEST_QUESTION_TEXT.SUBMITTING : SUGGEST_QUESTION_TEXT.SUBMIT}
      </button>
    </div>
  </form>
);
