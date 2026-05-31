import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import questionsApi from '../api/questionsApi';
import referenceApi from '../api/referenceApi';
import { useEffect } from 'react';
import type { CategoryDto, DifficultyDto, TagDto } from '../api/models/referenceModels';

export default function SuggestQuestionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    questionText: '',
    answer: '',
    categoryId: 0,
    difficultyId: 0,
    tagIds: [] as number[],
  });
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState<string | null>(null);

  const loadReferenceData = async () => {
    setTagsLoading(true);
    setTagsError(null);

    const [cats, diffs, tgs] = await Promise.allSettled([
      referenceApi.getCategories(),
      referenceApi.getDifficulties(),
      referenceApi.getTags(),
    ]);

    if (cats.status === 'fulfilled') {
      setCategories(cats.value.data.data ?? []);
    }

    if (diffs.status === 'fulfilled') {
      setDifficulties(diffs.value.data.data ?? []);
    }

    if (tgs.status === 'fulfilled') {
      setTags(tgs.value.data.data ?? []);
      if ((tgs.value.data.data ?? []).length === 0) {
        setTagsError('No tags are available yet.');
      }
    } else {
      setTags([]);
      setTagsError('Failed to load tags.');
    }

    if (cats.status === 'rejected' || diffs.status === 'rejected') {
      toast.error('Some reference data failed to load.');
    }

    if (tgs.status === 'rejected') {
      toast.error('Failed to load tags.');
    }

    setTagsLoading(false);
  };

  useEffect(() => {
    loadReferenceData();
  }, []);

  const toggleTag = (tagId: number) => {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(tagId)
        ? f.tagIds.filter((id) => id !== tagId)
        : [...f.tagIds, tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.difficultyId) {
      toast.error('Please select a category and difficulty.');
      return;
    }
    if (!form.tagIds.length) {
      toast.error('Please select at least one tag.');
      return;
    }
    setLoading(true);
    try {
      const res = await questionsApi.suggest(form);
      if (res.data.isSuccess) {
        toast.success('Question submitted for review!');
        navigate('/questions');
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to submit suggestion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl text-navy mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Suggest a question
          </h1>
          <p className="text-navy/50 text-sm">
            Your suggestion will be reviewed by an admin before being published.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-periwinkle rounded-2xl p-6 space-y-5">
            <div>
              <label className="text-xs font-medium text-navy/60 block mb-1">Question</label>
              <textarea
                value={form.questionText}
                onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                rows={3}
                className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors resize-none"
                placeholder="What is the difference between…"
                required
                minLength={10}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-navy/60 block mb-1">Expected answer</label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={5}
                className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors resize-none"
                placeholder="The answer should explain…"
                required
                minLength={10}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-navy/60 block mb-1">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                  className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors bg-white"
                  required
                >
                  <option value={0} disabled>Select…</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-navy/60 block mb-1">Difficulty</label>
                <select
                  value={form.difficultyId}
                  onChange={(e) => setForm({ ...form, difficultyId: Number(e.target.value) })}
                  className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors bg-white"
                  required
                >
                  <option value={0} disabled>Select…</option>
                  {difficulties.map((d) => (
                    <option key={d.difficultyId} value={d.difficultyId}>{d.difficultyName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-navy/60 block mb-2">Tags (required)</label>

              {tagsLoading ? (
                <div className="rounded-xl border border-periwinkle bg-snow px-4 py-3 text-sm text-navy/50">
                  Loading tags...
                </div>
              ) : tags.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.tagId}
                        type="button"
                        onClick={() => toggleTag(tag.tagId)}
                        className={`py-1 px-3 rounded-full border text-xs transition-colors ${
                          form.tagIds.includes(tag.tagId)
                            ? 'border-cornflower bg-cornflower text-white'
                            : 'border-periwinkle text-navy/60 hover:border-navy/30'
                        }`}
                      >
                        {tag.tagName}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-navy/40 mt-2">Select at least one tag.</p>
                </>
              ) : (
                <div className="rounded-xl border border-periwinkle bg-snow px-4 py-3 text-sm text-navy/60">
                  <p>{tagsError ?? 'No tags are available.'}</p>
                  <button
                    type="button"
                    onClick={loadReferenceData}
                    className="mt-2 text-xs text-cornflower hover:underline"
                  >
                    Retry loading tags
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/questions')}
              className="flex-1 border border-periwinkle text-navy py-2.5 rounded-lg text-sm hover:border-navy/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-navy text-snow py-2.5 rounded-lg text-sm font-medium hover:bg-cornflower transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting…' : 'Submit for review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
