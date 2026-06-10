import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import questionsApi from '../../api/questionsApi';
import referenceApi from '../../api/referenceApi';
import type { QuestionListItemDto } from '../../api/models/questionModels';
import type { CategoryDto, DifficultyDto, TagDto } from '../../api/models/referenceModels';
import { useAuthStore } from '../../api/useAuthStore';
import { confirmToast } from '../../components/common/confirmToast';
import { QuestionFilters } from './QuestionFilters';
import { QuestionList } from './QuestionList';
import { QUESTION_DIFFICULTY_COLOR, QUESTIONS_CONSTANTS, QUESTIONS_TEXT } from './QuestionsConstants';
import { getTotalPages, parseOptionalInt, parsePageNumber, parseTagIds } from './QuestionsHelpers';
import { QuestionsPagination } from './QuestionsPagination';

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

  const page = parsePageNumber(searchParams.get('page'));
  const categoryId = parseOptionalInt(searchParams.get('categoryId'));
  const difficultyId = parseOptionalInt(searchParams.get('difficultyId'));
  const tagIdsParam = searchParams.get('tagIds') ?? '';
  const selectedTagIds = useMemo(() => parseTagIds(tagIdsParam), [tagIdsParam]);
  const search = searchParams.get('search') ?? '';

  const setParam = (key: string, value: string | undefined) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
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
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
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
      const response = await questionsApi.getQuestions({
        page,
        pageSize: QUESTIONS_CONSTANTS.PAGE_SIZE,
        categoryId,
        difficultyId,
        tagIds: selectedTagIds,
        search: search || undefined,
      });

      if (response.data.isSuccess) {
        setQuestions(response.data.data.items);
        setTotalCount(response.data.data.totalCount);
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
      ([categoriesResponse, difficultiesResponse, tagsResponse]) => {
        if (categoriesResponse.data.isSuccess) {
          setCategories(categoriesResponse.data.data);
        }

        if (difficultiesResponse.data.isSuccess) {
          setDifficulties(difficultiesResponse.data.data);
        }

        if (tagsResponse.data.isSuccess) {
          setTags(tagsResponse.data.data);
        }
      }
    );
  }, []);

  const totalPages = getTotalPages(totalCount);
  let questionCountLabel = String(totalCount) + ' question';
  if (totalCount !== 1) {
    questionCountLabel += 's';
  }
  if (loading) {
    questionCountLabel = QUESTIONS_TEXT.LOADING;
  }

  const handleDelete = async (questionId: number) => {
    const confirmed = await confirmToast(QUESTIONS_TEXT.DELETE_CONFIRM_MESSAGE, {
      title: QUESTIONS_TEXT.DELETE_CONFIRM_TITLE,
      confirmText: QUESTIONS_TEXT.DELETE_CONFIRM_ACTION,
      danger: true,
    });

    if (!confirmed) {
      return;
    }

    setDeletingId(questionId);
    try {
      const response = await adminApi.deleteQuestion(questionId);
      if (response.data.isSuccess) {
        setQuestions((previous) => previous.filter((question) => question.questionId !== questionId));
        setTotalCount((previous) => Math.max(0, previous - 1));
        toast.success(QUESTIONS_TEXT.QUESTION_DELETED);
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(QUESTIONS_TEXT.DELETE_FAILED);
    } finally {
      setDeletingId(null);
    }
  };

  const renderQuestionsContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: QUESTIONS_CONSTANTS.SKELETON_ITEMS }).map((_, index) => (
            <div
              key={`questions-loading-${index + 1}`}
              className="h-16 rounded-xl border border-periwinkle bg-white p-4 animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="rounded-2xl border border-periwinkle bg-white p-12 text-center">
          <p className="text-sm text-navy/40">{QUESTIONS_TEXT.NO_QUESTIONS_FOUND}</p>
        </div>
      );
    }

    return (
      <QuestionList
        questions={questions}
        isAdmin={isAdmin}
        deletingId={deletingId}
        onDelete={handleDelete}
        difficultyColor={QUESTION_DIFFICULTY_COLOR}
      />
    );
  };

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {QUESTIONS_TEXT.TITLE}
          </h1>
          <Link
            to="/questions/suggest"
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-snow transition-colors hover:bg-cornflower"
          >
            {QUESTIONS_TEXT.SUGGEST_QUESTION}
          </Link>
        </div>

        <QuestionFilters
          search={search}
          categoryId={categoryId}
          difficultyId={difficultyId}
          selectedTagIds={selectedTagIds}
          categories={categories}
          difficulties={difficulties}
          tags={tags}
          onSearchChange={(value) => setParam('search', value)}
          onCategoryChange={(value) => setParam('categoryId', value)}
          onDifficultyChange={(value) => setParam('difficultyId', value)}
          onToggleTag={toggleTag}
          onClearFilters={() => setSearchParams({})}
        />

        <p className="mb-4 text-xs text-navy/40">{questionCountLabel}</p>

        {renderQuestionsContent()}

        {totalPages > 1 && (
          <QuestionsPagination
            page={page}
            totalPages={totalPages}
            onPrevious={() =>
              setSearchParams((previous) => {
                const next = new URLSearchParams(previous);
                next.set('page', String(page - 1));
                return next;
              })
            }
            onNext={() =>
              setSearchParams((previous) => {
                const next = new URLSearchParams(previous);
                next.set('page', String(page + 1));
                return next;
              })
            }
          />
        )}
      </div>
    </div>
  );
}
