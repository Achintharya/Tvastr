import { Navigate } from 'react-router-dom';
import { useAdminAccess } from '../context/admin-access-context';

// Password opens the shell only. Customers and private assets remain server-authorized.
export function AdminRoute({ children }) {
  const { portal } = useAdminAccess();
  return portal ? children : <Navigate to="/portal" replace />;
}
