import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import { SystemStatusCards } from '../../components/admin/SystemStatusCards';
import adminApi from '../../api/adminApi';
import { systemApi } from '../../api/systemApi';
import type { SystemStatus } from '../../api/systemApi';
import referenceApi from '../../api/referenceApi';
import { useAuthStore } from '../../api/useAuthStore';

interface DashboardStats {
  users: number;
  pendingQuestions: number;
  entities: number;
}

export default function AdminDashboardPage() {
  const role = useAuthStore((s) => s.role);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({ users: 0, pendingQuestions: 0, entities: 0 });
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [usersRes, pendingRes, categoriesRes, difficultiesRes, tagsRes, levelsRes, countriesRes, languagesRes, themesRes, rolesRes] =
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

        const users = usersRes.data.isSuccess ? usersRes.data.data.totalCount : 0;
        const pendingQuestions = pendingRes.data.isSuccess ? pendingRes.data.data.totalCount : 0;
        const entities = [
          categoriesRes,
          difficultiesRes,
          tagsRes,
          levelsRes,
          countriesRes,
          languagesRes,
          themesRes,
          rolesRes,
        ].reduce((acc, res) => {
          if (!res.data.isSuccess) return acc;
          return acc + res.data.data.length;
        }, 0);

        setStats({ users, pendingQuestions, entities });
      } catch {
        toast.error('Failed to load admin dashboard metrics.');
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

  return (
    <AdminPanelLayout
      title="Admin dashboard"
      subtitle="Manage platform users, moderate pending questions, and maintain all reference entities from one place."
    >
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <SystemStatusCards status={systemStatus} loading={statusLoading} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['users', 'pending', 'entities'].map((skeletonKey) => (
            <div key={skeletonKey} className="bg-white border border-periwinkle rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-periwinkle rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-navy/35">Users</p>
              <p className="text-3xl text-navy mt-1" style={{ fontFamily: 'DM Serif Display, serif' }}>{stats.users}</p>
              <Link to="/admin/users" className="text-xs text-cornflower hover:underline mt-2 inline-block">Open users</Link>
            </div>
            <div className="bg-white border border-periwinkle rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-navy/35">Pending questions</p>
              <p className="text-3xl text-navy mt-1" style={{ fontFamily: 'DM Serif Display, serif' }}>{stats.pendingQuestions}</p>
              <Link to="/admin/questions/pending" className="text-xs text-cornflower hover:underline mt-2 inline-block">Open moderation</Link>
            </div>
            <div className="bg-white border border-periwinkle rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-navy/35">Entities</p>
              <p className="text-3xl text-navy mt-1" style={{ fontFamily: 'DM Serif Display, serif' }}>{stats.entities}</p>
              <Link to="/admin/reference" className="text-xs text-cornflower hover:underline mt-2 inline-block">Open entities CRUD</Link>
            </div>
          </div>

          <div className="bg-white border border-periwinkle rounded-2xl p-6">
            <p className="text-sm font-medium text-navy mb-3">Quick actions</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/users" className="border border-periwinkle text-navy/70 hover:text-navy hover:border-cornflower rounded-lg px-3 py-2 text-sm transition-colors">Manage users</Link>
              <Link to="/admin/questions/pending" className="border border-periwinkle text-navy/70 hover:text-navy hover:border-cornflower rounded-lg px-3 py-2 text-sm transition-colors">Review pending questions</Link>
              <Link to="/admin/reference" className="border border-periwinkle text-navy/70 hover:text-navy hover:border-cornflower rounded-lg px-3 py-2 text-sm transition-colors">Edit entities</Link>
            </div>
          </div>
        </>
      )}
    </AdminPanelLayout>
  );
}
