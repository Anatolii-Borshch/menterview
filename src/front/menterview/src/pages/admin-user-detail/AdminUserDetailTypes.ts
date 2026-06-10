import type { AdminUserDetailsDto } from '../../api/models/adminModels';

export interface RoleOption {
  roleId: number;
  roleName: string;
}

export interface AdminUserDetailState {
  user: AdminUserDetailsDto | null;
  loading: boolean;
  selectedRoleId: number | null;
  savingRole: boolean;
  deletingUser: boolean;
}
