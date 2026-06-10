import type { SessionTrendPointDto } from '../../api/models/sessionModels';
import type { Granularity, StatsSummaryCard } from './StatsTypes';
import { STATS_TEXT } from './StatsConstants';

export const averageFromList = (values: number[]): number => {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
};

export const formatStatsDate = (isoDate: string, granularity: Granularity): string =>
  new Date(isoDate).toLocaleDateString(
    'en-US',
    granularity === 'month'
      ? { month: 'short' }
      : { month: 'short', day: 'numeric' }
  );

export const getTrendMaxScore = (trend: SessionTrendPointDto[]): number =>
  Math.max(...trend.map((point) => point.averageAccuracy), 100);

export const getTrendAxisPoints = (trend: SessionTrendPointDto[]): SessionTrendPointDto[] =>
  trend.filter(
    (_, index) =>
      index === 0 ||
      index === trend.length - 1 ||
      index % Math.ceil(trend.length / 4) === 0
  );

export const buildStatsSummaryCards = (
  totalSessionsCount: number,
  avgScore: number,
  avgAnswered: number
): StatsSummaryCard[] => [
  { label: STATS_TEXT.TOTAL_SESSIONS, value: totalSessionsCount },
  { label: STATS_TEXT.AVG_SCORE, value: `${avgScore}%` },
  { label: STATS_TEXT.AVG_ANSWERED, value: avgAnswered },
];
