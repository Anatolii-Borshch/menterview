import type { AdminUserListItemDto } from '../../api/models/adminModels';

export interface AdminUsersState {
  users: AdminUserListItemDto[];
  totalCount: number;
  loading: boolean;
}

export interface AdminUsersTableRow {
  userId: number;
  name: string;
  email: string;
  category: string;
  role: string;
  joined: string;
}
