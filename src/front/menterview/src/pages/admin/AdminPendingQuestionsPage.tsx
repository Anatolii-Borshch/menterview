import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import referenceApi from '../../api/referenceApi';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import type { AdminQuestionListItemDto, PendingQuestionDetailsDto } from '../../api/models/adminModels';
import type { TagDto } from '../../api/models/referenceModels';

export default function AdminPendingQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestionListItemDto[]>([]);
  const [detailsById, setDetailsById] = useState<Record<number, PendingQuestionDetailsDto>>({});
  const [tagDraftById, setTagDraftById] = useState<Record<number, number[]>>({});
  const [allTags, setAllTags] = useState<TagDto[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acting, setActing] = useState<number | null>(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState<number | null>(null);

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

  useEffect(() => {
    referenceApi.getTags()
      .then((res) => {
        if (res.data.isSuccess) {
          setAllTags(res.data.data);
        }
      })
      .catch(() => toast.error('Failed to load tags.'));
  }, []);

  const loadPendingDetails = async (id: number) => {
    if (detailsById[id]) return;

    setLoadingDetailsId(id);
    try {
      const res = await adminApi.getPendingQuestion(id);
      if (res.data.isSuccess) {
        const details = res.data.data;
        setDetailsById((prev) => ({ ...prev, [id]: details }));
        setTagDraftById((prev) => ({
          ...prev,
          [id]: details.tags.map((t) => t.tagId),
        }));
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to load question details.');
    } finally {
      setLoadingDetailsId(null);
    }
  };

  const toggleExpanded = (id: number) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    if (next !== null) {
      loadPendingDetails(next);
    }
  };

  const toggleTag = (suggestionId: number, tagId: number) => {
    setTagDraftById((prev) => {
      const current = prev[suggestionId] ?? [];
      const next = current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId];
      return { ...prev, [suggestionId]: next };
    });
  };

  const saveTags = async (suggestionId: number) => {
    const tagIds = tagDraftById[suggestionId] ?? [];
    if (!tagIds.length) {
      toast.error('At least one tag is required.');
      return;
    }

    setActing(suggestionId);
    try {
      const res = await adminApi.updatePendingQuestionTags(suggestionId, { tagIds });
      if (res.data.isSuccess) {
        toast.success('Tags updated.');
        setDetailsById((prev) => {
          const details = prev[suggestionId];
          if (!details) return prev;
          const updatedTags = allTags.filter((t) => tagIds.includes(t.tagId));
          return {
            ...prev,
            [suggestionId]: {
              ...details,
              tags: updatedTags,
            },
          };
        });
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to update tags.');
    } finally {
      setActing(null);
    }
  };

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
      const res = await adminApi.rejectQuestion(rejectId, { rejectionReason: rejectReason || undefined });
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
    <AdminPanelLayout
      title="Pending questions"
      subtitle="Approve, reject, and adjust tags before suggested questions become live."
    >

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
                    <p className="text-sm font-medium text-navy">{q.questionText}</p>
                    <p className="text-xs text-navy/40 mt-1">
                      by {q.submittedByName ?? 'Unknown'} · {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleExpanded(q.suggestionId)}
                    className="text-xs text-cornflower hover:underline"
                  >
                    {expandedId === q.suggestionId ? 'Hide details' : 'View details'}
                  </button>
                </div>

                {expandedId === q.suggestionId && (
                  <div className="mb-4 border border-periwinkle/80 rounded-xl p-4 bg-snow/60 space-y-3">
                    {loadingDetailsId === q.suggestionId ? (
                      <p className="text-xs text-navy/50">Loading details…</p>
                    ) : detailsById[q.suggestionId] ? (
                      <>
                        <div>
                          <p className="text-[11px] text-navy/40 mb-1">Exact question</p>
                          <p className="text-sm text-navy">{detailsById[q.suggestionId].questionText}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-navy/40 mb-1">Expected answer</p>
                          <p className="text-sm text-navy whitespace-pre-wrap">{detailsById[q.suggestionId].answer}</p>
                        </div>
                        <div className="text-xs text-navy/50">
                          {detailsById[q.suggestionId].category.categoryName} · {detailsById[q.suggestionId].difficulty.difficultyName}
                        </div>
                        <div>
                          <p className="text-[11px] text-navy/40 mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {allTags.map((tag) => {
                              const selected = (tagDraftById[q.suggestionId] ?? []).includes(tag.tagId);
                              return (
                                <button
                                  key={tag.tagId}
                                  type="button"
                                  onClick={() => toggleTag(q.suggestionId, tag.tagId)}
                                  className={`py-1 px-3 rounded-full border text-xs transition-colors ${
                                    selected
                                      ? 'border-cornflower bg-cornflower text-white'
                                      : 'border-periwinkle text-navy/60 hover:border-navy/30'
                                  }`}
                                >
                                  {tag.tagName}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => saveTags(q.suggestionId)}
                            disabled={acting === q.suggestionId}
                            className="mt-3 bg-navy hover:bg-cornflower text-white text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {acting === q.suggestionId ? 'Saving…' : 'Save tags'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-red-500">Failed to load details.</p>
                    )}
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
    </AdminPanelLayout>
  );
}
