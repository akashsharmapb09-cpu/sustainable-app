import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/authContextDef';

interface Props {
  redirectTo?: string;
}

export function ProtectedRoute({ redirectTo = '/login' }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
          <Loader2 className="h-4 w-4 animate-spin text-burnt" />
          <span>VERIFYING SESSION…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
