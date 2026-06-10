import { Link } from 'react-router-dom';
import { ADMIN_DASHBOARD_TEXT } from './AdminDashboardConstants';
import type { AdminDashboardActionLink } from './AdminDashboardTypes';

interface AdminDashboardQuickActionsProps {
  actions: AdminDashboardActionLink[];
}

export const AdminDashboardQuickActions = ({ actions }: AdminDashboardQuickActionsProps) => (
  <div className="rounded-2xl border border-periwinkle bg-white p-6">
    <p className="mb-3 text-sm font-medium text-navy">{ADMIN_DASHBOARD_TEXT.QUICK_ACTIONS}</p>
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.to}
          className="rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy/70 transition-colors hover:border-cornflower hover:text-navy"
        >
          {action.label}
        </Link>
      ))}
    </div>
  </div>
);
