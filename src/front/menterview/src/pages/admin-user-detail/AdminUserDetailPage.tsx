import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import { confirmToast } from '../../components/common/confirmToast';
import type { AdminUserDetailsDto } from '../../api/models/adminModels';
import { ADMIN_USER_DETAIL_TEXT } from './AdminUserDetailConstants';
import { ADMIN_USER_ROLE_OPTIONS, formatJoinedDate } from './AdminUserDetailHelpers';

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUserDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [savingRole, setSavingRole] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    if (!userId) {
      return;
    }

    adminApi
      .getUser(userId)
      .then((response) => {
        if (response.data.isSuccess) {
          setUser(response.data.data);
          const currentRole = ADMIN_USER_ROLE_OPTIONS.find(
            (role) => role.roleName === response.data.data.roleName
          );
          setSelectedRoleId(currentRole?.roleId ?? null);
        } else {
          toast.error(ADMIN_USER_DETAIL_TEXT.NOT_FOUND);
        }
      })
      .catch(() => toast.error(ADMIN_USER_DETAIL_TEXT.USER_DELETE_FAILED))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSaveRole = async () => {
    if (!userId || selectedRoleId === null) {
      return;
    }

    setSavingRole(true);
    try {
      const response = await adminApi.assignRole(userId, { roleId: selectedRoleId });

      if (response.data.isSuccess) {
        toast.success(ADMIN_USER_DETAIL_TEXT.ROLE_UPDATED);
        setUser((currentUser) => {
          if (!currentUser) {
            return currentUser;
          }

          const newRoleName =
            ADMIN_USER_ROLE_OPTIONS.find((role) => role.roleId === selectedRoleId)?.roleName ??
            currentUser.roleName;
          return { ...currentUser, roleName: newRoleName };
        });
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(ADMIN_USER_DETAIL_TEXT.ROLE_UPDATE_FAILED);
    } finally {
      setSavingRole(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !user) {
      return;
    }

    const confirmed = await confirmToast(
      ADMIN_USER_DETAIL_TEXT.CONFIRM_DELETE_MESSAGE(user.email),
      {
        title: ADMIN_USER_DETAIL_TEXT.CONFIRM_DELETE_TITLE,
        confirmText: ADMIN_USER_DETAIL_TEXT.CONFIRM_DELETE_BUTTON,
        danger: true,
      }
    );

    if (!confirmed) {
      return;
    }

    setDeletingUser(true);
    try {
      const response = await adminApi.softDeleteUser(userId);

      if (response.data.isSuccess) {
        toast.success(ADMIN_USER_DETAIL_TEXT.USER_DELETED);
        navigate('/admin/users');
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(ADMIN_USER_DETAIL_TEXT.USER_DELETE_FAILED);
    } finally {
      setDeletingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-snow">
        <p className="text-sm text-navy/40">{ADMIN_USER_DETAIL_TEXT.LOADING}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-snow">
        <div className="text-center">
          <p className="mb-4 text-navy/40">{ADMIN_USER_DETAIL_TEXT.NOT_FOUND}</p>
          <Link to="/admin/users" className="text-sm text-cornflower hover:underline">
            {ADMIN_USER_DETAIL_TEXT.BACK_TO_USERS}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminPanelLayout
      title={ADMIN_USER_DETAIL_TEXT.TITLE}
      subtitle={ADMIN_USER_DETAIL_TEXT.SUBTITLE}
    >
      <div className="mb-4 rounded-2xl border border-periwinkle bg-white p-8">
        <h1 className="mb-1 text-2xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {user.firstName} {user.lastName}
        </h1>
        <p className="mb-6 text-sm text-navy/50">{user.email}</p>

        <div className="space-y-3 text-sm">
          {[
            { label: ADMIN_USER_DETAIL_TEXT.CATEGORY, value: user.categoryName || '—' },
            { label: ADMIN_USER_DETAIL_TEXT.LEVEL, value: user.levelName ?? ADMIN_USER_DETAIL_TEXT.NOT_SET },
            { label: ADMIN_USER_DETAIL_TEXT.SESSIONS, value: typeof user.sessionCount === 'number' ? String(user.sessionCount) : '—' },
            { label: ADMIN_USER_DETAIL_TEXT.JOINED, value: formatJoinedDate(user.createdAt) },
            {
              label: ADMIN_USER_DETAIL_TEXT.STATUS,
              value: user.isDeleted ? ADMIN_USER_DETAIL_TEXT.DELETED : ADMIN_USER_DETAIL_TEXT.ACTIVE,
            },
          ].map((row) => (
            <div key={row.label} className="flex justify-between border-b border-periwinkle py-2 last:border-b-0">
              <span className="text-xs text-navy/40">{row.label}</span>
              <span className="text-navy">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-periwinkle bg-white p-6">
        <p className="mb-3 text-sm font-medium text-navy">{ADMIN_USER_DETAIL_TEXT.ASSIGN_ROLE}</p>
        <div className="mb-3 flex gap-2">
          {ADMIN_USER_ROLE_OPTIONS.map((role) => (
            <button
              key={role.roleId}
              onClick={() => setSelectedRoleId(role.roleId)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selectedRoleId === role.roleId
                  ? 'border-cornflower bg-cornflower/5 font-medium text-navy'
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
          className="rounded-lg bg-navy px-4 py-2 text-xs text-white transition-colors hover:bg-cornflower disabled:opacity-50"
        >
          {savingRole ? ADMIN_USER_DETAIL_TEXT.SAVING_ROLE : ADMIN_USER_DETAIL_TEXT.SAVE_ROLE}
        </button>
      </div>

      {!user.isDeleted && (
        <div className="rounded-2xl border border-red-100 bg-white p-6">
          <p className="mb-2 text-sm font-medium text-red-600">{ADMIN_USER_DETAIL_TEXT.DANGER_ZONE}</p>
          <p className="mb-4 text-xs text-navy/40">{ADMIN_USER_DETAIL_TEXT.SOFT_DELETE_WARNING}</p>
          <button
            onClick={handleDelete}
            disabled={deletingUser}
            className="rounded-lg bg-red-500 px-4 py-2 text-xs text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {deletingUser ? ADMIN_USER_DETAIL_TEXT.DELETING_USER : ADMIN_USER_DETAIL_TEXT.DELETE_USER}
          </button>
        </div>
      )}
    </AdminPanelLayout>
  );
}
