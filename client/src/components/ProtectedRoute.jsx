import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
import Layout from './Layout';

const ROLE_HOME = { student: '/student', advisor: '/advisor', admin: '/admin' };

/**
 * allowedRoles: string[]
 * If the logged-in user's role is NOT in allowedRoles → redirect to their own home.
 * If no allowedRoles provided → any authenticated user is allowed.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <Loader />;

  if (!token || !user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
