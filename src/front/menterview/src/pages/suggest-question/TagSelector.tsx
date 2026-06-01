import { SUGGEST_QUESTION_TEXT } from './SuggestQuestionConstants';
import type { TagDto } from '../../api/models/referenceModels';

interface TagSelectorProps {
  tags: TagDto[];
  selectedTagIds: number[];
  tagsLoading: boolean;
  tagsError: string | null;
  onToggleTag: (tagId: number) => void;
  onRetryTags: () => void;
}

export const TagSelector = ({
  tags,
  selectedTagIds,
  tagsLoading,
  tagsError,
  onToggleTag,
  onRetryTags,
}: TagSelectorProps) => {
  if (tagsLoading) {
    return (
      <div className="rounded-xl border border-periwinkle bg-snow px-4 py-3 text-sm text-navy/50">
        {SUGGEST_QUESTION_TEXT.LOADING_TAGS}
      </div>
    );
  }

  if (tags.length > 0) {
    return (
      <>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.tagId}
              type="button"
              onClick={() => onToggleTag(tag.tagId)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                selectedTagIds.includes(tag.tagId)
                  ? 'border-cornflower bg-cornflower text-white'
                  : 'border-periwinkle text-navy/60 hover:border-navy/30'
              }`}
            >
              {tag.tagName}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-navy/40">{SUGGEST_QUESTION_TEXT.TAGS_HINT}</p>
      </>
    );
  }

  return (
    <div className="rounded-xl border border-periwinkle bg-snow px-4 py-3 text-sm text-navy/60">
      <p>{tagsError ?? SUGGEST_QUESTION_TEXT.NO_TAGS_FALLBACK}</p>
      <button type="button" onClick={onRetryTags} className="mt-2 text-xs text-cornflower hover:underline">
        {SUGGEST_QUESTION_TEXT.RETRY_LOADING_TAGS}
      </button>
    </div>
  );
};
