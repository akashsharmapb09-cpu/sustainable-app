import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/authContextDef';

interface Props {
  redirectTo?: string;
}

export function PublicOnlyRoute({ redirectTo = '/dashboard' }: Props) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-4 w-4 animate-spin text-burnt" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
