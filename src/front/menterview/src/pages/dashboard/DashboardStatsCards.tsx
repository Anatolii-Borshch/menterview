import { COLORS } from '../../constants';
import type { DashboardStatCard } from './dashboardTypes';

interface DashboardStatsCardsProps {
  statCards: DashboardStatCard[];
}

export const DashboardStatsCards = ({ statCards }: DashboardStatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className={`${COLORS.BG_SECONDARY} ${COLORS.BORDER_PRIMARY} rounded-2xl p-5 border`}
        >
          <p className={`text-xs ${COLORS.TEXT_LIGHT} mb-1`}>{stat.label}</p>
          <p className="text-2xl text-navy font-semibold">{stat.value}</p>
          <p className={`text-xs ${COLORS.TEXT_LIGHTER} mt-0.5`}>{stat.sub}</p>
        </div>
      ))}
    </div>
  );
};
