import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import { SystemStatusCards } from '../../components/admin/SystemStatusCards';
import adminApi from '../../api/adminApi';
import referenceApi from '../../api/referenceApi';
import { systemApi } from '../../api/systemApi';
import type { SystemStatus } from '../../api/systemApi';
import { useAuthStore } from '../../api/useAuthStore';
import { ADMIN_DASHBOARD_TEXT } from './AdminDashboardConstants';
import {
  buildAdminDashboardActionLinks,
  buildAdminDashboardMetricCards,
  createInitialAdminDashboardStats,
} from './AdminDashboardHelpers';
import { AdminDashboardMetrics } from './AdminDashboardMetrics';
import { AdminDashboardQuickActions } from './AdminDashboardQuickActions';
import type { AdminDashboardStats } from './AdminDashboardTypes';

export default function AdminDashboardPage() {
  const role = useAuthStore((store) => store.role);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats>(createInitialAdminDashboardStats);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [usersResponse, pendingResponse, categoriesResponse, difficultiesResponse, tagsResponse, levelsResponse, countriesResponse, languagesResponse, themesResponse, rolesResponse] =
          await Promise.all([
            adminApi.getUsers({ page: 1, pageSize: 1 }),
            adminApi.getPendingQuestions(),
            referenceApi.getCategories(),
            referenceApi.getDifficulties(),
            referenceApi.getTags(),
            referenceApi.getLevels(),
            referenceApi.getCountries(),
            referenceApi.getLanguages(),
            referenceApi.getThemes(),
            referenceApi.getRoles(),
          ]);

        const users = usersResponse.data.isSuccess ? usersResponse.data.data.totalCount : 0;
        const pendingQuestions = pendingResponse.data.isSuccess ? pendingResponse.data.data.totalCount : 0;
        const entities = [
          categoriesResponse,
          difficultiesResponse,
          tagsResponse,
          levelsResponse,
          countriesResponse,
          languagesResponse,
          themesResponse,
          rolesResponse,
        ].reduce((accumulator, response) => {
          if (!response.data.isSuccess) {
            return accumulator;
          }

          return accumulator + response.data.data.length;
        }, 0);

        setStats({ users, pendingQuestions, entities });
      } catch {
        toast.error(ADMIN_DASHBOARD_TEXT.FAILED_TO_LOAD_METRICS);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (role !== 'Administrator') {
      setStatusLoading(false);
      return;
    }

    const loadSystemStatus = async () => {
      try {
        setStatusLoading(true);
        const status = await systemApi.getStatus();
        setSystemStatus(status);
      } catch {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      } finally {
        setStatusLoading(false);
      }
    };

    loadSystemStatus();
    pollIntervalRef.current = setInterval(loadSystemStatus, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [role]);

  const metricCards = buildAdminDashboardMetricCards(stats);
  const actionLinks = buildAdminDashboardActionLinks();

  return (
    <AdminPanelLayout title={ADMIN_DASHBOARD_TEXT.TITLE} subtitle={ADMIN_DASHBOARD_TEXT.SUBTITLE}>
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{ADMIN_DASHBOARD_TEXT.SYSTEM_STATUS}</h2>
        <SystemStatusCards status={systemStatus} loading={statusLoading} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {['users', 'pending', 'entities'].map((skeletonKey) => (
            <div key={skeletonKey} className="h-32 rounded-2xl border border-periwinkle bg-white animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <AdminDashboardMetrics cards={metricCards} />
          <AdminDashboardQuickActions actions={actionLinks} />
        </>
      )}
    </AdminPanelLayout>
  );
}
