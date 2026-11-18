import { Navigate } from 'react-router-dom';
import { useAdminAccess } from '../context/admin-access-context';

// No portal session, profile metadata or license hint grants admin access.
export function AdminRoute({ children }) {
  const { access } = useAdminAccess();
  return access ? children : <Navigate to="/portal" replace />;
}
