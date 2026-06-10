import { Link } from 'react-router-dom';
import type { HistoryEmptyStateProps } from './HistoryTypes';

export const HistoryEmptyState = ({ message, actionText, actionLink }: HistoryEmptyStateProps) => (
  <div className="rounded-2xl border border-periwinkle bg-white p-12 text-center">
    <p className="mb-3 text-sm text-navy/40">{message}</p>
    <Link
      to={actionLink}
      className="inline-block rounded-lg bg-navy px-4 py-2 text-sm text-white transition-colors hover:bg-cornflower"
    >
      {actionText}
    </Link>
  </div>
);
