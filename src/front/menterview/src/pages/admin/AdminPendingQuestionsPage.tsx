import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import type { AdminQuestionListItemDto } from '../../api/models/adminModels';

export default function AdminPendingQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestionListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acting, setActing] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingQuestions();
      if (res.data.isSuccess) setQuestions(res.data.data.items);
    } catch {
      toast.error('Failed to load pending questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    setActing(id);
    try {
      const res = await adminApi.approveQuestion(id);
      if (res.data.isSuccess) {
        toast.success('Question approved.');
        setQuestions((q) => q.filter((item) => item.suggestionId !== id));
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to approve question.');
    } finally {
      setActing(null);
    }
  };

  const handleReject = async () => {
    if (rejectId === null) return;
    setActing(rejectId);
    try {
      const res = await adminApi.rejectQuestion(rejectId, { reason: rejectReason });
      if (res.data.isSuccess) {
        toast.success('Question rejected.');
        setQuestions((q) => q.filter((item) => item.suggestionId !== rejectId));
        setRejectId(null);
        setRejectReason('');
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to reject question.');
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Pending Questions
            </h1>
            <p className="text-xs text-navy/40 mt-1">Admin panel</p>
          </div>
          <Link to="/admin/users" className="text-sm text-cornflower hover:underline">
            ← Users
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-periwinkle rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white border border-periwinkle rounded-2xl p-12 text-center">
            <p className="text-navy/40 text-sm">No pending questions. You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.suggestionId} className="bg-white border border-periwinkle rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">{q.question}</p>
                    <p className="text-xs text-navy/40 mt-1">
                      by {q.authorEmail} · {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {q.answer && (
                  <div className="bg-snow border border-periwinkle rounded-xl p-3 mb-4 text-sm text-navy/70">
                    {q.answer}
                  </div>
                )}

                {rejectId === q.suggestionId ? (
                  <div className="space-y-2">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (optional)"
                      rows={2}
                      className="w-full border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-cornflower resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleReject}
                        disabled={acting === q.suggestionId}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {acting === q.suggestionId ? 'Rejecting…' : 'Confirm reject'}
                      </button>
                      <button
                        onClick={() => { setRejectId(null); setRejectReason(''); }}
                        className="text-xs text-navy/40 hover:text-navy px-3 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(q.suggestionId)}
                      disabled={acting === q.suggestionId}
                      className="bg-navy hover:bg-cornflower text-white text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {acting === q.suggestionId ? '…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setRejectId(q.suggestionId)}
                      className="border border-red-100 text-red-500 hover:bg-red-50 text-xs px-4 py-2 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
