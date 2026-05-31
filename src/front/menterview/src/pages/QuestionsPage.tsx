import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../api/adminApi';
import questionsApi from '../api/questionsApi';
import referenceApi from '../api/referenceApi';
import { useAuthStore } from '../api/useAuthStore';
import { confirmToast } from '../components/common/confirmToast';
import type { QuestionListItemDto } from '../api/models/questionModels';
import type { CategoryDto, DifficultyDto, TagDto } from '../api/models/referenceModels';

const PAGE_SIZE = 15;

const difficultyColor: Record<string, string> = {
  Easy: 'text-green-600 bg-green-50 border-green-100',
  Medium: 'text-yellow-600 bg-yellow-50 border-yellow-100',
  Hard: 'text-red-600 bg-red-50 border-red-100',
};

export default function QuestionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = useAuthStore();
  const isAdmin = role === 'Administrator';

  const [questions, setQuestions] = useState<QuestionListItemDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!, 10) : undefined;
  const difficultyId = searchParams.get('difficultyId') ? parseInt(searchParams.get('difficultyId')!, 10) : undefined;
  const tagIdsParam = searchParams.get('tagIds') ?? '';
  const selectedTagIds = useMemo(
    () => tagIdsParam
      .split(',')
      .map((id) => parseInt(id, 10))
      .filter((id) => Number.isFinite(id)),
    [tagIdsParam]
  );
  const search = searchParams.get('search') ?? '';

  const setParam = (key: string, value: string | undefined) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete('page');
      return next;
    });
  };

  const setTagParams = (tagIds: number[]) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tagIds.length > 0) {
        next.set('tagIds', tagIds.join(','));
      } else {
        next.delete('tagIds');
      }
      next.delete('page');
      return next;
    });
  };

  const toggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setTagParams(selectedTagIds.filter((id) => id !== tagId));
      return;
    }

    setTagParams([...selectedTagIds, tagId]);
  };

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await questionsApi.getQuestions({
        page,
        pageSize: PAGE_SIZE,
        categoryId,
        difficultyId,
        tagIds: selectedTagIds,
        search: search || undefined,
      });
      if (res.data.isSuccess) {
        setQuestions(res.data.data.items);
        setTotalCount(res.data.data.totalCount);
      }
    } finally {
      setLoading(false);
    }
  }, [page, categoryId, difficultyId, selectedTagIds, search]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    Promise.all([referenceApi.getCategories(), referenceApi.getDifficulties(), referenceApi.getTags()]).then(
      ([catRes, difRes, tagRes]) => {
        if (catRes.data.isSuccess) setCategories(catRes.data.data);
        if (difRes.data.isSuccess) setDifficulties(difRes.data.data);
        if (tagRes.data.isSuccess) setTags(tagRes.data.data);
      }
    );
  }, []);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleDelete = async (questionId: number) => {
    const confirmed = await confirmToast('Delete this question?', {
      title: 'Confirm deletion',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;

    setDeletingId(questionId);
    try {
      const res = await adminApi.deleteQuestion(questionId);
      if (res.data.isSuccess) {
        setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
        setTotalCount((prev) => Math.max(0, prev - 1));
        toast.success('Question deleted.');
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to delete question.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Questions
          </h1>
          <Link
            to="/questions/suggest"
            className="bg-navy text-snow px-4 py-2 rounded-lg text-sm font-medium hover:bg-cornflower transition-colors"
          >
            + Suggest a question
          </Link>
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setParam('search', e.target.value || undefined)}
            className="flex-1 min-w-48 border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-cornflower"
          />

          <select
            value={categoryId ?? ''}
            onChange={(e) => setParam('categoryId', e.target.value || undefined)}
            className="border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-cornflower bg-white"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
            ))}
          </select>

          <select
            value={difficultyId ?? ''}
            onChange={(e) => setParam('difficultyId', e.target.value || undefined)}
            className="border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-cornflower bg-white"
          >
            <option value="">All difficulties</option>
            {difficulties.map((d) => (
              <option key={d.difficultyId} value={d.difficultyId}>{d.difficultyName}</option>
            ))}
          </select>

          <div className="w-full border border-periwinkle rounded-lg p-2 bg-white">
            <p className="text-[11px] text-navy/40 mb-2 uppercase tracking-wide">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.tagId);
                return (
                  <button
                    key={tag.tagId}
                    type="button"
                    onClick={() => toggleTag(tag.tagId)}
                    className={`py-1 px-3 rounded-full border text-xs transition-colors ${
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

          {(categoryId || difficultyId || selectedTagIds.length > 0 || search) && (
            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-navy/50 hover:text-navy border border-periwinkle rounded-lg px-3 py-2 hover:border-navy/30 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="text-xs text-navy/40 mb-4">
          {loading ? 'Loading…' : `${totalCount} question${totalCount !== 1 ? 's' : ''}`}
        </p>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-periwinkle rounded-xl p-4 h-16 animate-pulse" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white border border-periwinkle rounded-2xl p-12 text-center">
            <p className="text-navy/40 text-sm">No questions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q) => (
              <Link
                key={q.questionId}
                to={`/questions/${q.questionId}`}
                className="block bg-white border border-periwinkle rounded-xl p-4 hover:border-cornflower/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-navy line-clamp-2">{q.question}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-navy/40">{q.categoryName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[11px] text-navy/35 uppercase tracking-wide">Tags</span>
                      {q.tags.slice(0, 6).map((tag) => (
                        <span key={tag.tagId} className="text-xs text-navy/50 border border-periwinkle rounded-full px-2 py-0.5">
                          {tag.tagName}
                        </span>
                      ))}
                      {q.tags.length > 6 && (
                        <span className="text-xs text-navy/40">+{q.tags.length - 6} more</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span
                      className={`shrink-0 text-xs border rounded-full px-2.5 py-0.5 font-medium ${
                        difficultyColor[q.difficultyName] ?? 'text-navy/60 bg-white border-periwinkle'
                      }`}
                    >
                      {q.difficultyName}
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(q.questionId);
                        }}
                        disabled={deletingId === q.questionId}
                        className="text-xs border border-red-200 text-red-600 rounded-full px-2.5 py-0.5 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingId === q.questionId ? 'Deleting…' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setSearchParams((p) => { const n = new URLSearchParams(p); n.set('page', String(page - 1)); return n; })}
              className="border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy hover:border-navy/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-navy/50">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setSearchParams((p) => { const n = new URLSearchParams(p); n.set('page', String(page + 1)); return n; })}
              className="border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy hover:border-navy/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
