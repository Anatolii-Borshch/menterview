import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../api/useAuthStore';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};