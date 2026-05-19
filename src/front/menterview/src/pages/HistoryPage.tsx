import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import interviewApi from '../api/interviewApi';
import type { SessionListItemDto } from '../api/models/sessionModels';

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState<SessionListItemDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') ?? '1', 10);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await interviewApi.getSessions({ page, pageSize: PAGE_SIZE });
      if (res.data.isSuccess) {
        setSessions(res.data.data.items);
        setTotalCount(res.data.data.totalCount);
      }
    } catch {
      toast.error('Failed to load session history.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Session History
          </h1>
          <Link
            to="/interview/start"
            className="bg-navy hover:bg-cornflower text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            New session
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-periwinkle rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white border border-periwinkle rounded-2xl p-12 text-center">
            <p className="text-navy/40 text-sm mb-3">No sessions yet.</p>
            <Link
              to="/interview/start"
              className="inline-block bg-navy text-white text-sm px-4 py-2 rounded-lg hover:bg-cornflower transition-colors"
            >
              Start your first interview
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {sessions.map((ses) => (
                <Link
                  key={ses.sessionId}
                  to={`/history/${ses.sessionId}`}
                  className="block bg-white border border-periwinkle rounded-xl p-5 hover:border-cornflower/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-navy">{ses.categoryName}</p>
                      <p className="text-xs text-navy/40 mt-1">
                        {ses.questionsAmount} questions · {formatTime(ses.totalTime)} · {formatDate(ses.createdAt)}
                      </p>
                    </div>
                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      ses.score >= 80 ? 'bg-green-50 text-green-700'
                      : ses.score >= 60 ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-600'
                    }`}>
                      {ses.score}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setSearchParams({ page: String(page - 1) })}
                  className="border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy hover:border-navy/30 disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-sm text-navy/50">Page {page} of {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setSearchParams({ page: String(page + 1) })}
                  className="border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy hover:border-navy/30 disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
