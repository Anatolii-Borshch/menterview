import type { SessionTrendPointDto, UserSessionStatsDto } from '../../api/models/sessionModels';

export type Granularity = 'day' | 'week' | 'month';

export interface StatsSummaryCard {
  label: string;
  value: string | number;
}

export interface StatsSummaryCardsProps {
  cards: StatsSummaryCard[];
}

export interface GranularitySelectorProps {
  value: Granularity;
  onChange: (next: Granularity) => void;
}

export interface StatsTrendChartProps {
  trend: SessionTrendPointDto[];
  loading: boolean;
  granularity: Granularity;
}

export interface StatsViewModel {
  stats: UserSessionStatsDto | null;
  trend: SessionTrendPointDto[];
  avgScore: number;
  avgAnswered: number;
}
