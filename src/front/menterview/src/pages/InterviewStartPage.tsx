import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import interviewApi from '../api/interviewApi';
import referenceApi from '../api/referenceApi';
import type { CategoryDto, DifficultyDto, LevelDto } from '../api/models/referenceModels';

export default function InterviewStartPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyDto[]>([]);
  const [levels, setLevels] = useState<LevelDto[]>([]);
  const [refLoading, setRefLoading] = useState(true);

  const [form, setForm] = useState({
    categoryId: undefined as number | undefined,
    levelId: undefined as number | undefined,
    difficultyId: undefined as number | undefined,
    questionCount: 10,
    includeWeakTopics: false,
  });
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    Promise.all([
      referenceApi.getCategories(),
      referenceApi.getDifficulties(),
      referenceApi.getLevels(),
    ])
      .then(([catRes, difRes, levRes]) => {
        if (catRes.data.isSuccess) setCategories(catRes.data.data);
        if (difRes.data.isSuccess) setDifficulties(difRes.data.data);
        if (levRes.data.isSuccess) setLevels(levRes.data.data);
      })
      .catch(() => toast.error('Failed to load options.'))
      .finally(() => setRefLoading(false));
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await interviewApi.start({
        categoryId: form.categoryId,
        levelId: form.levelId,
        difficultyId: form.difficultyId,
        questionCount: form.questionCount,
        includeWeakTopics: form.includeWeakTopics,
      });
      if (res.data.isSuccess) {
        navigate(`/interview/${res.data.data.sessionId}`, {
          state: res.data.data,
        });
      } else {
        res.data.errors.forEach((err: string) => toast.error(err));
      }
    } catch {
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const ToggleChip = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`py-1.5 px-4 rounded-full border text-sm transition-colors ${
        selected
          ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
          : 'border-periwinkle text-navy/60 hover:border-navy/30'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl text-navy mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Configure interview
        </h1>
        <p className="text-navy/50 text-sm mb-8">Customise your mock session before starting.</p>

        <div className="bg-white border border-periwinkle rounded-2xl p-8 space-y-6">
          {refLoading ? (
            <p className="text-center text-navy/40 text-sm py-8">Loading options…</p>
          ) : (
            <>
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip
                    label="Any"
                    selected={form.categoryId === undefined}
                    onClick={() => setForm((f) => ({ ...f, categoryId: undefined }))}
                  />
                  {categories.map((cat) => (
                    <ToggleChip
                      key={cat.categoryId}
                      label={cat.categoryName}
                      selected={form.categoryId === cat.categoryId}
                      onClick={() => setForm((f) => ({ ...f, categoryId: cat.categoryId }))}
                    />
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-2">Level</label>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip
                    label="Any"
                    selected={form.levelId === undefined}
                    onClick={() => setForm((f) => ({ ...f, levelId: undefined }))}
                  />
                  {levels.map((lvl) => (
                    <ToggleChip
                      key={lvl.levelId}
                      label={lvl.levelName}
                      selected={form.levelId === lvl.levelId}
                      onClick={() => setForm((f) => ({ ...f, levelId: lvl.levelId }))}
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-2">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip
                    label="Any"
                    selected={form.difficultyId === undefined}
                    onClick={() => setForm((f) => ({ ...f, difficultyId: undefined }))}
                  />
                  {difficulties.map((d) => (
                    <ToggleChip
                      key={d.difficultyId}
                      label={d.difficultyName}
                      selected={form.difficultyId === d.difficultyId}
                      onClick={() => setForm((f) => ({ ...f, difficultyId: d.difficultyId }))}
                    />
                  ))}
                </div>
              </div>

              {/* Question count */}
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-2">
                  Number of questions: <span className="text-navy font-semibold">{form.questionCount}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={form.questionCount}
                  onChange={(e) => setForm((f) => ({ ...f, questionCount: parseInt(e.target.value) }))}
                  className="w-full accent-cornflower"
                />
                <div className="flex justify-between text-xs text-navy/30 mt-1">
                  <span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
                </div>
              </div>

              {/* Weak topics */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, includeWeakTopics: !f.includeWeakTopics }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    form.includeWeakTopics ? 'bg-cornflower' : 'bg-periwinkle'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.includeWeakTopics ? 'translate-x-5' : ''
                    }`}
                  />
                </div>
                <span className="text-sm text-navy">Focus on weak topics</span>
              </label>
            </>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={starting || refLoading}
          className="w-full mt-6 bg-navy hover:bg-cornflower text-white py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          {starting ? 'Starting…' : 'Start interview'}
        </button>
      </div>
    </div>
  );
}
