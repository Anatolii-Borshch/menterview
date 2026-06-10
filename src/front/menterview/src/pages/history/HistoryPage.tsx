import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import interviewApi from '../../api/interviewApi';
import type { SessionListItemDto } from '../../api/models/sessionModels';
import { HistoryEmptyState } from './HistoryEmptyState';
import { HistoryHeader } from './HistoryHeader';
import { HISTORY_CONSTANTS, HISTORY_TEXT } from './HistoryConstants';
import {
  formatSessionDate,
  formatSessionDuration,
  getHistoryPageFromSearchParam,
  getHistoryTotalPages,
} from './HistoryHelpers';
import { HistoryLoadingList } from './HistoryLoadingList';
import { HistoryPagination } from './HistoryPagination';
import { HistorySessionList } from './HistorySessionList';

export default function HistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState<SessionListItemDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = getHistoryPageFromSearchParam(searchParams.get('page'));

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await interviewApi.getSessions({
        page,
        pageSize: HISTORY_CONSTANTS.PAGE_SIZE,
      });

      if (response.data.isSuccess) {
        setSessions(response.data.data.items);
        setTotalCount(response.data.data.totalCount);
      }
    } catch {
      toast.error(HISTORY_TEXT.LOADING_FAILED);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const totalPages = getHistoryTotalPages(totalCount);

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <HistoryHeader
          title={HISTORY_TEXT.TITLE}
          actionText={HISTORY_TEXT.NEW_SESSION}
          actionLink="/interview/start"
        />

        {loading && <HistoryLoadingList itemCount={HISTORY_CONSTANTS.SKELETON_ITEMS} />}

        {!loading && sessions.length === 0 && (
          <HistoryEmptyState
            message={HISTORY_TEXT.EMPTY_MESSAGE}
            actionText={HISTORY_TEXT.START_FIRST_INTERVIEW}
            actionLink="/interview/start"
          />
        )}

        {!loading && sessions.length > 0 && (
          <>
            <HistorySessionList
              sessions={sessions}
              onFormatTime={formatSessionDuration}
              onFormatDate={formatSessionDate}
            />

            {totalPages > 1 && (
              <HistoryPagination
                page={page}
                totalPages={totalPages}
                onPrevious={() => setSearchParams({ page: String(page - 1) })}
                onNext={() => setSearchParams({ page: String(page + 1) })}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
