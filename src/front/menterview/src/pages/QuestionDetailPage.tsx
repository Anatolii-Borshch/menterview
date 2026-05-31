import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../api/adminApi';
import { useAuthStore } from '../api/useAuthStore';
import questionsApi from '../api/questionsApi';
import { confirmToast } from '../components/common/confirmToast';
import type { CheckAnswerResponse, QuestionDetailsDto } from '../api/models/questionModels';

const difficultyColor: Record<string, string> = {
  Easy: 'text-green-600 bg-green-50 border-green-100',
  Medium: 'text-yellow-600 bg-yellow-50 border-yellow-100',
  Hard: 'text-red-600 bg-red-50 border-red-100',
};

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
    if (!questionId) return;
    questionsApi
      .getQuestion(parseInt(questionId, 10))
      .then((res) => {
        if (res.data.isSuccess) setQuestion(res.data.data);
        else toast.error('Question not found.');
      })
      .catch(() => toast.error('Failed to load question.'))
      .finally(() => setLoading(false));
  }, [questionId]);

  const handleRephrase = async () => {
    if (!questionId) return;
    setRephrasing(true);
    try {
      const res = await questionsApi.rephrase(parseInt(questionId, 10));
      if (res.data.isSuccess) {
        setRephrased(res.data.data.rephrased);
      } else {
        toast.error('Failed to rephrase question.');
      }
    } catch {
      toast.error('Failed to rephrase question.');
    } finally {
      setRephrasing(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (!questionId) return;
    if (!userAnswer.trim()) {
      toast.error('Please enter your answer first.');
      return;
    }

    setChecking(true);
    try {
      const res = await questionsApi.checkAnswer(parseInt(questionId, 10), {
        answerText: userAnswer.trim(),
      });

      if (res.data.isSuccess) {
        setCheckResult(res.data.data);
      } else {
        toast.error(res.data.errors[0] ?? 'Failed to check answer.');
      }
    } catch {
      toast.error('Failed to check answer.');
    } finally {
      setChecking(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionId) return;

    const confirmed = await confirmToast('Delete this question?', {
      title: 'Confirm deletion',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await adminApi.deleteQuestion(parseInt(questionId, 10));
      if (res.data.isSuccess) {
        toast.success('Question deleted.');
        navigate('/questions');
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to delete question.');
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
          <p className="text-navy/40 mb-4">Question not found.</p>
          <Link to="/questions" className="text-cornflower hover:underline text-sm">
            ← Back to questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link to="/questions" className="text-sm text-navy/50 hover:text-navy inline-block">
            ← Questions
          </Link>
          {isAdmin && (
            <button
              onClick={handleDeleteQuestion}
              disabled={deleting}
              className="text-xs border border-red-200 text-red-600 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete question'}
            </button>
          )}
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-navy/40 border border-periwinkle rounded-full px-2.5 py-0.5">
                {question.categoryName}
              </span>
            </div>
            <span
              className={`shrink-0 text-xs border rounded-full px-2.5 py-0.5 font-medium ${
                difficultyColor[question.difficultyName] ?? 'text-navy/60 bg-white border-periwinkle'
              }`}
            >
              {question.difficultyName}
            </span>
          </div>

          <h1 className="text-xl text-navy mb-6 leading-relaxed" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {rephrased ?? question.question}
          </h1>

          <div className="mb-6">
            <p className="text-[11px] text-navy/35 uppercase tracking-wide mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span key={tag.tagId} className="text-xs text-navy/50 border border-periwinkle rounded-full px-2.5 py-0.5">
                  {tag.tagName}
                </span>
              ))}
            </div>
          </div>

          {rephrased && (
            <p className="text-xs text-navy/40 mb-4 italic">AI rephrased version</p>
          )}

          <div className="flex gap-2 mb-8">
            <button
              onClick={handleRephrase}
              disabled={rephrasing}
              className="border border-periwinkle text-navy text-xs px-4 py-2 rounded-lg hover:border-cornflower hover:text-cornflower transition-colors disabled:opacity-50"
            >
              {rephrasing ? 'Rephrasing…' : rephrased ? 'Rephrase again' : 'Rephrase with AI'}
            </button>
            {rephrased && (
              <button
                onClick={() => setRephrased(null)}
                className="text-xs text-navy/40 hover:text-navy px-3 py-2"
              >
                Show original
              </button>
            )}
          </div>

          <div className="border-t border-periwinkle pt-6 mb-8">
            <h2 className="text-sm font-medium text-navy mb-3">Try your answer</h2>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={5}
              placeholder="Write your answer here, then run AI check..."
              className="w-full border border-periwinkle rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-cornflower"
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCheckAnswer}
                disabled={checking}
                className="border border-cornflower text-cornflower text-xs px-4 py-2 rounded-lg hover:bg-cornflower hover:text-white transition-colors disabled:opacity-50"
              >
                {checking ? 'Checking…' : 'Check with AI'}
              </button>
              {checkResult && (
                <button
                  onClick={() => setCheckResult(null)}
                  className="text-xs text-navy/40 hover:text-navy px-3 py-2"
                >
                  Clear result
                </button>
              )}
            </div>

            {checkResult && (
              <div className="mt-4 border border-periwinkle rounded-xl p-4 bg-snow">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 text-xs">
                  <div className="rounded-lg bg-white border border-periwinkle px-3 py-2">
                    <div className="text-navy/50">Accuracy</div>
                    <div className="text-navy font-semibold">{checkResult.accuracy}%</div>
                  </div>
                  <div className="rounded-lg bg-white border border-periwinkle px-3 py-2">
                    <div className="text-navy/50">Correctness</div>
                    <div className="text-navy font-semibold">{checkResult.correctness}%</div>
                  </div>
                  <div className="rounded-lg bg-white border border-periwinkle px-3 py-2">
                    <div className="text-navy/50">Completeness</div>
                    <div className="text-navy font-semibold">{checkResult.completeness}%</div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-navy/50 mb-1">AI feedback</p>
                  <p className="text-sm text-navy whitespace-pre-wrap leading-relaxed">
                    {checkResult.aiReply || 'No feedback returned.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-periwinkle pt-6">
            <button
              onClick={() => setShowAnswer((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-navy hover:text-cornflower transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showAnswer ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {showAnswer ? 'Hide answer' : 'Show answer'}
            </button>

            {showAnswer && (
              <div className="mt-4 p-4 bg-snow border border-periwinkle rounded-xl text-sm text-navy leading-relaxed whitespace-pre-wrap">
                {question.answer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
