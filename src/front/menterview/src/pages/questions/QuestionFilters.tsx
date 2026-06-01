import { QUESTIONS_TEXT } from './QuestionsConstants';
import type { QuestionFiltersProps } from './QuestionsTypes';

export const QuestionFilters = ({
  search,
  categoryId,
  difficultyId,
  selectedTagIds,
  categories,
  difficulties,
  tags,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onToggleTag,
  onClearFilters,
}: QuestionFiltersProps) => {
  const hasFilters = Boolean(categoryId || difficultyId || selectedTagIds.length > 0 || search);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-periwinkle bg-white p-4">
      <input
        type="text"
        placeholder={QUESTIONS_TEXT.SEARCH_PLACEHOLDER}
        value={search}
        onChange={(event) => onSearchChange(event.target.value || undefined)}
        className="min-w-48 flex-1 rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy focus:border-cornflower focus:outline-none"
      />

      <select
        value={categoryId ?? ''}
        onChange={(event) => onCategoryChange(event.target.value || undefined)}
        className="rounded-lg border border-periwinkle bg-white px-3 py-2 text-sm text-navy focus:border-cornflower focus:outline-none"
      >
        <option value="">{QUESTIONS_TEXT.ALL_CATEGORIES}</option>
        {categories.map((category) => (
          <option key={category.categoryId} value={category.categoryId}>
            {category.categoryName}
          </option>
        ))}
      </select>

      <select
        value={difficultyId ?? ''}
        onChange={(event) => onDifficultyChange(event.target.value || undefined)}
        className="rounded-lg border border-periwinkle bg-white px-3 py-2 text-sm text-navy focus:border-cornflower focus:outline-none"
      >
        <option value="">{QUESTIONS_TEXT.ALL_DIFFICULTIES}</option>
        {difficulties.map((difficulty) => (
          <option key={difficulty.difficultyId} value={difficulty.difficultyId}>
            {difficulty.difficultyName}
          </option>
        ))}
      </select>

      <div className="w-full rounded-lg border border-periwinkle bg-white p-2">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-navy/40">{QUESTIONS_TEXT.TAGS}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const selected = selectedTagIds.includes(tag.tagId);
            return (
              <button
                key={tag.tagId}
                type="button"
                onClick={() => onToggleTag(tag.tagId)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  selected
                    ? 'border-cornflower bg-cornflower text-white'
                    : 'border-periwinkle text-navy/60 hover:border-cornflower hover:text-cornflower'
                }`}
              >
                {tag.tagName}
              </button>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="rounded-lg border border-periwinkle px-3 py-2 text-xs text-navy/50 transition-colors hover:border-navy/30 hover:text-navy"
        >
          {QUESTIONS_TEXT.CLEAR_FILTERS}
        </button>
      )}
    </div>
  );
};
