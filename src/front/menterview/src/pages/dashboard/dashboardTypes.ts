import type { UserProfileDto } from '../../api/models/profileModels';
import type { SessionListItemDto } from '../../api/models/sessionModels';

export interface AccuracyColorConfig {
  bgClass: string;
  textClass: string;
}

export interface DashboardStatCard {
  label: string;
  value: string;
  sub: string;
}

export interface DashboardSessionItem {
  sessionId: SessionListItemDto['sessionId'];
  averageAccuracy: SessionListItemDto['averageAccuracy'];
  questionsAmount: SessionListItemDto['questionsAmount'];
  totalTime: SessionListItemDto['totalTime'];
  time: SessionListItemDto['time'];
  category?: SessionListItemDto['category'];
}

export interface DashboardProfile {
  firstName: UserProfileDto['firstName'];
  category: UserProfileDto['category'];
  level: UserProfileDto['level'];
  difficulty: UserProfileDto['difficulty'];
}
