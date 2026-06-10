import { InfoRow } from './InfoRow';
import { PROFILE_TEXT } from './ProfileConstants';
import type { ProfileFocusSectionProps } from './ProfileTypes';

export const ProfileFocusSection = ({
  profile,
  editMode,
  categories,
  levels,
  selectedCategoryId,
  selectedLevelId,
  saving,
  onOpenEdit,
  onSave,
  onCancel,
  onCategoryChange,
  onLevelChange,
}: ProfileFocusSectionProps) => (
  <div className="mb-4 rounded-2xl border border-periwinkle bg-white p-6">
    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-navy/40">{PROFILE_TEXT.FOCUS_SECTION}</h2>

    {editMode === 'category' ? (
      <div className="space-y-3 py-2">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.categoryId}
              type="button"
              onClick={() => onCategoryChange(category.categoryId)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                selectedCategoryId === category.categoryId
                  ? 'border-cornflower bg-cornflower/5 font-medium text-navy'
                  : 'border-periwinkle text-navy/60 hover:border-navy/30'
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-navy px-4 py-2 text-xs text-white transition-colors hover:bg-cornflower disabled:opacity-50"
          >
            {saving ? PROFILE_TEXT.SAVING : PROFILE_TEXT.SAVE}
          </button>
          <button onClick={onCancel} className="px-3 py-2 text-xs text-navy/50 hover:text-navy">
            {PROFILE_TEXT.CANCEL}
          </button>
        </div>
      </div>
    ) : (
      <InfoRow
        label={PROFILE_TEXT.CATEGORY}
        value={profile.category.categoryName}
        onEdit={() => onOpenEdit('category')}
      />
    )}

    {editMode === 'level' ? (
      <div className="space-y-3 py-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onLevelChange(undefined)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              selectedLevelId === undefined
                ? 'border-cornflower bg-cornflower/5 font-medium text-navy'
                : 'border-periwinkle text-navy/60'
            }`}
          >
            {PROFILE_TEXT.NOT_SET}
          </button>
          {levels.map((level) => (
            <button
              key={level.levelId}
              type="button"
              onClick={() => onLevelChange(level.levelId)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selectedLevelId === level.levelId
                  ? 'border-cornflower bg-cornflower/5 font-medium text-navy'
                  : 'border-periwinkle text-navy/60'
              }`}
            >
              {level.levelName}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-navy px-4 py-2 text-xs text-white transition-colors hover:bg-cornflower disabled:opacity-50"
          >
            {saving ? PROFILE_TEXT.SAVING : PROFILE_TEXT.SAVE}
          </button>
          <button onClick={onCancel} className="px-3 py-2 text-xs text-navy/50 hover:text-navy">
            {PROFILE_TEXT.CANCEL}
          </button>
        </div>
      </div>
    ) : (
      <InfoRow
        label={PROFILE_TEXT.LEVEL}
        value={profile.level?.levelName ?? PROFILE_TEXT.NOT_SET}
        onEdit={() => onOpenEdit('level')}
      />
    )}
  </div>
);
