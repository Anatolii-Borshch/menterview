import type { UserProfileDto } from '../../api/models/profileModels';
import type { SessionListItemDto } from '../../api/models/sessionModels';
import { STAT_CARD_LABELS } from '../../constants';
import { DASHBOARD_CONSTANTS } from './dashboardConstants';
import type { AccuracyColorConfig, DashboardStatCard } from './dashboardTypes';

export const getAccuracyColor = (accuracy: number): AccuracyColorConfig => {
  if (accuracy >= DASHBOARD_CONSTANTS.ACCURACY_THRESHOLDS.HIGH) {
    return { bgClass: 'bg-green-50', textClass: 'text-green-700' };
  }

  if (accuracy >= DASHBOARD_CONSTANTS.ACCURACY_THRESHOLDS.MEDIUM) {
    return { bgClass: 'bg-yellow-50', textClass: 'text-yellow-700' };
  }

  return { bgClass: 'bg-red-50', textClass: 'text-red-600' };
};

export const buildDashboardStatCards = (
  sessions: SessionListItemDto[],
  profile: UserProfileDto | null,
  avgScore: number | null
): DashboardStatCard[] => [
  {
    label: STAT_CARD_LABELS.SESSIONS_DONE,
    value: sessions.length > 0 ? `${sessions.length}+` : '0',
    sub: STAT_CARD_LABELS.TOTAL,
  },
  {
    label: STAT_CARD_LABELS.AVG_SCORE,
    value: avgScore === null ? STAT_CARD_LABELS.DEFAULT_STAT : `${avgScore}%`,
    sub: STAT_CARD_LABELS.LAST_3_SESSIONS,
  },
  {
    label: STAT_CARD_LABELS.FOCUS_AREA,
    value: profile?.category.categoryName ?? STAT_CARD_LABELS.DEFAULT_STAT,
    sub: STAT_CARD_LABELS.CATEGORY,
  },
  {
    label: STAT_CARD_LABELS.LEVEL,
    value: profile?.level?.levelName ?? STAT_CARD_LABELS.NOT_SET,
    sub: STAT_CARD_LABELS.CURRENT_LEVEL,
  },
];
