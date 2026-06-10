import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import referenceApi from '../../api/referenceApi';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import type { AdminQuestionListItemDto, PendingQuestionDetailsDto } from '../../api/models/adminModels';
import type { TagDto } from '../../api/models/referenceModels';
import { ADMIN_PENDING_QUESTIONS_TEXT } from './AdminPendingQuestionsConstants';
import { formatQuestionDate } from './AdminPendingQuestionsHelpers';

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
      const response = await adminApi.getPendingQuestions();
      if (response.data.isSuccess) {
        setQuestions(response.data.data.items);
      }
    } catch {
      toast.error(ADMIN_PENDING_QUESTIONS_TEXT.FAILED_TO_LOAD_QUESTIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    referenceApi
      .getTags()
      .then((response) => {
        if (response.data.isSuccess) {
          setAllTags(response.data.data);
        }
      })
      .catch(() => toast.error(ADMIN_PENDING_QUESTIONS_TEXT.FAILED_TO_LOAD_TAGS));
  }, []);

  const loadPendingDetails = async (id: number) => {
    if (detailsById[id]) {
      return;
    }

    setLoadingDetailsId(id);
    try {
      const response = await adminApi.getPendingQuestion(id);
      if (response.data.isSuccess) {
        const details = response.data.data;
        setDetailsById((prev) => ({ ...prev, [id]: details }));
        setTagDraftById((prev) => ({
          ...prev,
          [id]: details.tags.map((tag) => tag.tagId),
        }));
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(ADMIN_PENDING_QUESTIONS_TEXT.FAILED_TO_LOAD_DETAILS);
    } finally {
      setLoadingDetailsId(null);
    }
  };

  const toggleExpanded = (id: number) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    if (next !== null) {
      void loadPendingDetails(next);
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
      toast.error(ADMIN_PENDING_QUESTIONS_TEXT.TAG_REQUIRED);
      return;
    }

    setActing(suggestionId);
    try {
      const response = await adminApi.updatePendingQuestionTags(suggestionId, { tagIds });
      if (response.data.isSuccess) {
        toast.success(ADMIN_PENDING_QUESTIONS_TEXT.TAGS_UPDATED);
        setDetailsById((prev) => {
          const details = prev[suggestionId];
          if (!details) {
            return prev;
          }

          const updatedTags = allTags.filter((tag) => tagIds.includes(tag.tagId));
          return {
            ...prev,
            [suggestionId]: {
              ...details,
              tags: updatedTags,
            },
          };
        });
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(ADMIN_PENDING_QUESTIONS_TEXT.TAGS_UPDATE_FAILED);
    } finally {
      setActing(null);
    }
  };

  const handleApprove = async (id: number) => {
    setActing(id);
    try {
      const response = await adminApi.approveQuestion(id);
      if (response.data.isSuccess) {
        toast.success(ADMIN_PENDING_QUESTIONS_TEXT.QUESTION_APPROVED);
        setQuestions((current) => current.filter((item) => item.suggestionId !== id));
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(ADMIN_PENDING_QUESTIONS_TEXT.QUESTION_APPROVE_FAILED);
    } finally {
      setActing(null);
    }
  };

  const handleReject = async () => {
    if (rejectId === null) {
      return;
    }

    setActing(rejectId);
    try {
      const response = await adminApi.rejectQuestion(rejectId, {
        rejectionReason: rejectReason || undefined,
      });
      if (response.data.isSuccess) {
        toast.success(ADMIN_PENDING_QUESTIONS_TEXT.QUESTION_REJECTED);
        setQuestions((current) => current.filter((item) => item.suggestionId !== rejectId));
        setRejectId(null);
        setRejectReason('');
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(ADMIN_PENDING_QUESTIONS_TEXT.QUESTION_REJECT_FAILED);
    } finally {
      setActing(null);
    }
  };

  return (
    <AdminPanelLayout
      title={ADMIN_PENDING_QUESTIONS_TEXT.TITLE}
      subtitle={ADMIN_PENDING_QUESTIONS_TEXT.SUBTITLE}
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 rounded-xl border border-periwinkle bg-white animate-pulse" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border border-periwinkle bg-white p-12 text-center">
          <p className="text-sm text-navy/40">{ADMIN_PENDING_QUESTIONS_TEXT.NO_PENDING}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.suggestionId} className="rounded-2xl border border-periwinkle bg-white p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">{question.questionText}</p>
                  <p className="mt-1 text-xs text-navy/40">
                    {ADMIN_PENDING_QUESTIONS_TEXT.BY} {question.submittedByName ?? ADMIN_PENDING_QUESTIONS_TEXT.UNKNOWN} ·{' '}
                    {formatQuestionDate(question.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpanded(question.suggestionId)}
                  className="text-xs text-cornflower hover:underline"
                >
                  {expandedId === question.suggestionId
                    ? ADMIN_PENDING_QUESTIONS_TEXT.HIDE_DETAILS
                    : ADMIN_PENDING_QUESTIONS_TEXT.VIEW_DETAILS}
                </button>
              </div>

              {expandedId === question.suggestionId && (
                <div className="mb-4 space-y-3 rounded-xl border border-periwinkle/80 bg-snow/60 p-4">
                  {loadingDetailsId === question.suggestionId ? (
                    <p className="text-xs text-navy/50">{ADMIN_PENDING_QUESTIONS_TEXT.LOADING_DETAILS}</p>
                  ) : detailsById[question.suggestionId] ? (
                    <>
                      <div>
                        <p className="mb-1 text-[11px] text-navy/40">{ADMIN_PENDING_QUESTIONS_TEXT.EXACT_QUESTION}</p>
                        <p className="text-sm text-navy">{detailsById[question.suggestionId].questionText}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] text-navy/40">{ADMIN_PENDING_QUESTIONS_TEXT.EXPECTED_ANSWER}</p>
                        <p className="whitespace-pre-wrap text-sm text-navy">{detailsById[question.suggestionId].answer}</p>
                      </div>
                      <div className="text-xs text-navy/50">
                        {detailsById[question.suggestionId].category.categoryName} ·{' '}
                        {detailsById[question.suggestionId].difficulty.difficultyName}
                      </div>
                      <div>
                        <p className="mb-2 text-[11px] text-navy/40">{ADMIN_PENDING_QUESTIONS_TEXT.TAGS}</p>
                        <div className="mb-3 flex flex-wrap gap-2">
                          {allTags.map((tag) => {
                            const selected = (tagDraftById[question.suggestionId] ?? []).includes(tag.tagId);
                            return (
                              <button
                                key={tag.tagId}
                                type="button"
                                onClick={() => toggleTag(question.suggestionId, tag.tagId)}
                                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
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
                          onClick={() => saveTags(question.suggestionId)}
                          disabled={acting === question.suggestionId}
                          className="rounded-lg bg-navy px-4 py-2 text-xs text-white transition-colors hover:bg-cornflower disabled:opacity-50"
                        >
                          {acting === question.suggestionId ? ADMIN_PENDING_QUESTIONS_TEXT.SAVING_TAGS : ADMIN_PENDING_QUESTIONS_TEXT.SAVE_TAGS}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-red-500">{ADMIN_PENDING_QUESTIONS_TEXT.FAILED_TO_LOAD_DETAILS}</p>
                  )}
                </div>
              )}

              {rejectId === question.suggestionId ? (
                <div className="space-y-2">
                  <textarea
                    value={rejectReason}
                    onChange={(event) => setRejectReason(event.target.value)}
                    placeholder={ADMIN_PENDING_QUESTIONS_TEXT.REASON_PLACEHOLDER}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy focus:border-cornflower focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={acting === question.suggestionId}
                      className="rounded-lg bg-red-500 px-4 py-2 text-xs text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                    >
                      {acting === question.suggestionId ? ADMIN_PENDING_QUESTIONS_TEXT.REJECTING : ADMIN_PENDING_QUESTIONS_TEXT.CONFIRM_REJECT}
                    </button>
                    <button
                      onClick={() => {
                        setRejectId(null);
                        setRejectReason('');
                      }}
                      className="px-3 py-2 text-xs text-navy/40 hover:text-navy"
                    >
                      {ADMIN_PENDING_QUESTIONS_TEXT.CANCEL}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(question.suggestionId)}
                    disabled={acting === question.suggestionId}
                    className="rounded-lg bg-navy px-4 py-2 text-xs text-white transition-colors hover:bg-cornflower disabled:opacity-50"
                  >
                    {acting === question.suggestionId ? '…' : ADMIN_PENDING_QUESTIONS_TEXT.APPROVE}
                  </button>
                  <button
                    onClick={() => setRejectId(question.suggestionId)}
                    className="rounded-lg border border-red-100 px-4 py-2 text-xs text-red-500 transition-colors hover:bg-red-50"
                  >
                    {ADMIN_PENDING_QUESTIONS_TEXT.REJECT}
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
