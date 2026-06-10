import type { CategoryDto, LevelDto } from '../../api/models/referenceModels';
import { REGISTER_TEXT } from './RegisterConstants';

interface RegisterPreferencesFormProps {
  loading: boolean;
  categories: CategoryDto[];
  levels: LevelDto[];
  selectedCategoryId: number;
  selectedLevelId: number | undefined;
  submitting: boolean;
  onCategorySelect: (categoryId: number) => void;
  onLevelToggle: (levelId: number) => void;
  onBack: () => void;
  onSubmit: (event: { preventDefault: () => void }) => Promise<void>;
}

export const RegisterPreferencesForm = ({
  loading,
  categories,
  levels,
  selectedCategoryId,
  selectedLevelId,
  submitting,
  onCategorySelect,
  onLevelToggle,
  onBack,
  onSubmit,
}: RegisterPreferencesFormProps) => (
  <form
    onSubmit={(event) => {
      void onSubmit(event);
    }}
    className="space-y-5"
  >
    {loading ? (
      <p className="py-4 text-center text-sm text-navy/50">{REGISTER_TEXT.LOADING_OPTIONS}</p>
    ) : (
      <>
        <div>
          <label className="mb-2 block text-xs font-medium text-navy/60">
            {REGISTER_TEXT.TECHNOLOGY_CATEGORY} <span className="text-red-400">{REGISTER_TEXT.REQUIRED_MARK}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategoryId === category.categoryId;
              const buttonClassName = isSelected
                ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                : 'border-periwinkle text-navy/60 hover:border-navy/30';
              return (
                <button
                  key={category.categoryId}
                  type="button"
                  onClick={() => onCategorySelect(category.categoryId)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${buttonClassName}`}
                >
                  {category.categoryName}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-navy/60">
            {REGISTER_TEXT.EXPERIENCE_LEVEL} <span className="text-navy/30">{REGISTER_TEXT.OPTIONAL_MARK}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => {
              const isSelected = selectedLevelId === level.levelId;
              const buttonClassName = isSelected
                ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                : 'border-periwinkle text-navy/60 hover:border-navy/30';

              return (
                <button
                  key={level.levelId}
                  type="button"
                  onClick={() => onLevelToggle(level.levelId)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${buttonClassName}`}
                >
                  {level.levelName}
                </button>
              );
            })}
          </div>
        </div>
      </>
    )}

    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onBack}
        className="flex-1 rounded-lg border border-periwinkle py-2.5 text-sm text-navy transition-colors hover:border-navy/40"
      >
        {REGISTER_TEXT.BACK}
      </button>
      <button
        type="submit"
        disabled={submitting || !selectedCategoryId}
        className="flex-1 rounded-lg bg-navy py-2.5 text-sm font-medium text-snow transition-colors hover:bg-cornflower disabled:opacity-50"
      >
        {submitting ? REGISTER_TEXT.CREATING : REGISTER_TEXT.CREATE_ACCOUNT}
      </button>
    </div>
  </form>
);
