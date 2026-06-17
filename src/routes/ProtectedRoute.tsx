import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRouteProps } from '../types';

// Route guard: shows a loader while validating the token,
// then either renders the children or redirects to /login.
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Remember where the user came from so we can redirect back after login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
