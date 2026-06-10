import type { SessionListItemDto } from '../../api/models/sessionModels';

export interface HistoryHeaderProps {
  title: string;
  actionText: string;
  actionLink: string;
}

export interface HistoryLoadingListProps {
  itemCount: number;
}

export interface HistoryEmptyStateProps {
  message: string;
  actionText: string;
  actionLink: string;
}

export interface HistorySessionListProps {
  sessions: SessionListItemDto[];
  onFormatTime: (seconds: number) => string;
  onFormatDate: (isoDate: string) => string;
}

export interface HistoryPaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}
