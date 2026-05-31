import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import type { AdminUserListItemDto } from '../../api/models/adminModels';

const PAGE_SIZE = 15;

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<AdminUserListItemDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const search = searchParams.get('search') ?? '';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, pageSize: PAGE_SIZE, search: search || undefined });
      if (res.data.isSuccess) {
        setUsers(res.data.data.items);
        setTotalCount(res.data.data.totalCount);
      }
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const roleBadge = (role: string) => {
    const base = 'text-xs border rounded-full px-2.5 py-0.5 font-medium';
    if (role === 'Administrator') return `${base} border-purple-100 bg-purple-50 text-purple-600`;
    return `${base} border-periwinkle text-navy/60`;
  };

  return (
    <AdminPanelLayout
      title="Users"
      subtitle="Search users, inspect details, manage roles, and apply delete actions."
    >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              const v = e.target.value;
              setSearchParams(v ? { search: v } : {});
            }}
            className="w-full max-w-sm border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-cornflower"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-periwinkle rounded-xl h-14 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white border border-periwinkle rounded-2xl p-12 text-center">
            <p className="text-navy/40 text-sm">No users found.</p>
          </div>
        ) : (
          <>
            <div className="bg-white border border-periwinkle rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-periwinkle">
                    <th className="text-left px-4 py-3 text-xs font-medium text-navy/40 uppercase tracking-wide">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-navy/40 uppercase tracking-wide hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-navy/40 uppercase tracking-wide">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-navy/40 uppercase tracking-wide hidden sm:table-cell">Joined</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-periwinkle">
                  {users.map((user) => (
                    <tr key={user.userId} className={user.isDeleted ? 'opacity-40' : ''}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-navy/40">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-navy/60 hidden md:table-cell">{user.categoryName}</td>
                      <td className="px-4 py-3">
                        <span className={roleBadge(user.roleName)}>{user.roleName}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-navy/40 hidden sm:table-cell">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/users/${user.userId}`}
                          className="text-xs text-cornflower hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => setSearchParams({ page: String(page - 1), ...(search ? { search } : {}) })}
                  className="border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy hover:border-navy/30 disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-sm text-navy/50">Page {page} of {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setSearchParams({ page: String(page + 1), ...(search ? { search } : {}) })}
                  className="border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy hover:border-navy/30 disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
    </AdminPanelLayout>
  );
}
