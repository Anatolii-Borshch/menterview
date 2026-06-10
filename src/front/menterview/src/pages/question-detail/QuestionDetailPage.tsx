import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import questionsApi from '../../api/questionsApi';
import type { CheckAnswerResponse, QuestionDetailsDto } from '../../api/models/questionModels';
import { useAuthStore } from '../../api/useAuthStore';
import { confirmToast } from '../../components/common/confirmToast';
import { AnswerCheckPanel } from './AnswerCheckPanel';
import { ExpectedAnswerPanel } from './ExpectedAnswerPanel';
import { QUESTION_DETAIL_TEXT, QUESTION_DIFFICULTY_COLORS } from './QuestionDetailConstants';
import { QuestionMeta } from './QuestionMeta';
import { QuestionTopBar } from './QuestionTopBar';
import { RephraseActions } from './RephraseActions';

export default function QuestionDetailPage() {
  const navigate = useNavigate();
  const { role } = useAuthStore();
  const isAdmin = role === 'Administrator';
  const { questionId } = useParams<{ questionId: string }>();

  const [question, setQuestion] = useState<QuestionDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [rephrased, setRephrased] = useState<string | null>(null);
  const [rephrasing, setRephrasing] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckAnswerResponse | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!questionId) {
      return;
    }

    questionsApi
      .getQuestion(Number.parseInt(questionId, 10))
      .then((response) => {
        if (response.data.isSuccess) {
          setQuestion(response.data.data);
        } else {
          toast.error(QUESTION_DETAIL_TEXT.NOT_FOUND);
        }
      })
      .catch(() => toast.error(QUESTION_DETAIL_TEXT.LOAD_FAILED))
      .finally(() => setLoading(false));
  }, [questionId]);

  const handleRephrase = async () => {
    if (!questionId) {
      return;
    }

    setRephrasing(true);
    try {
      const response = await questionsApi.rephrase(Number.parseInt(questionId, 10));
      if (response.data.isSuccess) {
        setRephrased(response.data.data.rephrased);
      } else {
        toast.error(QUESTION_DETAIL_TEXT.REPHRASE_FAILED);
      }
    } catch {
      toast.error(QUESTION_DETAIL_TEXT.REPHRASE_FAILED);
    } finally {
      setRephrasing(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (!questionId) {
      return;
    }

    if (!userAnswer.trim()) {
      toast.error(QUESTION_DETAIL_TEXT.ANSWER_REQUIRED);
      return;
    }

    setChecking(true);
    try {
      const response = await questionsApi.checkAnswer(Number.parseInt(questionId, 10), {
        answerText: userAnswer.trim(),
      });

      if (response.data.isSuccess) {
        setCheckResult(response.data.data);
      } else {
        toast.error(response.data.errors[0] ?? QUESTION_DETAIL_TEXT.CHECK_FAILED);
      }
    } catch {
      toast.error(QUESTION_DETAIL_TEXT.CHECK_FAILED);
    } finally {
      setChecking(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionId) {
      return;
    }

    const confirmed = await confirmToast(QUESTION_DETAIL_TEXT.DELETE_CONFIRM_MESSAGE, {
      title: QUESTION_DETAIL_TEXT.DELETE_CONFIRM_TITLE,
      confirmText: QUESTION_DETAIL_TEXT.DELETE_CONFIRM_ACTION,
      danger: true,
    });
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    try {
      const response = await adminApi.deleteQuestion(Number.parseInt(questionId, 10));
      if (response.data.isSuccess) {
        toast.success(QUESTION_DETAIL_TEXT.QUESTION_DELETED);
        navigate('/questions');
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(QUESTION_DETAIL_TEXT.DELETE_FAILED);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <p className="text-navy/40 text-sm">Loading…</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy/40 mb-4">{QUESTION_DETAIL_TEXT.NOT_FOUND}</p>
          <Link to="/questions" className="text-cornflower hover:underline text-sm">
            {QUESTION_DETAIL_TEXT.BACK_TO_QUESTIONS}
          </Link>
        </div>
      </div>
    );
  }

  const difficultyClassName =
    QUESTION_DIFFICULTY_COLORS[question.difficultyName] ?? 'text-navy/60 bg-white border-periwinkle';

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <QuestionTopBar isAdmin={isAdmin} deleting={deleting} onDelete={handleDeleteQuestion} />

        <div className="bg-white border border-periwinkle rounded-2xl p-8">
          <QuestionMeta
            question={question}
            rephrased={rephrased}
            difficultyClassName={difficultyClassName}
          />

          <RephraseActions
            rephrased={rephrased}
            rephrasing={rephrasing}
            onRephrase={handleRephrase}
            onShowOriginal={() => setRephrased(null)}
          />

          <AnswerCheckPanel
            userAnswer={userAnswer}
            checking={checking}
            checkResult={checkResult}
            onUserAnswerChange={setUserAnswer}
            onCheckAnswer={handleCheckAnswer}
            onClearResult={() => setCheckResult(null)}
          />

          <ExpectedAnswerPanel
            answer={question.answer}
            showAnswer={showAnswer}
            onToggleShowAnswer={() => setShowAnswer((value) => !value)}
          />
        </div>
      </div>
    </div>
  );
}
