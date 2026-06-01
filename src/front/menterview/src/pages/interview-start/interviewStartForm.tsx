import { ToggleChip } from './toggle-chip';
import { INTERVIEW_START_CONSTANTS, INTERVIEW_START_TEXT } from './interviewStartConstants';
import type { InterviewStartFormProps } from './interview-start-types';

export function InterviewStartForm({
  categories,
  difficulties,
  form,
  refLoading,
  starting,
  onToggleCategory,
  onToggleDifficulty,
  onQuestionsAmountChange,
  onToggleWeakTopics,
  onStart,
}: Readonly<InterviewStartFormProps>) {
  return (
    <div className="space-y-6 rounded-2xl border border-periwinkle bg-white p-8">
      {refLoading ? (
        <p className="py-8 text-center text-sm text-navy/40">{INTERVIEW_START_TEXT.LOADING_OPTIONS}</p>
      ) : (
        <>
          <div>
            <label className="mb-2 block text-xs font-medium text-navy/60">{INTERVIEW_START_TEXT.CATEGORY}</label>
            <div className="flex flex-wrap gap-2">
              <ToggleChip
                label={INTERVIEW_START_TEXT.ANY}
                selected={form.categoryId === undefined}
                onClick={() => onToggleCategory(undefined)}
              />
              {categories.map((category) => (
                <ToggleChip
                  key={category.categoryId}
                  label={category.categoryName}
                  selected={form.categoryId === category.categoryId}
                  onClick={() => onToggleCategory(category.categoryId)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-navy/60">{INTERVIEW_START_TEXT.DIFFICULTY}</label>
            <div className="flex flex-wrap gap-2">
              <ToggleChip
                label={INTERVIEW_START_TEXT.ANY}
                selected={form.difficultyId === undefined}
                onClick={() => onToggleDifficulty(undefined)}
              />
              {difficulties.map((difficulty) => (
                <ToggleChip
                  key={difficulty.difficultyId}
                  label={difficulty.difficultyName}
                  selected={form.difficultyId === difficulty.difficultyId}
                  onClick={() => onToggleDifficulty(difficulty.difficultyId)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-navy/60">
              {INTERVIEW_START_TEXT.QUESTIONS_PREFIX}{' '}
              <span className="font-semibold text-navy">{form.questionsAmount}</span>
            </label>
            <input
              type="range"
              min={INTERVIEW_START_CONSTANTS.RANGE_MIN}
              max={INTERVIEW_START_CONSTANTS.RANGE_MAX}
              step={INTERVIEW_START_CONSTANTS.RANGE_STEP}
              value={form.questionsAmount}
              onChange={(event) => onQuestionsAmountChange(Number(event.target.value))}
              className="w-full accent-cornflower"
            />
            <div className="mt-1 flex justify-between text-xs text-navy/30">
              {INTERVIEW_START_CONSTANTS.QUESTION_AMOUNTS.map((amount) => (
                <span key={amount}>{amount}</span>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <button
              type="button"
              onClick={onToggleWeakTopics}
              className={`relative h-5 w-10 rounded-full transition-colors ${
                form.includeWeakTopics ? 'bg-cornflower' : 'bg-periwinkle'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  form.includeWeakTopics ? 'translate-x-5' : ''
                }`}
              />
            </button>
            <span className="text-sm text-navy">{INTERVIEW_START_TEXT.WEAK_TOPICS}</span>
          </label>
        </>
      )}

      <button
        onClick={onStart}
        disabled={starting || refLoading}
        className="w-full rounded-xl bg-navy py-3 text-sm font-medium text-white transition-colors hover:bg-cornflower disabled:opacity-50"
      >
        {starting ? INTERVIEW_START_TEXT.STARTING : INTERVIEW_START_TEXT.START_INTERVIEW}
      </button>
    </div>
  );
}
