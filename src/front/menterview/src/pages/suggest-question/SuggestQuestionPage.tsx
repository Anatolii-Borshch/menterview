import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import questionsApi from '../../api/questionsApi';
import referenceApi from '../../api/referenceApi';
import type { CategoryDto, DifficultyDto, TagDto } from '../../api/models/referenceModels';
import { SuggestQuestionForm } from './SuggestQuestionForm';
import { SUGGEST_QUESTION_TEXT } from './SuggestQuestionConstants';
import type { SuggestQuestionFormState } from './SuggestQuestionTypes';

const initialFormState: SuggestQuestionFormState = {
  questionText: '',
  answer: '',
  categoryId: 0,
  difficultyId: 0,
  tagIds: [],
};

export default function SuggestQuestionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SuggestQuestionFormState>(initialFormState);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState<string | null>(null);

  const loadReferenceData = async () => {
    setTagsLoading(true);
    setTagsError(null);

    const [categoriesResult, difficultiesResult, tagsResult] = await Promise.allSettled([
      referenceApi.getCategories(),
      referenceApi.getDifficulties(),
      referenceApi.getTags(),
    ]);

    if (categoriesResult.status === 'fulfilled') {
      setCategories(categoriesResult.value.data.data ?? []);
    }

    if (difficultiesResult.status === 'fulfilled') {
      setDifficulties(difficultiesResult.value.data.data ?? []);
    }

    if (tagsResult.status === 'fulfilled') {
      const loadedTags = tagsResult.value.data.data ?? [];
      setTags(loadedTags);
      if (loadedTags.length === 0) {
        setTagsError(SUGGEST_QUESTION_TEXT.NO_TAGS_AVAILABLE);
      }
    } else {
      setTags([]);
      setTagsError(SUGGEST_QUESTION_TEXT.TAGS_LOAD_FAILED);
      toast.error(SUGGEST_QUESTION_TEXT.TAGS_LOAD_FAILED);
    }

    if (categoriesResult.status === 'rejected' || difficultiesResult.status === 'rejected') {
      toast.error(SUGGEST_QUESTION_TEXT.REF_DATA_PARTIAL_FAIL);
    }

    setTagsLoading(false);
  };

  useEffect(() => {
    loadReferenceData();
  }, []);

  const toggleTag = (tagId: number) => {
    setForm((current) => ({
      ...current,
      tagIds: current.tagIds.includes(tagId)
        ? current.tagIds.filter((id) => id !== tagId)
        : [...current.tagIds, tagId],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.categoryId || !form.difficultyId) {
      toast.error(SUGGEST_QUESTION_TEXT.SELECT_CATEGORY_AND_DIFFICULTY);
      return;
    }

    if (!form.tagIds.length) {
      toast.error(SUGGEST_QUESTION_TEXT.SELECT_TAG);
      return;
    }

    setLoading(true);
    try {
      const response = await questionsApi.suggest(form);
      if (response.data.isSuccess) {
        toast.success(SUGGEST_QUESTION_TEXT.SUBMIT_SUCCESS);
        navigate('/questions');
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(SUGGEST_QUESTION_TEXT.SUBMIT_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {SUGGEST_QUESTION_TEXT.TITLE}
          </h1>
          <p className="text-sm text-navy/50">{SUGGEST_QUESTION_TEXT.DESCRIPTION}</p>
        </div>

        <SuggestQuestionForm
          form={form}
          categories={categories}
          difficulties={difficulties}
          tags={tags}
          loading={loading}
          tagsLoading={tagsLoading}
          tagsError={tagsError}
          onFormChange={setForm}
          onToggleTag={toggleTag}
          onRetryTags={loadReferenceData}
          onCancel={() => navigate('/questions')}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
