import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import interviewApi from '../../api/interviewApi';
import type { SessionDetailsDto } from '../../api/models/sessionModels';
import { HistoryDetailAnswersList } from './HistoryDetailAnswersList';
import { HISTORY_DETAIL_TEXT } from './HistoryDetailConstants';
import { HistoryDetailHeader } from './HistoryDetailHeader';

export default function HistoryDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    interviewApi
      .getSession(sessionId)
      .then((response) => {
        if (response.data.isSuccess) {
          setSession(response.data.data);
        } else {
          toast.error(HISTORY_DETAIL_TEXT.NOT_FOUND);
        }
      })
      .catch(() => toast.error(HISTORY_DETAIL_TEXT.LOAD_FAILED))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleToggleExpanded = (index: number) => {
    setExpandedIndex((currentIndex) => {
      if (currentIndex === index) {
        return null;
      }
      return index;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-snow">
        <p className="text-sm text-navy/40">{HISTORY_DETAIL_TEXT.LOADING}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-snow">
        <div className="text-center">
          <p className="mb-4 text-navy/40">{HISTORY_DETAIL_TEXT.NOT_FOUND}</p>
          <Link to="/history" className="text-sm text-cornflower hover:underline">
            {HISTORY_DETAIL_TEXT.BACK_TO_HISTORY}
          </Link>
        </div>
      </div>
    );
  }

  const score = Math.round(session.averageAccuracy);

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <HistoryDetailHeader session={session} score={score} />

        <HistoryDetailAnswersList
          answers={session.answers}
          expandedIndex={expandedIndex}
          onToggleExpanded={handleToggleExpanded}
        />
      </div>
    </div>
  );
}
