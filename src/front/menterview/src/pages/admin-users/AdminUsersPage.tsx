import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import type { AdminUserListItemDto } from '../../api/models/adminModels';
import { ADMIN_USERS_CONSTANTS, ADMIN_USERS_TEXT } from './AdminUsersConstants';
import { calculateTotalPages, formatUserDate, getRoleBadgeClasses } from './AdminUsersHelpers';

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
      const response = await adminApi.getUsers({
        page,
        pageSize: ADMIN_USERS_CONSTANTS.PAGE_SIZE,
        search: search || undefined,
      });

      if (response.data.isSuccess) {
        setUsers(response.data.data.items);
        setTotalCount(response.data.data.totalCount);
      }
    } catch {
      toast.error(ADMIN_USERS_TEXT.FAILED_TO_LOAD_USERS);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = calculateTotalPages(totalCount, ADMIN_USERS_CONSTANTS.PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearchParams(value ? { search: value } : {});
  };

  const handlePreviousPage = () => {
    setSearchParams({ page: String(page - 1), ...(search ? { search } : {}) });
  };

  const handleNextPage = () => {
    setSearchParams({ page: String(page + 1), ...(search ? { search } : {}) });
  };

  return (
    <AdminPanelLayout title={ADMIN_USERS_TEXT.TITLE} subtitle={ADMIN_USERS_TEXT.SUBTITLE}>
      <div className="mb-4">
        <input
          type="text"
          placeholder={ADMIN_USERS_TEXT.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          className="w-full max-w-sm rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy focus:border-cornflower focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-14 rounded-xl border border-periwinkle bg-white animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-periwinkle bg-white p-12 text-center">
          <p className="text-sm text-navy/40">{ADMIN_USERS_TEXT.NO_USERS_FOUND}</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-periwinkle bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-periwinkle">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-navy/40">
                    {ADMIN_USERS_TEXT.USER_COLUMN}
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-navy/40 md:table-cell">
                    {ADMIN_USERS_TEXT.CATEGORY_COLUMN}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-navy/40">
                    {ADMIN_USERS_TEXT.ROLE_COLUMN}
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-navy/40 sm:table-cell">
                    {ADMIN_USERS_TEXT.JOINED_COLUMN}
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-periwinkle">
                {users.map((user) => (
                  <tr key={user.userId} className={user.isDeleted ? 'opacity-40' : ''}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-navy/40">{user.email}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-navy/60 md:table-cell">{user.categoryName}</td>
                    <td className="px-4 py-3">
                      <span className={getRoleBadgeClasses(user.roleName)}>{user.roleName}</span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-navy/40 sm:table-cell">
                      {formatUserDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={`/admin/users/${user.userId}`} className="text-xs text-cornflower hover:underline">
                        {ADMIN_USERS_TEXT.DETAILS_LINK}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={handlePreviousPage}
                className="rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy transition-colors hover:border-navy/30 disabled:opacity-40"
              >
                {ADMIN_USERS_TEXT.PREVIOUS_PAGE}
              </button>
              <span className="text-sm text-navy/50">{ADMIN_USERS_TEXT.PAGE_OF(page, totalPages)}</span>
              <button
                disabled={page >= totalPages}
                onClick={handleNextPage}
                className="rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy transition-colors hover:border-navy/30 disabled:opacity-40"
              >
                {ADMIN_USERS_TEXT.NEXT_PAGE}
              </button>
            </div>
          )}
        </>
      )}
    </AdminPanelLayout>
  );
}
