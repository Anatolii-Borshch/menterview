import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../api/useAuthStore';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'Administrator') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};