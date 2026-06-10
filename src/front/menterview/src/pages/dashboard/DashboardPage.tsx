import { useEffect, useState } from 'react';
import { useAuthStore } from '../../api/useAuthStore';
import profileApi from '../../api/profileApi';
import interviewApi from '../../api/interviewApi';
import type { UserProfileDto } from '../../api/models/profileModels';
import type { SessionListItemDto } from '../../api/models/sessionModels';
import { MESSAGES } from '../../constants';
import { calculateAverageFromProperty } from '../../utils';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStatsCards } from './DashboardStatsCards';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardRecentSessions } from './DashboardRecentSessions';
import { DASHBOARD_CONSTANTS } from './dashboardConstants';
import { buildDashboardStatCards } from './dashboardHelpers';

export default function DashboardPage() {
  const { userId } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [sessions, setSessions] = useState<SessionListItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileResponse, sessionsResponse] = await Promise.all([
          profileApi.getProfile(),
          interviewApi.getSessions({ pageSize: DASHBOARD_CONSTANTS.SESSION_PAGE_SIZE }),
        ]);

        if (profileResponse.data.isSuccess) {
          setProfile(profileResponse.data.data);
        }

        if (sessionsResponse.data.isSuccess) {
          setSessions(sessionsResponse.data.data.items);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const avgScore = sessions.length > 0 ? calculateAverageFromProperty(sessions, 'averageAccuracy') : null;
  const statCards = buildDashboardStatCards(sessions, profile, avgScore);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-snow">
        <p className="text-sm text-navy/40">{MESSAGES.LOADING}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <DashboardHeader profile={profile} titleFallback="Dashboard" />
        <DashboardStatsCards statCards={statCards} />
        <DashboardQuickActions />
        <DashboardRecentSessions sessions={sessions} />
      </div>
    </div>
  );
}
