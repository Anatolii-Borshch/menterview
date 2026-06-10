import { Link } from 'react-router-dom';
import type { AdminDashboardMetricCard } from './AdminDashboardTypes';

interface AdminDashboardMetricsProps {
  cards: AdminDashboardMetricCard[];
}

export const AdminDashboardMetrics = ({ cards }: AdminDashboardMetricsProps) => (
  <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
    {cards.map((card) => (
      <div key={card.title} className="rounded-2xl border border-periwinkle bg-white p-5">
        <p className="text-xs uppercase tracking-wide text-navy/35">{card.title}</p>
        <p className="mt-1 text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {card.value}
        </p>
        <Link to={card.to} className="mt-2 inline-block text-xs text-cornflower hover:underline">
          {card.ctaLabel}
        </Link>
      </div>
    ))}
  </div>
);
