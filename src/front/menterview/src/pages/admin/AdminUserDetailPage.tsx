import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import type { AdminUserDetailsDto } from '../../api/models/adminModels';

interface RoleOption { roleId: number; roleName: string }

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUserDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles] = useState<RoleOption[]>([
    { roleId: 1, roleName: 'Administrator' },
    { roleId: 2, roleName: 'User' },
  ]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [savingRole, setSavingRole] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    if (!userId) return;
    adminApi
      .getUser(userId)
      .then((res) => {
        if (res.data.isSuccess) {
          setUser(res.data.data);
          const currentRole = roles.find((r) => r.roleName === res.data.data.roleName);
          setSelectedRoleId(currentRole?.roleId ?? null);
        } else {
          toast.error('User not found.');
        }
      })
      .catch(() => toast.error('Failed to load user.'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSaveRole = async () => {
    if (!userId || selectedRoleId === null) return;
    setSavingRole(true);
    try {
      const res = await adminApi.assignRole(userId, { roleId: selectedRoleId });
      if (res.data.isSuccess) {
        toast.success('Role updated.');
        setUser((u) => u ? { ...u, roleName: roles.find((r) => r.roleId === selectedRoleId)?.roleName ?? u.roleName } : u);
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to update role.');
    } finally {
      setSavingRole(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    if (!confirm(`Soft-delete ${user?.email}? They can still be restored.`)) return;
    setDeletingUser(true);
    try {
      const res = await adminApi.softDeleteUser(userId);
      if (res.data.isSuccess) {
        toast.success('User deleted.');
        navigate('/admin/users');
      } else {
        res.data.errors.forEach((e: string) => toast.error(e));
      }
    } catch {
      toast.error('Failed to delete user.');
    } finally {
      setDeletingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <p className="text-navy/40 text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy/40 mb-4">User not found.</p>
          <Link to="/admin/users" className="text-cornflower hover:underline text-sm">← Back to users</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-xl mx-auto px-6 py-10">
        <Link to="/admin/users" className="text-sm text-navy/50 hover:text-navy mb-6 inline-block">
          ← Users
        </Link>

        <div className="bg-white border border-periwinkle rounded-2xl p-8 mb-4">
          <h1 className="text-2xl text-navy mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-navy/50 mb-6">{user.email}</p>

          <div className="space-y-3 text-sm">
            {[
              { label: 'Category', value: user.categoryName },
              { label: 'Level', value: user.levelName ?? 'Not set' },
              { label: 'Difficulty', value: user.difficultyName },
              { label: 'Sessions', value: String(user.sessionCount) },
              { label: 'Joined', value: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'Status', value: user.isDeleted ? 'Deleted' : 'Active' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between py-2 border-b border-periwinkle last:border-b-0">
                <span className="text-navy/40 text-xs">{row.label}</span>
                <span className="text-navy">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role assignment */}
        <div className="bg-white border border-periwinkle rounded-2xl p-6 mb-4">
          <p className="text-sm font-medium text-navy mb-3">Assign role</p>
          <div className="flex gap-2 mb-3">
            {roles.map((role) => (
              <button
                key={role.roleId}
                onClick={() => setSelectedRoleId(role.roleId)}
                className={`py-1.5 px-4 rounded-full border text-sm transition-colors ${
                  selectedRoleId === role.roleId
                    ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                    : 'border-periwinkle text-navy/60 hover:border-navy/30'
                }`}
              >
                {role.roleName}
              </button>
            ))}
          </div>
          <button
            onClick={handleSaveRole}
            disabled={savingRole || selectedRoleId === null}
            className="bg-navy text-white text-xs px-4 py-2 rounded-lg hover:bg-cornflower transition-colors disabled:opacity-50"
          >
            {savingRole ? 'Saving…' : 'Save role'}
          </button>
        </div>

        {/* Danger zone */}
        {!user.isDeleted && (
          <div className="bg-white border border-red-100 rounded-2xl p-6">
            <p className="text-sm font-medium text-red-600 mb-2">Danger zone</p>
            <p className="text-xs text-navy/40 mb-4">Soft-delete this user. Their data will be retained.</p>
            <button
              onClick={handleDelete}
              disabled={deletingUser}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {deletingUser ? 'Deleting…' : 'Delete user'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
