import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import questionsApi from '../api/questionsApi';
import type { QuestionDetailsDto } from '../api/models/questionModels';

const difficultyColor: Record<string, string> = {
  Easy: 'text-green-600 bg-green-50 border-green-100',
  Medium: 'text-yellow-600 bg-yellow-50 border-yellow-100',
  Hard: 'text-red-600 bg-red-50 border-red-100',
};

export default function QuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<QuestionDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [rephrased, setRephrased] = useState<string | null>(null);
  const [rephrasing, setRephrasing] = useState(false);
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
        <Link to="/questions" className="text-sm text-navy/50 hover:text-navy mb-6 inline-block">
          ← Questions
        </Link>

        <div className="bg-white border border-periwinkle rounded-2xl p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-navy/40 border border-periwinkle rounded-full px-2.5 py-0.5">
                {question.categoryName}
              </span>
              {question.tags.map((tag) => (
                <span key={tag.tagId} className="text-xs text-navy/50 border border-periwinkle rounded-full px-2.5 py-0.5">
                  {tag.tagName}
                </span>
              ))}
            </div>
            <span
              className={`flex-shrink-0 text-xs border rounded-full px-2.5 py-0.5 font-medium ${
                difficultyColor[question.difficultyName] ?? 'text-navy/60 bg-white border-periwinkle'
              }`}
            >
              {question.difficultyName}
            </span>
          </div>

          {/* Question text */}
          <h1 className="text-xl text-navy mb-6 leading-relaxed" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {rephrased ?? question.question}
          </h1>

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

          {/* Answer */}
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
