import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import interviewApi from '../api/interviewApi';
import referenceApi from '../api/referenceApi';
import type { CategoryDto, DifficultyDto } from '../api/models/referenceModels';
import type { ApiResponse } from '../api/models/authModels';

export default function InterviewStartPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyDto[]>([]);
  const [refLoading, setRefLoading] = useState(true);

  const [form, setForm] = useState({
    categoryId: undefined as number | undefined,
    difficultyId: undefined as number | undefined,
    questionsAmount: 10,
    includeWeakTopics: false,
  });
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    Promise.all([
      referenceApi.getCategories(),
      referenceApi.getDifficulties(),
    ])
      .then(([catRes, difRes]) => {
        if (catRes.data.isSuccess) setCategories(catRes.data.data);
        if (difRes.data.isSuccess) setDifficulties(difRes.data.data);
      })
      .catch(() => toast.error('Failed to load options.'))
      .finally(() => setRefLoading(false));
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await interviewApi.start({
        categoryId: form.categoryId,
        difficultyId: form.difficultyId,
        questionsAmount: form.questionsAmount,
        weakTopicRatio: form.includeWeakTopics ? 0.3 : 0,
      });
      if (res.data.isSuccess) {
        navigate(`/interview/${res.data.data.sessionId}`, {
          state: res.data.data,
        });
      } else {
        res.data.errors.forEach((err: string) => toast.error(err));
      }
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        const errors = error.response?.data?.errors;
        if (errors && errors.length > 0) {
          errors.forEach((err) => toast.error(err));
        } else {
          toast.error('Failed to start interview. Please try again.');
        }
      } else {
        toast.error('Failed to start interview. Please try again.');
      }
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

              <div>
                <label className="block text-xs font-medium text-navy/60 mb-2">
                  Number of questions: <span className="text-navy font-semibold">{form.questionsAmount}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={form.questionsAmount}
                  onChange={(e) => setForm((f) => ({ ...f, questionsAmount: parseInt(e.target.value) }))}
                  className="w-full accent-cornflower"
                />
                <div className="flex justify-between text-xs text-navy/30 mt-1">
                  <span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
                </div>
              </div>

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
