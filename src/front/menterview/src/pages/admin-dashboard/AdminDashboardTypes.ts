export interface AdminDashboardStats {
  users: number;
  pendingQuestions: number;
  entities: number;
}

export interface AdminDashboardMetricCard {
  title: string;
  value: number;
  ctaLabel: string;
  to: string;
}

export interface AdminDashboardActionLink {
  label: string;
  to: string;
}
