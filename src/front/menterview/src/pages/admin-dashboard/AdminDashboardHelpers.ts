import { ADMIN_DASHBOARD_TEXT } from './AdminDashboardConstants';
import type { AdminDashboardActionLink, AdminDashboardMetricCard, AdminDashboardStats } from './AdminDashboardTypes';

export const createInitialAdminDashboardStats = (): AdminDashboardStats => ({
  users: 0,
  pendingQuestions: 0,
  entities: 0,
});

export const buildAdminDashboardMetricCards = (stats: AdminDashboardStats): AdminDashboardMetricCard[] => [
  {
    title: ADMIN_DASHBOARD_TEXT.USERS,
    value: stats.users,
    ctaLabel: ADMIN_DASHBOARD_TEXT.OPEN_USERS,
    to: '/admin/users',
  },
  {
    title: ADMIN_DASHBOARD_TEXT.PENDING_QUESTIONS,
    value: stats.pendingQuestions,
    ctaLabel: ADMIN_DASHBOARD_TEXT.OPEN_MODERATION,
    to: '/admin/questions/pending',
  },
  {
    title: ADMIN_DASHBOARD_TEXT.ENTITIES,
    value: stats.entities,
    ctaLabel: ADMIN_DASHBOARD_TEXT.OPEN_ENTITIES,
    to: '/admin/reference',
  },
];

export const buildAdminDashboardActionLinks = (): AdminDashboardActionLink[] => [
  {
    label: ADMIN_DASHBOARD_TEXT.MANAGE_USERS,
    to: '/admin/users',
  },
  {
    label: ADMIN_DASHBOARD_TEXT.REVIEW_PENDING_QUESTIONS,
    to: '/admin/questions/pending',
  },
  {
    label: ADMIN_DASHBOARD_TEXT.EDIT_ENTITIES,
    to: '/admin/reference',
  },
];
