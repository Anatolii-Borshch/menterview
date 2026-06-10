import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import interviewApi from '../../api/interviewApi';
import referenceApi from '../../api/referenceApi';
import type { ApiResponse } from '../../api/models/authModels';
import type { CategoryDto, DifficultyDto } from '../../api/models/referenceModels';
import { createInitialInterviewStartForm, getInterviewStartWeakTopicRatio } from './interviewStartHelpers';
import { InterviewStartForm } from './interviewStartForm';
import { INTERVIEW_START_TEXT } from './interviewStartConstants';

export default function InterviewStartPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyDto[]>([]);
  const [refLoading, setRefLoading] = useState(true);
  const [form, setForm] = useState(createInitialInterviewStartForm);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    Promise.all([referenceApi.getCategories(), referenceApi.getDifficulties()])
      .then(([categoryResponse, difficultyResponse]) => {
        if (categoryResponse.data.isSuccess) {
          setCategories(categoryResponse.data.data);
        }

        if (difficultyResponse.data.isSuccess) {
          setDifficulties(difficultyResponse.data.data);
        }
      })
      .catch(() => toast.error(INTERVIEW_START_TEXT.LOAD_FAILED))
      .finally(() => setRefLoading(false));
  }, []);

  const handleStart = async () => {
    setStarting(true);

    try {
      const response = await interviewApi.start({
        categoryId: form.categoryId,
        difficultyId: form.difficultyId,
        questionsAmount: form.questionsAmount,
        weakTopicRatio: getInterviewStartWeakTopicRatio(form.includeWeakTopics),
      });

      if (response.data.isSuccess) {
        navigate(`/interview/${response.data.data.sessionId}`, {
          state: response.data.data,
        });
        return;
      }

      response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        const errors = error.response?.data?.errors;

        if (errors && errors.length > 0) {
          errors.forEach((errorMessage) => toast.error(errorMessage));
        } else {
          toast.error(INTERVIEW_START_TEXT.START_FAILED);
        }
      } else {
        toast.error(INTERVIEW_START_TEXT.START_FAILED);
      }
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-xl px-6 py-10">
        <h1 className="mb-2 text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {INTERVIEW_START_TEXT.TITLE}
        </h1>
        <p className="mb-8 text-sm text-navy/50">{INTERVIEW_START_TEXT.DESCRIPTION}</p>

        <InterviewStartForm
          categories={categories}
          difficulties={difficulties}
          form={form}
          refLoading={refLoading}
          starting={starting}
          onToggleCategory={(categoryId) => setForm((current) => ({ ...current, categoryId }))}
          onToggleDifficulty={(difficultyId) => setForm((current) => ({ ...current, difficultyId }))}
          onQuestionsAmountChange={(questionsAmount) => setForm((current) => ({ ...current, questionsAmount }))}
          onToggleWeakTopics={() => setForm((current) => ({ ...current, includeWeakTopics: !current.includeWeakTopics }))}
          onStart={handleStart}
        />
      </div>
    </div>
  );
}
