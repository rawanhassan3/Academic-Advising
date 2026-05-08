import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login    from './pages/Login';
import Register from './pages/Register';

// Shared
import Profile       from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';

// Role dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import AdvisorDashboard from './pages/advisor/AdvisorDashboard';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminStudents    from './pages/admin/Students';
import AdminAdvisors    from './pages/admin/Advisors';
import AdminCourses     from './pages/admin/Courses';
import AdminRequests    from './pages/admin/Requests';
import AddAdvisor       from './pages/admin/AddAdvisor';
import Analytics        from './pages/admin/Analytics';

const ROLE_HOME = { student: '/student', advisor: '/advisor', admin: '/admin' };

/** Redirect logged-in users away from public pages */
const PublicRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  if (loading) return <Loader />;
  if (token && user) return <Navigate to={ROLE_HOME[user.role] || '/student'} replace />;
  return children;
};

/** Redirect /dashboard → role-specific home */
const DashboardRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={ROLE_HOME[user?.role] || '/login'} replace />;
};

function App() {
  const { loading } = useAuth();
  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* ── Any authenticated user ── */}
        <Route element={<ProtectedRoute allowedRoles={['student','advisor','admin']} />}>
          <Route path="/profile"       element={<Profile />} />
          <Route path="/updateprofile" element={<UpdateProfile />} />
          <Route path="/dashboard"     element={<DashboardRedirect />} />
        </Route>

        {/* ── Student ── */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>

        {/* ── Advisor ── */}
        <Route element={<ProtectedRoute allowedRoles={['advisor']} />}>
          <Route path="/advisor" element={<AdvisorDashboard />} />
        </Route>

        {/* ── Admin ── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin"             element={<AdminDashboard />} />
          <Route path="/admin/students"    element={<AdminStudents />} />
          <Route path="/admin/advisors"    element={<AdminAdvisors />} />
          <Route path="/admin/courses"     element={<AdminCourses />} />
          <Route path="/admin/requests"    element={<AdminRequests />} />
          <Route path="/admin/add-advisor" element={<AddAdvisor />} />
          <Route path="/admin/analytics"   element={<Analytics />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
