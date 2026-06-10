import type { StatsSummaryCardsProps } from './StatsTypes';

export const StatsSummaryCards = ({ cards }: StatsSummaryCardsProps) => (
  <div className="mb-8 grid grid-cols-3 gap-4">
    {cards.map((card) => (
      <div key={card.label} className="rounded-2xl border border-periwinkle bg-white p-5 text-center">
        <p className="text-2xl font-semibold text-navy">{card.value}</p>
        <p className="mt-1 text-xs text-navy/40">{card.label}</p>
      </div>
    ))}
  </div>
);
