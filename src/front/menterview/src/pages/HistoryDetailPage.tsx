import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import interviewApi from '../api/interviewApi';
import type { SessionDetailsDto } from '../api/models/sessionModels';

export default function HistoryDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    interviewApi
      .getSession(sessionId)
      .then((res) => {
        if (res.data.isSuccess) setSession(res.data.data);
        else toast.error('Session not found.');
      })
      .catch(() => toast.error('Failed to load session.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const formatDuration = (seconds: number) => formatTime(seconds);

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <p className="text-navy/40 text-sm">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy/40 mb-4">Session not found.</p>
          <Link to="/history" className="text-cornflower hover:underline text-sm">← Back to history</Link>
        </div>
      </div>
    );
  }

  const score = Math.round(session.averageAccuracy);
  const scoreColor =
    score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-500';

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/history" className="text-sm text-navy/50 hover:text-navy mb-6 inline-block">
          ← History
        </Link>

        <div className="bg-white border border-periwinkle rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
                {session.category?.categoryName ?? 'Session'}
              </h1>
              <p className="text-sm text-navy/50 mt-1">
                {new Date(session.time).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}%</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Questions', value: session.questionsAmount },
              { label: 'Answered', value: session.answeredCount },
              { label: 'Duration', value: formatTime(session.totalTime) },
              { label: 'Accuracy', value: `${score}%` },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-snow rounded-xl border border-periwinkle">
                <p className="text-lg font-semibold text-navy">{s.value}</p>
                <p className="text-xs text-navy/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-lg text-navy mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Answer breakdown
        </h2>

        <div className="space-y-3">
          {session.answers.map((ans, idx) => (
            <div
              key={ans.answerId}
              className="bg-white border border-periwinkle rounded-xl overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex items-start justify-between gap-4"
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy line-clamp-2">{ans.questionText}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-navy/40">
                      {formatDuration(ans.answeringTime)}
                    </span>
                    <span className={`text-xs font-medium ${
                      (ans.correctness ?? 0) >= 80 ? 'text-green-600'
                      : (ans.correctness ?? 0) >= 50 ? 'text-yellow-600'
                      : 'text-red-500'
                    }`}>
                      {ans.correctness ?? 0}% correct
                    </span>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-navy/30 shrink-0 transition-transform mt-0.5 ${expandedIdx === idx ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedIdx === idx && (
                <div className="border-t border-periwinkle p-4 space-y-4">
                  <div>
                    <p className="text-xs font-medium text-navy/40 uppercase tracking-wide mb-1">Your answer</p>
                    <p className="text-sm text-navy">{ans.answerText || <span className="italic text-navy/30">No answer provided</span>}</p>
                  </div>
                  {ans.aiReply && (
                    <div>
                      <p className="text-xs font-medium text-navy/40 uppercase tracking-wide mb-1">AI feedback</p>
                      <p className="text-sm text-navy/80">{ans.aiReply}</p>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-navy">{ans.correctness ?? 0}%</p>
                      <p className="text-xs text-navy/40">Correctness</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-navy">{ans.completeness ?? 0}%</p>
                      <p className="text-xs text-navy/40">Completeness</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-navy">{ans.accuracy}%</p>
                      <p className="text-xs text-navy/40">Accuracy</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
