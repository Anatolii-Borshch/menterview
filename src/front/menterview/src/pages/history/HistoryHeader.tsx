import { Link } from 'react-router-dom';
import type { HistoryHeaderProps } from './HistoryTypes';

export const HistoryHeader = ({ title, actionText, actionLink }: HistoryHeaderProps) => (
  <div className="mb-8 flex items-center justify-between">
    <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
      {title}
    </h1>
    <Link
      to={actionLink}
      className="rounded-lg bg-navy px-4 py-2 text-sm text-white transition-colors hover:bg-cornflower"
    >
      {actionText}
    </Link>
  </div>
);
