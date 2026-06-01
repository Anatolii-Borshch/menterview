import type { Granularity } from './StatsTypes';

export const STATS_TEXT = {
  TITLE: 'Statistics',
  TOTAL_SESSIONS: 'Total sessions',
  AVG_SCORE: 'Avg. score',
  AVG_ANSWERED: 'Avg. answered',
  SCORE_OVER_TIME: 'Score over time',
  LOADING: 'Loading…',
  NO_DATA: 'No data for this period.',
  LOAD_FAILED: 'Failed to load stats.',
} as const;

export const STATS_GRANULARITIES: Granularity[] = ['day', 'week', 'month'];
